import express from 'express'
import User from './mongodb.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router()

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
  

router.post('/signup', async (req, res) => {
    const { userName, email, password } = req.body;
    try {


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const encrypted = await bcrypt.hash(password, 10)

        const newUser = new User({ userName, email, password: encrypted });




        const token = jwt.sign({ id: newUser._id, email }, 'secret-key', { expiresIn: '1h', })

        newUser.token = token

        newUser.save();

        res.status(200).json({ message: 'Sign up successful' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server error' });
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, 'secret-key', {
            expiresIn: '1h',
        });
        console.log(user);
        user.token = token
        user.password = undefined

        res.status(200).json({ message: 'Sign in successful', user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})


router.get('/getuserdetails', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id; 
      const user = await User.findById(userId); 
  
      
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
router.post('/logout',isAuthenticated, async (req, res) => {
    try {
        const user = req.user; 
        user.token = undefined;
        await user.save();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router
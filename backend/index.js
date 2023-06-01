import express from 'express'
import cors from'cors'
import user from './routes.js'

const app =express()

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());



app.get('/', (req, res) => {
    res.send(`server`);
});

app.use('/',user)

app.listen(8000, () => console.log('server started'));
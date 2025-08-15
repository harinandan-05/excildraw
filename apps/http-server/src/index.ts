import express from 'express';
import router from './routes/route';
const app = express()

app.use(express.json());
app.use('/api/v1',router)

app.listen(3001,() => {
    console.log("express server up")
})
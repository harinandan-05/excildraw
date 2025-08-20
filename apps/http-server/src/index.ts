import express from 'express';
import router from './routes/route';
import cors from 'cors'

const app = express()

app.use(cors({
  origin: "http://localhost:3002",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use('/api/v1',router)


app.listen(3001,() => {
    console.log("express server up")
})
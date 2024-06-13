import express from "express"
import authRoutes from "../backend/routes/auth.routes.js"
import dotenv from "dotenv"
import connectMongoDb from "./db/connectoMongoDb.js"

dotenv.config()
const app = express()

const port = process.env.PORT || 8000

app.get("/", (req, res) => {
  res.json("hello universe, i know i have limited time on this earth, this life is beautiful thank u for giving me this heart in which i can feel such an amazing people and die one day with fullest.")
})


// middleware 
app.use(express.json()) // it is a middleware or regular function which runs btw req and res.
// parse the req.body  
app.use("/api/auth", authRoutes)

// console.log(process.env.MONGODB_URI)

app.listen(port, ()=> {
  console.log(`App is running on ${port}`)
  connectMongoDb()
})
import express from "express"
import authRoutes from "../backend/routes/auth.routes.js"
import dotenv from "dotenv"
import connectMongoDb from "./db/connectoMongoDb.js"
import cookieParser from "cookie-parser"
import usersRoutes from "../backend/routes/users.routes.js"
dotenv.config()
const app = express()

const port = process.env.PORT || 8000

// middleware 
app.use(express.json()) // it is a middleware or regular function which runs btw req and res.
// parse the req.body  
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));  // to parse from data(urlencode)

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
// console.log(process.env.MONGODB_URI)

app.listen(port, ()=> {
  console.log(`App is running on ${port}`)
  connectMongoDb()
})
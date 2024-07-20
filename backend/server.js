import path from "path";
import express from "express"
import authRoutes from "../backend/routes/auth.routes.js"
import dotenv from "dotenv"
import connectMongoDb from "./db/connectoMongoDb.js"
import cookieParser from "cookie-parser"
import usersRoutes from "../backend/routes/users.routes.js"
import {v2 as cloudinary} from 'cloudinary';
import bodyParser from 'body-parser';
import postRoutes from "../backend/routes/post.routes.js"
import notificationRoutes from "../backend/routes/notification.route.js"
dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()

const port = process.env.PORT || 8000;
const __dirname = path.resolve()
// middleware 
app.use(express.json({limit: "10mb"})) // it is a middleware or regular function which runs btw req and res.
// parse the req.body  
// This limit is not to large bcz when attacker  attack send a large req  then it might cause error DOS (Dineal of services)
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));  // to parse from data(urlencode)

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
// console.log(process.env.MONGODB_URI)

if(process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "/frontend/dist")));

   app.get("*", (req,res) => {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
   })
}

app.listen(port, ()=> {
  console.log(`App is running on http://localhost:${port}`)
  connectMongoDb()
})
import mongoose, { Schema, Model } from "mongoose";
import User from "./user.model.js";

const NotificationSchema = new Schema({
    from:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true

    }, 
    
    to:{
       type: Schema.Types.ObjectId,
       ref: "User",
       required: true,
    }, 

    type: {
      type: String,
      required: true,
      enum: ["follow", "like"]
    }, 

    read: {
      type: Boolean,
      default: false
    }
}, {timestamps: true})


const Notification = mongoose.model("Notification", NotificationSchema)

export default Notification
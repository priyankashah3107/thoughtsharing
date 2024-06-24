import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
   username: {
    type: String,
    require: true,
    unique: true
   },
   
   fullname: {
    type: String,
    require: true,
   },

   email: {
    type: String,
    require: true,
    unique: true
   },

   password: {
    type: String,
    require: true
   },

   followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
     }],
  
     following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
     }],

   profileImg: {
    type: String,
    default: ""
   },
    
   coverImg: {
    type: String,
    default: ""
   },

   link: {
    type: String,
    default: ""
   },
   
   bio: {
    type: String,
    default: ""
   },

   likedPosts: [
      {
         type: Schema.Types.ObjectId,
         ref: "Post",
         default: []
      },
   ],

}, {timestamps: true})

const User = new mongoose.model("User", userSchema)

export default User;
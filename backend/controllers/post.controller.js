import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import {v2 as cloudinary} from 'cloudinary';
export const createPost = async(req, res) => {
 try {
  const {text} = req.body;
  let {img} = req.body;
  const userId = req.user._id.toString();

  const user = await User.findById(userId)

  if(!user) return res.status(404).json({error: "User not found"});

  if(!text && !img) {
     return res.status(400).json({error: "Post Must have contain text and image"})
  }
   
  if(img) {
    const responseUploaded = await cloudinary.uploader.upload(img)
    img = responseUploaded.secure_url;
  }
 
  const newPost  = new Post({
     user: userId,
     text,
     img,
  })
  await newPost.save();
  res.status(200).json({newPost})

 } catch (error) {
   res.status(500).json({error: "Internal server error"});
   console.error("Error in post controllerJs ", error)
 }
}




export const likeOrUnLikePost = async(req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)


  } catch (error) {
   
  }
 }



 export const commentOnPost = async(req, res) => {
  try {
   
  } catch (error) {
   
  }
 }


 export const deletePost = async(req, res) => {
  try {
    const post = await User.findById(req.params.id);
    if(!post) return res.status(404).json({error: "Post is not found!"});

    if(post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({error: "You are not authorized to delete this post"})
    } 

    if(post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId)
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Post Deleted successfully"})
  } catch (error) {
     res.status(500).json({error: "Internal Server Error"})
     console.error("Error in DeletePost Controller", error)
  }
 }
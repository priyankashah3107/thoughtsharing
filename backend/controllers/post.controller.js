import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import {v2 as cloudinary} from 'cloudinary';
import Notification from "../models/notifications.model.js";

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
    const userId = req.user._id;
    const {id: postId} = req.params;

     const post  = await Post.findById(postId)

     if(!post) return res.status(404).json({error: "Post Not Found!!"});

     const postLiked = post.likes.includes(userId)


     if(postLiked) {
      // post i already liked then unlike it.
      await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
      await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}})
      res.status(200).json({message: "Post Unlike Successfully"})
     }
     else{
      /// Like post 
      post.likes.push(userId)
      await User.updateOne({ _id: userId}, {$push: { likedPosts: postId}})
      await post.save()


      const notification = new Notification({
         from: userId,
         to: post.user,
         type: "like"
      })
      await notification.save()
      res.status(200).json({message: "Like the Post"})
     }

  } catch (error) {
    res.status(500).json({error: "Internal Server Error"})
    console.error("Error in LikeAndUnLike Post ControllerJs", error);
  }
 }



 export const commentOnPost = async(req, res) => {
  try {
   const {text} = req.body;
   const postId = req.params.id;
   const userId = req.user._id;

   if(!text) {
    return res.status(400).json({error: "Text is Required!"})
   }

   const post = await Post.findById(postId)
   if(!post) {
    return res.status(404).json({error: "Post is not found"});
   }

   const comment  = {user: userId, text}
   post.comments.push(comment);

   await post.save();
   res.status(200).json({message: "Comment Done"})
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"});
    console.error("Error in creating a comment Controllerjs", error)
  }
 }


 export const deletePost = async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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



 export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1})
    .populate({
      path: "user",
      select: "-password"
      // select: "-password -email" 
    }) 
    .populate({
      path: "comments.user",
       select: "-password"
      // select: "-password -email"
    })
   

    // if(!posts) {
    //   return res.status(400).json({error: "Post is not found"})
    // }

    if(posts.length === 0) {
      return res.status(200).json([])
    }

    res.status(200).json({posts})

  } catch (error) {
    res.status(500).json({error: "Internal Server Error"})
     console.error("Error in GetAllPost Controller", error)
  }
 }



 export const getLikedPosts = async (req, res) => {
   
   const userId = req.params.id;
   try {
     const user = await User.findById(userId);
     if(!user) {
       return res.status(404).json({error: "User not found!"});
     }

     const likedPosts = await Post.find({ _id: {$in: user.likedPosts}})
     .populate({
      path: "user",
      select: "-password"
     })
     .populate({
       path: "comments.user",
       select: "-password"
     })

     res.status(200).json({likedPosts})
   } catch (error) {
     console.error("Error in GetLikedPosts contollers: ", error);
     res.status(500).json({error: "Internal Server Error"})
   }
 }



 export const getAllFollowing = async (req, res) => {
   try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if(!user) return res.status(404).json({error: "User not found"});
      const following = user.following;
      
      const feedPosts  = await Post.find({user: {$in: following}})
      .sort({createdAt: -1})
      .populate({
        path: "user",
        select: "-password"
      })
      .populate({
        path: "comments.user",
        select: "-password"
      })
      res.status(200).json({feedPosts})
   } catch (error) {
    console.error("Error in GetFollowinf contollers: ", error);
    res.status(500).json({error: "Internal Server Error"})
   }
 }


// export const getAllFollowing = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const following = user.following;
//     if (!following || following.length === 0) {
//       return res.status(200).json({ feedPosts: [] });
//     }

//     const feedPosts = await Post.find({ user: { $in: following } })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "user",
//         select: "-password",
//       })
//       .populate({
//         path: "comments.user",
//         select: "-password",
//       });

//     res.status(200).json({ feedPosts });
//   } catch (error) {
//     console.error("Error in getAllFollowing controller: ", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
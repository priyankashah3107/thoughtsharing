import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const {username} = req.params;
   try {
    const user = await User.findOne({username}).select("-password");
    if(!user) {
       return res.status(404).json({error: "User Not Found"})
    }
    res.status(200).json({user})
   } catch (error) {
    console.error("Error in getUserProfile Controller", error.message);
     res.status(500).json({err: "Internal Server Error"})
   }
}


export const suggestUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}


export const followUnFollowUser = async (req, res) => {
  const {id} = req.params;
  try {
    const userModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()) {
      return res.status(400).json({error: "You cannot follow or unfollow yourself"})
    }
    
    if(!userModify || !currentUser) {
      return res.status(404).json({error: "User not Found"})

    }

    const isFollowing = await currentUser.following.includes(id)
     
    if(isFollowing) {
      // Unfollow the user 
      await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}})
      await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}})
      res.status(200).json({msg: "Unfollowed Uncessfully!"})
    } 
    else {
      // follow the user
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
      await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})
      res.status(200).json({msg: "User Followed Successfully"})
    }
  } catch (error) {
    console.error("Error in FollowUnFollowUser Controller", error.message)
    res.status(500).json({error: "Internal Server Error"})
  }
}


export const updateUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}
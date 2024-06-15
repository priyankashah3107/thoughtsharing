import Notification from "../models/notifications.model.js";
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


export const suggestUserForMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following")
    
    const users = await User.aggregate([
      {
        $match: {_id: {$ne: userId}},
      },
      { $sample: {size: 10}}
    ]);
    // this will gives 10 sample following
    // filtered the User which i alreay follow
    const filteredUser = users.filter((user) => !usersFollowedByMe.following.includes(user._id))
    // take only 5 user as suggestion 
    const suggestUsers = filteredUser.slice(0,4);
    
    suggestUsers.forEach((user) => (user.password = null))

    res.status(200).json({suggestUsers})

  } catch (error) {
    console.error("Error in SuggestedUser Controller", error.message)
    res.status(500).json({error: "Internal Server Error"})
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
      // return the id of the user as response
      res.status(200).json({msg: "Unfollowed Uncessfully!"})
    } 
    else {
      // follow the user
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
      await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})
      // Send Notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userModify._id
      })
      await newNotification.save();
      // return the id of the user as response
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
import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from 'cloudinary';

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


// what things we have to keep in mind while updating the value
// a. take all the things which u want to update from the req.body
// b. find the particualr user using from the userId in the db
// c. if we do not have user in the db return the erro 
// d. if we do not have currentPassword and newPassword in the db then return error 
// $$$$ e . this is the most imp step 
/// if we have currentPassword and newPassword then check is the old password ismatch from the db password.
// f. check length of the newPassword at least greater than 6
//  g. bcrypt or hash the password 

// export const updateUser = async (req, res) => {
//   const {fullname, username, email, link, bio, currentPassword, newPassword} = req.body;
//    let {coverImg, profileImg} = req.body;
//      const userId = req.user._id;
//   try {
//     let user = await User.findById(userId)
//     if(!user) {
//       return res.status(404).json({error: "User Not Found"});
//     }
//     if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
//       return res.status(400).json({error: "Please provide both current and newPassword"});
//     }

//    if(currentPassword && newPassword) {
//     const isMatch = await bcrypt.compare(currentPassword, user.password)
//     if(!isMatch) {
//       return res.status(400).json({error: "Current Password Incorrect password"})
//     } 
//     if(newPassword.length < 6) {
//       return res.status(400).json({error: "Password should be 6 character long"})
//     }
//     // hasing the password
//     const salt = await bcrypt.genSalt(10)
//     user.password = await bcrypt.hash(newPassword, salt);
//   }
//     if(coverImg) {
//       // if coverImg is already exist 
//       if(user.coverImg) {
//         await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
//       }
//        const uploadResponse = await cloudinary.uploader.upload(coverImg)
//        coverImg =  uploadResponse.secure_url;
//     }

//     if(profileImg) {
//       // https://unsplash.com/photos/upload/982301835/jdhfkahkdaewo.png
//       // profile img is already exist 
//       if(user.profileImg) {
//         await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
//       }
//        const uploadResponse = await cloudinary.uploader.upload(profileImg)
//        profileImg = uploadResponse.secure_url
//     }
     
//     user.fullname = fullname || user.fullname;
//     user.email = email || user.email;
//     user.username = username || user.username;
//     user.link = link || user.link;
//     user.bio = bio || user.bio;
//     user.coverImg = coverImg || user.coverImg;
//     user.profileImg = profileImg || user.profileImg;
    
//       user = await user.save();

//       user.password = null;  // ofcouser this password is save in the db

//       res.status(200).json({user})

//   } catch (error) {
//     console.error("Error in Update Controller", error.message)
//     res.status(500).json({error: "Internal Server Error"})
//   }
// }



// export const updateUser = async (req, res) => {
// 	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
// 	let { profileImg, coverImg } = req.body;

// 	const userId = req.user._id;

// 	try {
// 		let user = await User.findById(userId);
// 		if (!user) return res.status(404).json({ message: "User not found" });

// 		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
// 			return res.status(400).json({ error: "Please provide both current password and new password" });
// 		}

// 		if (currentPassword && newPassword) {
// 			const isMatch = await bcrypt.compare(currentPassword, user.password);
// 			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
// 			if (newPassword.length < 6) {
// 				return res.status(400).json({ error: "Password must be at least 6 characters long" });
// 			}

// 			const salt = await bcrypt.genSalt(10);
// 			user.password = await bcrypt.hash(newPassword, salt);
// 		}

// 		if (profileImg) {
// 			if (user.profileImg) {
// 				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
// 				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
// 			}

// 			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
// 			profileImg = uploadedResponse.secure_url;
// 		}

// 		if (coverImg) {
// 			if (user.coverImg) {
// 				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
// 			}

// 			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
// 			coverImg = uploadedResponse.secure_url;
// 		}

// 		user.fullName = fullName || user.fullName;
// 		user.email = email || user.email;
// 		user.username = username || user.username;
// 		user.bio = bio || user.bio;
// 		user.link = link || user.link;
// 		user.profileImg = profileImg || user.profileImg;
// 		user.coverImg = coverImg || user.coverImg;

// 		user = await user.save();

// 		// password should be null in response
// 		user.password = null;

// 		return res.status(200).json(user);
// 	} catch (error) {
// 		console.log("Error in updateUser: ", error.message);
// 		res.status(500).json({ error: error.message });
// 	}
// };


export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link, profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
      let user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
          return res.status(400).json({ error: "Please provide both current password and new password" });
      }

      if (currentPassword && newPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
          if (newPassword.length < 6) {
              return res.status(400).json({ error: "Password must be at least 6 characters long" });
          }

          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newPassword, salt);
      }

      if (profileImg) {
          if (user.profileImg) {
              await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
          }
          const uploadedResponse = await cloudinary.uploader.upload(profileImg);
          user.profileImg = uploadedResponse.secure_url;
      }

      if (coverImg) {
          if (user.coverImg) {
              await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
          }
          const uploadedResponse = await cloudinary.uploader.upload(coverImg);
          user.coverImg = uploadedResponse.secure_url;
      }

      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.link = link || user.link;

      user = await user.save();

      user.password = null;

      return res.status(200).json(user);
  } catch (error) {
      console.log("Error in updateUser: ", error.message);
      res.status(500).json({ error: error.message });
  }
};
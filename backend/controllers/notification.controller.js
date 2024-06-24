import Notification from "../models/notifications.model.js";

export const getNotifications = async (req, res) => {
   
  try {
     
    const userId = req.user._id;

    const notifications = await Notification.find({to: userId}).populate({
      path: "from", 
      select: "username profileImg"
    })
      await Notification.updateMany({to: userId}, {read: true})

      res.status(200).json({notifications})
  } catch (error) {
    console.error("Error in GetNotification ", error);
    res.status(500).json({error: "Internal Server Error"})
  }
}





export const deleteNotifications = async (req, res) => {
   
  try {
    
  } catch (error) {
    
  }
}


export const deleteNotificationById = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}
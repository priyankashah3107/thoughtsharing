// import User from "../models/user.model.js";
// import  jwt from "jsonwebtoken";
// export const protectRoute = async (req, res, next) => {
//    try {
//     const token = req.cookies.jwt;
//     if(!token) {
//       return res.status(401).json({error: "Unauthoized: No Token Provided"});
//     }
    
//     const decode  = jwt.verify(token, process.env.JWT_SECRET)

//     if(!decode) {
//       return res.status(401).json({error: "Invalid Token"})
//     }
     
//     const user = await User.findById(decode.userId).select("-password");

//     if(!user) {
//       return res.status(404).json({error: "Invalid User"})
//     }
     
//     req.user = user;
//     next();

//    } catch (error) {
//     console.log("Error in protectRoute Controller middleware", error.message)
//         res.status(500).json({error: "Internal Server Error"})
//    }
// }


import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
   try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Invalid User" });
    }

    req.user = user;
    next();
   } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
   }
};

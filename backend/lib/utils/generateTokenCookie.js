import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (userId, res) => {
  // generating a token
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "60d"
  })
  
  // assign to cookie 
  res.cookie("jwt", token, {
    maxAge: 60 * 24 * 60 * 60 * 1000, // millisec
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  })
}
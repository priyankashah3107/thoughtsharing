export const signup = async(req,res) => {
     res.json({data: "signup kare!!"})
}

export const login = async(req, res) => {
   res.send("Login kare")
}

export const logout = async(req, res) => {
    res.json({data: "Logout Kare"})
}


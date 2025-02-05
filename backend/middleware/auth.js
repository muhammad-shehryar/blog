const jwt = require("jsonwebtoken")

module.exports = function(req,res,next){
    //get token from header
    const token = req.header("x-auth-token")

    if(!token){
        return res.status(401).json({msg:"Not token,authorization denied"})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded.user;
        next()
    }catch(error){
        res.status(401).json({msg:"Token is not valid"})
    }
}
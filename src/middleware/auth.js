const {User} = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
       
        
        var decoded = jwt.verify(token, 'oluwole')
        
        
        
        const id = decoded._id
        
        
        var user = await User.findOne({_id:id,'tokens.token':token})
        if (!user) {
            throw new Error()
        }
        req.token =token
         req.user=user
        next()

    } catch (error) {
        
        
        res.status(400).send({error:'please Authentic'})
        
    }


     
}
module .exports = auth
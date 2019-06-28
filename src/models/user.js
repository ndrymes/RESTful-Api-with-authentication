 const mongoose = require('mongoose')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const Task = require('./task')
var userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value) {
           if (!validator.isEmail(value)) {
               throw new Error('not a valid email')
           }
        }},

        password:{
            type:String,
            required:true,
            minlength:6
        },
        avatar:{data:Buffer},
        tokens:[{
            access:{
                type:String,
                required:true

            },
            token:{
                type:String,
                required:true
            }
        }]
        
},
{
    timestamps:true
}
)
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON = function () {
    var user = this
    const newUser = user.toObject()
    delete newUser.password
    delete newUser.tokens
    return newUser
}

 userSchema.methods.generateAuthToken = async function() {
     var user = this
     
     
     var access ='auth'
     var token = jwt.sign({ _id:user._id.toString()},'oluwole')
         
      user.tokens=user.tokens.concat({access, token})
     
      await user.save()
     return token;               
 }
userSchema.statics.verifyDetails = async function(email,password) {
    try {
        var user = await User.find({email})
        
        if (!user) {
            throw new Error('not found')
        }
      } catch (error) {
     console.log(error);   
      }
      
     const isMatch =await bcrypt.compare(password,user[0].password)
     if (!isMatch) {     
        throw new Error('user no found')
     }
     
     return user
    }

 userSchema.pre('save',function (next) {
    var user = this
     if (user.isModified('password')) {
         bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(user.password,salt,(err,hash) => {
                user.password = hash
                next()
            })
        })
    }
    
})
userSchema.pre('remove',async function (next) {
    var user = this
    await Task.deleteMany({owner:user._id})
    next()
})
var User = mongoose.model('User',userSchema)
module.exports = {User};

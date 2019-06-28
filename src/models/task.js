var mongoose =require('mongoose')
var taskSchema = new mongoose.Schema({
    todo:{
    type:String,
    required:true,
    minLength:1,
    trim:true
  },
  title:{
   type:String,
   minlength:6,
   required:true,
   trim:true
  },
  location:{
    type:String,
    minLength:12,
  },
  phone:{
    type: Number,
    minLength:11
  },
  completed:{
    type: Boolean,
    default: false
  },
  time:{
    type:Number
  },
  completedAt:{
  type:Number
  
  },
  owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'


  },
  },{
    timestamps:true
  })
var Task =mongoose.model('Task',taskSchema,)
module.exports = Task

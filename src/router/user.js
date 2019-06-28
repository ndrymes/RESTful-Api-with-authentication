
const {User}= require('../models/user.js')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const express = require('express')
const router =  express.Router()


router.post('/',async (req,res) => {
    var body =_.pick(req.body,['email','password']);

    var user = new User(body)
    
     try {
       const token = await user.generateAuthToken();
    
       res.send({user,token})
     } catch (error) {
       res.status(500).send(error)
     }
    
  
  })
  router.post('/login', async (req,res) => {
    var body = _.pick(req.body,['email','password'])
    try {
      var user = await User.verifyDetails(body.email,body.password);
      res.status(200).send(user)
      if (!user) {
        res.status(404).send('user not found')
      }
    } catch (error) {
      res.status(500).send()
    }
  })
  router.post('/logout',auth,async(req,res) => {
    try {
      
      
      req.user.tokens= req.user.tokens.filter((element)=> {
        return element.token !== req.token
      })
     await req.user.save()
      res.send()
    } catch (error) {
      res.status(400).send()
    }
  })
  router.get('/me',auth, (req,res) => {
    res.send(req.user)
  })
  router.delete('/delete/me',auth,async(req,res) => {
   
      await req.user.remove()
      res.status(200).send(req.user)
    })
  
  router.patch('/update/me',auth,async(req,res) => {
  
    let body = _.pick(req.body,['name','email','password'])  
    let bodykeys = Object.keys(body)
    var user = req.user
  
  bodykeys.forEach((keys) => {
    user[keys]=body[keys]
  })
  
    await user.save(); 
  res.status(200).send(user)
  })
  const multer = require('multer')
 const uploads = multer({

   limits:{
       fileSize:1000000,

   },
   fileFilter(req,file,cb){
     if(!file.originalname.match(/\.(doc|docx|pdf)$/)){
       return cb(new Error('Upload a pdf file'))
     }
     cb(undefined, true)
   }
 })
 router.post('/users/me/avatar',auth,uploads.single('avatar'),async(req,res) => {
   const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).toPng().toBuffer()
   req.user.avatar = buffer
   await req.user.save()
   res.send()
 },(err,req,res,next) => {
   res.status(400).send({error:err.message})
 })

 router.delete('/me/avatar',auth,async(req,res) => {
   req.user.avatar= undefined
   res.send()

 })
 router.get('/avatar/:id', async(req,res) => {
   try {
    const user =await User.findById(req.params.id)

    if (!user || user.avatar) {
      throw new Error
    }

    res.set('Content-Type','image/jpg')
    res.send()
   } catch (error) {
     res.status(400).send({error})
   }
 })
 
    
 module.exports = router;

 


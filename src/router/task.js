const Task = require('../models/task')
const auth = require('../middleware/auth')
const _ = require('lodash')
const express = require('express')
const router = express.Router()


router.post('/', auth,async (req,res) => {
    var newtask = new Task({
        ...req.body,
        owner:req.user._id 
    })
    try {
        const task = await newtask.save()
        res.status(200).send(task)
    } catch (error) {
        res.send()
    }
})
router.get('/',auth, async (req,res) => {
     const result = req.query.completed
     const limit = parseInt( req.query.limit)
     const skip = parseInt(req.query.skip) 
     const sortValue= req.query.sortBy
     const match ={}
     const sort ={}

     if (result) {
         match.completed = result ==='true'
     }
     if (sortValue) {
         const parts = sortValue.split(':')
         sort[parts[0]]=parts[1]==='asc'? 1 :-1
         
     }
     
     try {
         await req.user.populate({
             path:'tasks',
             match,
             options:{
                 limit,
                 skip,
                 sort
             }
         }).execPopulate()
         res.status(200).send(req.user.tasks)
     } catch (error) {
         
     }
})
router.get('/:id',auth, async(req,res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner:req.user._id })
        res.status(200).send(task)
    if (!task) {
        res.status(404).send()
    }
    } catch (error) {
        res.status(400).send()
    }
    
})
router.patch('/update/:id',auth, async (req,res) => {
    const _id = req.params.id
    const allowedUpdates = _.pick(req.body,['title','todo','true'])
    
    try {
        const task =  await Task.findOneAndUpdate({_id, owner:req.user._id}, {$set:allowedUpdates})
        if (!task) {
            res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send()
    }

})
router.delete('/delete/:id', auth, async (req,res) => {
    const _id = req.params.id
    try {
        const task =await Task.findOneAndDelete({_id, owner:req.user._id})
        if(!task){
            res.status(400).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send()
    }

})
router.delete('/del/all',auth, async (req,res) => {
    try {
       const task = await Task.find({owner: req.user._id})
       console.log(task);
       
       if (!task) {
           res.status(400).send()
       }
       task.remove()
    } catch (error) {
        res.status(400).send()
    }
})


  module.exports = router;

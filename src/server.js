
const {ObjectID} =require('mongodb')
const _ = require('lodash')

const {User} =require('./models/user.js')

const express = require('express')
const {mongoose} = require('./db/mongoose.js')
const bodyParser = require('body-parser')
const user = require('./router/user')
const task = require('./router/task')

const app = express()
app.use(bodyParser.json())
app.use('/users',user)
app.use('/task',task)

app.listen(3000,() => {
  console.log('server has started');
})


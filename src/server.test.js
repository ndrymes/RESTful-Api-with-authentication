const expect = require('expect')
const request = require('supertest')
const {User} = require ('./models/model.js')
const {app} =require('./server.js')
const {ObjectID} =require('mongodb')
const user = [
  {
    _id:new ObjectID(),
    name:'oluwole',
    location:'Ado'
  },
   {_id:new ObjectID(),
    name:'Alao',
    location:'London'
  }
]
beforeEach( (done) => {
  User.remove({}).then(() => {
    User.insertMany(user)}).then(() => done())
  }
   )

describe('Get a Post request',() => {
  it('should return user Object',(done)=> {
   var   name = 'luwole'

    request(app)
    .post('/user')
    .send({name})
    .expect(200)
    .expect( (res) => {
      expect(res.body.name).toBe(name)

    }
    )

    .end((err,res) => {
      if (err) {
      return done(err)
      }
User.find({name}).then((users) => {
expect(users.length).toBe(1)
expect(users[0].name).toBe(name)
done()
}).catch((e) => done(e))
    })
  })
  it('should check for error not found', (done) => {
    request(app)
    .post('/user')
    .send({})
    .end((err,res)=> {
      if (err) {
        return done(err)
      }
      User.find().then((user) => {
       expect(user.length).toBe(2)
       done()
     }).catch((e) => done(e))
   })
   .expect(400)
  })
})

describe('GET /user', () => {
  it('should test the if user is returned', (done) => {
    request(app)
    .get('/user')
    .expect(200)
    .expect((res) => {
      expect(res.body.length).toBe(2)
    })
    .end(done)
  })
})

describe('GET /user Id', () => {
  it('should get a user by id', (done)=> {
    request(app)
    .get(`/user/${user[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=> {
      expect(res.body.user.name).toBe(user[0].name)
    })
    .end(done)
  })

   it('return a 404 if user not found',(done) => {
var hexId = new ObjectID().toHexString()
console.log(hexId);
    request(app)
    .get(`/user/${hexId}`)
    .expect(404)
    .end(done)
  })
  it('should return a 404 Bad request', (done) => {
    request(app)
    .get(`/user/123wq`)
    .expect(404)
    .end(done)
  })
})
describe('DELETE /user id',() => {
  it('should return status 200', function(done) {
    request(app)
    .get(`/user/${user[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=> {
      expect(res.body.user.name).toBe(user[0].name)
    })
    .end(done);

  });
  it('return 404 for invalid object id', function(done) {
    var hexId = new ObjectID().toHexString()
    request(app)
    .get(`/user/${hexId}`)
    .expect(404)
    .end(done)
  });
  it('should return a 404', function(done) {
    // body...
    request(app)
    .get('/user/1263ge')
    .expect(404)
    .end(done)
  });
})

describe('Patch/ user',() => {
  it('should check return status 200', (done) => {
    request(app)
    .patch(`/user/${user[0]._id.toHexString()}`)
    .send({
      name:'aja',
      location:'iwo'
    })
    .expect((res) => {
     expect(res.body.user.name).toBe('aja')
     
    })
    .end(done)

  })
  it('should not set CompletedAt if complete is false', (done) => {
    request(app)
    .patch(`/user/${user[0]._id.toHexString()}`)
    .send({location:false,
      name:'olat'
    }).expect((res) => {
      expect(res.body.user.completedAt).toBe(null)
    })
    .end(done)
  })
})

const getDb = require('./connection').getDb,
    ObjectId = require('mongodb').ObjectId;

// ## URI endpoints

// | Endpoint          | HTTP Method | CRUD Method |          Result |
// | ----------------- | :---------: | ----------: | --------------: |
// | /users/create   |    POST     |      CREATE | create a user |
// | /users/ping       |     GET     |        READ |            pong |
// | /users/user/:id   |     GET     |        READ |   get user info |
// | /users/update/:id |     PUT     |      UPDATE |     edit a user |
// | /users/delete/:id |   DELETE    |      DELETE |   delete a user |

module.exports = {
    createUser: async function(obj) {
        await getDb().collection('users').insertOne(obj)
    },

    readUser: async function(data) {
        let o_id = new ObjectId(data);
        await getDb().collection('users').find({ _id: o_id })
        // .toArray((err, docs) => {
        //     return docs
        // })
    },

    updateUser: async function(userId, updateObj) {
        let conditions = { id: `${userId}` },
            update = { $set: `${updateObj}` }
        await getDb().collection('users').updateOne(conditions, update);
    },

    deleteUser: async function(userId) {
        await getDb().collection('users').deleteOne({ _id: `${userId}` });
    }
};
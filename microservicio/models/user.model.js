const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    password: {
        type: String
    },
    username: {
        type: String
    }
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);
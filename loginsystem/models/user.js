var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

//user schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);
module.exports.getUserByid = (id, cb) => {
    User.findById(id, cb);
}
module.exports.getUserByusername = (username, cb) => {
    var query = {
        username: username
    };
    User.findOne(query, cb);
}

module.exports.comparePassword = (password, hash, cb) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        cb(null, isMatch);
    })
}

module.exports.createUser = (newuser, cb) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newuser.password, salt, function (err, hash) {
            newuser.password = hash;
            newuser.save(cb);
        });
    });
}
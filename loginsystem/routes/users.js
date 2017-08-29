var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({
  dest: './uploads'
});


var User = require('../models/user');

/* GET users listing. */
router.get('/', ensureAuthenticated, function (req, res, next) {
  res.send('respond with a resource');
});
function ensureAuthenticated(req ,res ,next) {
  if (req.isAuthenticated()) {
    return next;
  }
  res.redirect('/user/login');
}
router.get('/register', function (req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureLogin: 'Invalid pass or username'
}), function (req, res) {
  console.log(req);
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  req.flash('success', 'You are registered and you can login')
  res.redirect('/');
  });
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByusername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'Unknow user'
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);

      } else {
        return done(null, false, {message: 'Invalid password'})
      }
    })
  })
}));

router.post('/register', upload.single('profileimage'), function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  if (req.file) {
    console.log('Upload file ...');
    var profileImage = req.file.filename;
  } else {
    console.log('not upload file ...');
    var profileImage = 'noimage.png';
  }
  // form valitadion 
  req.checkBody('name', 'Name field is require').notEmpty();
  req.checkBody('email', 'Email field is require').notEmpty();
  req.checkBody('email', 'Email field not valid').isEmail();
  req.checkBody('username', 'Username field is require').notEmpty();
  req.checkBody('password', 'Password field is require').notEmpty();
  req.checkBody('password2', 'Password doestn match').equals(req.body.password);

  //check errors 
  var errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    res.render('register', {
      errors: errors
    });
    console.log('Errors');
  } else {
    var newUser = new User({
      name: name,
      password: password,
      email: email,
      username: username,
      profileimage: profileImage
    });
    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });
    req.flash('success', 'You are registered and you can login')
    res.location('/');
    res.redirect('/');
    console.log('No Errors ');
  }

});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logouted');
  res.redirect('/users/login');
})
module.exports = router;
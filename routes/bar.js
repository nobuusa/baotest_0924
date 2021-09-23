var express = require('express');
var router = express.Router();
var User = require('../models/user');
var cookie_parser = require('cookie-parser');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('bar', {'token':req.session.token});
});

router.post('/', function(req, res, next) {
  console.log('login') ;
	console.log(req.body.username) ;
	console.log(req.body.password) ;

  //const user = User.find(u => {
    //return u.username === req.body.username && req.body.password === u.password ;
  //});
  User.find({username:req.body.username, password:req.body.password},
    function(err, user){
      console.log(user) ;
      if(user.length===1){
        console.log("bar.js: fucking success");
        req.session.token = req.body.username ; //for testing only, should use a key here
        console.log(req.session) ;
        //req.session.username=req.body.username;
        res.redirect('/') ;
      }else if(user.length===0){
        console.log("bar.js: fucking failed") ;
        res.send('login failed')
      }else{
        console.log('bar.js: motherfucker') ;
      }
    }
  ) ;

  /*console.log(user) ; 

  if(user){
    console.log("fucking success");
  }else{
    console.log("fucking failed") ;
  }*/

	/*var newUser = new User({
            name: req.body.username,
            email: 'motherfucker@bao.com',
            username: req.body.username,
            password: req.body.password,
            profileimage: 'c8763'
        });

  User.createUser(newUser, function(err, user){
      //track for error
      if(err) throw err;
      console.log(user);
  });

  //res.location('/');
  //res.redirect('/');*/
});
module.exports = router;
var express = require('express');
var User = require('../models/user');
var router = express.Router();
var Notebook = require('../models/notebook');
const fs = require('fs');
var path = require('path');
var current_session ;
var _ = require('underscore');


//Read data. This will be replaced with database in the future
var filePath = path.join(__dirname, 'data_v3.json');
var data = fs.readFileSync(filePath, 'utf8');
var tags = [];
all_questions = JSON.parse(data);
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('note') ;
  console.log(req.session.token) ;
  my_notes = [] ;
  User.find({username:req.session.token}, 
    function(err, user){
      my_tags = user[0].tags
      Notebook.find({username:req.session.token},
        function(err, notebook){    
          notes = notebook.map(note => ({'question':all_questions[parseInt(note.question_id)], 'content':note.content, 'tags':note.tags}) ) ;
          my_notes = {} ;
          for(var i in my_tags){
            my_notes[my_tags[i]] = [] ;
          }
          console.log(notes) ;
          console.log(my_notes) ;
          for(var i in notes){
            note = notes[i] ;
            for(var tag in note['tags']){
              my_notes[note['tags'][tag]].push(note) ;
            }
          }
          console.log("....")
          console.log(my_notes) ;
          res.render('note', {'notes':my_notes, 'tags':my_tags, 'token':req.session.token});

        }
      );
    }
  );
  console.log(my_notes) ;
  //res.render('note', {'notes':my_notes, 'token':req.session.token});
});

router.post('/', function(req, res, next) {
  console.log('note') ;
	console.log(req.body.username) ;
	console.log(req.body.title) ;
  console.log(req.body.content) ;

	var newNotebook = new Notebook({
            title: req.body.title,
            username: req.session.token,
            content: req.body.content,
        });

  Notebook.createNotebook(newNotebook, function(err, notebook){
      //track for error
      if(err) throw err;
      console.log(notebook);
  });

  //res.location('/');
  //res.redirect('/');
});
module.exports = router;
//mongodb+srv://bao:<password>@cluster0.g1xzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

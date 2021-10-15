var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var TestSheet = require('../models/testsheet');
var Question = require('../models/question');

var _ = require('underscore');
var router = express.Router();
var tags = [] ;

router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //questions = all_questions ;
  //res.render('questions', { title: '國考救星豹豹站', questions: questions, q_count_options: q_count_options});
  //res.render('questions', { title: '國考救星豹豹站', q_count_options: q_count_options, query_active: false});

  //1. get testsheets from database
  TestSheet.find({username:req.session.token},
    function(err, testsheets){
    	console.log("sheet") ;
      console.log(testsheets) ;

      var QIDs = [] ;
      for(let t in testsheets){
      	QIDs = QIDs.concat(testsheets[t]['question_ids']) ;

      }
      console.log(487);
      console.log(QIDs, typeof(QIDs),typeof(QIDs[0])) ;

      /*
      Question.find({}, function(err, ts_questions){
      	console.log("333") ;
      	console.log(ts_questions) ;
      	res.render('sheet', {'questions':ts_questions.slice(0,21), 'testsheets': testsheets}) ;
      });*/

      /*Question.find({'YEAR': { $in: [110]}}).exec(function(err, ts_questions){
      	console.log(334);
      	console.log(ts_questions);

      }) ;*/
      

      Question.find({'QN': { $in: QIDs}}, function(err, ts_questions){
			  console.log(ts_questions);
			  res.render('sheet', {'questions':ts_questions, 'testsheets': testsheets, 'state': 'test'}) ;
			});
      //Model.find().where('_id').in(ids).exec((err, records) => {});
      //questions =  Question.find({QN: QIDs}) ;
      /*
      Question.find().where('QN').in(QIDs).exec((err, questions) => {
      	console.log(questions) ;
      	res.render('sheet', {'questions':questions}) ;
      });*/
      //console.log(questions) ; 
    }
  ) ;

  //2. render the page and pass testsheets
  
});

function parseExam(exam){
	ret = {} ;
	for(k in exam){
		if(!k.includes("question_"))
			continue ;
		q_id = parseInt(k.split("_")[1]) ;
		ret[q_id] = exam[k]
	}
	return ret ;
}
router.post('/', function(req, res, next) {
	token = req.session.token ;
	User.find({username:token}, 
    function(err, user){
    	//tags = user[0].tags ;
    	console.log("sheet") ;
			//for debugging
		  //console.log(req.query) ;
		  //console.log(req.body) ;
		  //console.log(req.session) ;

		  //console.log(req.body) ;

		  current_test = parseExam(req.body) ;
		  //console.log(current_test) ;
		  //console.log(current_test[3]) ;

		  Question.find({'QN': { $in: Object.keys(current_test)}}, function(err, ts_questions){
		  	console.log(ts_questions) ;
		  	results = [] ;
		  	score = 0
		  	answer_sheet = {} ;
		  	for(let k in ts_questions){
		  		answer_sheet[ts_questions[k]["QN"]] = ts_questions[k] ;
		  	}

		  	var i = 1 ;
		  	for(let k in current_test){
		  		gt = answer_sheet[k]['ANS'] ;
		  		pred = current_test[k] ;
		  		check = gt==pred ? 1 : 0 ;
		  		score += check ;
		  		console.log(i) ;
		  		//console.log(toString(i)) ;
		  		results.push([i.toString() + ". " + answer_sheet[k]["Q"]  
		  			,"(A) " + answer_sheet[k]["A"]  
		  			,"(B) " + answer_sheet[k]["B"] 
		  			,"(C) " + answer_sheet[k]["C"] 
		  			,"(D) " + answer_sheet[k]["D"] 
		  			,"正確答案： " + gt 
		  			,"考生作答： " + pred 
		  			]
		  			)
		  		i++;
		  	}
		  	score = 100*score/Object.keys(results).length ;
		  	console.log("得分：" + score) ;
		  	console.log(results) ;
		  	res.render('sheet', {'results': results, 'score': Math.round(score), 'state': 'answer'}) ;
		  })
		  //TestSheet

	});

});


module.exports = router;

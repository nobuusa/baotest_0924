//Setup
var express = require('express');
var router = express.Router();

//load model for the datebase interface
var User = require('../models/user');
var TestSheet = require('../models/testsheet');
var Question = require('../models/question');
var Notebook = require('../models/notebook');
var _ = require('underscore');
//const fs = require('fs');
//var path = require('path');

//Read data. This will be replaced with database in the future
//var filePath = path.join(__dirname, 'data_v3.json');
//var data = fs.readFileSync(filePath, 'utf8');
//all_questions = JSON.parse(data);
//var filePath = path.join(__dirname, 'cnt.json');
//var data = fs.readFileSync(filePath, 'utf8');
//cnts = JSON.parse(data);

//Setup options
q_count_options = [10,20,30,50,100,48763] ;
q_select_options = ['題庫順序', '年份最新', '年份最舊', '隨機'] ;
q_type_options = ['選擇題', '申論題', '所有題目'] ;

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //questions = all_questions ;
  //res.render('questions', { title: '國考救星豹豹站', questions: questions, q_count_options: q_count_options});
  res.render('questions', { title: '國考救星豹豹站', q_count_options: q_count_options, query_active: false});
});

function isBlankString(s){
	return (_.isUndefined(s) || _.isNull(s) || s.trim().length === 0)
}

function sortQuestions(questions, selected, options){
	//Sort: sort filtered questions based on q_select_options
	//1. do nothing if q_select==q_select_options[0]
	//2. sort by year (newest first) if q_select==q_select_options[1]
	if(selected == options[1]){
		questions = questions.sort(function(a, b) {
	  return b['YEAR'] - a['YEAR'];
	});
	}
	//3. sort by year (newest first) if q_select==q_select_options[2]
	else if(selected == options[2]){
		questions = questions.sort(function(a, b) {
	  return a['YEAR'] - b['YEAR'];
	});
	}
	//4. shuffle questions if q_select==q_select_options[3]
	else if(selected == options[3]){
		questions = _.shuffle(questions) ;
	}
	return questions ;

}

function keywordsRecommend(questions, keyword){
	//Keyword recommendation
	query_word_cnt = {} ;
	for(let r in questions){
		for(let w in questions[r]['Keywords']){
			word = questions[r]['Keywords'][w] ;
			query_word_cnt[word] = _.has(query_word_cnt, word) ? query_word_cnt[word]+1 : 1 ;
		}
	}
	for(let w in query_word_cnt){
		//console.log(req.body.keyword, w) ;
		query_word_cnt[w] = _.has(cnts, w) ? query_word_cnt[w]/cnts[w]: 0   ;
		if(keyword.includes(w)) query_word_cnt[w] = 0 ; 
	}
	query_word_cnt = Object.entries(query_word_cnt) ;//Object.keys(query_word_cnt).map((key) => [Number(key), query_word_cnt[key]]);
	query_word_cnt = query_word_cnt.sort(function(a, b) {
	  return b[1] - a[1];
	}).slice(0,10);
	return query_word_cnt ;
}

function chooseQuestionsByType(questions, q_type){
	if(q_type==q_type_options[0]){ //選擇
		questions = questions.filter(function(x){return !isBlankString(x.ANS);}) ;

	}else if(q_type==q_type_options[1]){ // 申論
		questions = questions.filter(function(fuck){return isBlankString(fuck.ANS);}) ;

	}else if(q_type==q_type_options[2]){
		//do nothing
	}else{
		//fucking error
	}
	return questions
}

function processQuestionAnswers(question){
	/*
	if(question.includes("(A)")){
		splitter_A = "(A)" ;
	}else{
		splitter_A = "（A）" ;
	}
	*/
	/*
	splitter_A = question['Q'].includes("(A)") ? "(A)"  : "（A）"  ;
	splitter_B = question['Q'].includes("(B)") ? "(B)"  : "（B）"  ;
	splitter_C = question['Q'].includes("(C)") ? "(C)"  : "（C）"  ;
	splitter_D = question['Q'].includes("(D)") ? "(D)"  : "（D）"  ;
	fucka = question['Q'].split(splitter_A) ;
	q = fucka[0] ;
	a = fucka[1] ;
	fuckb = a.split(splitter_B) ;
	a = fuckb[0] ;
	b = fuckb[1] ;
	fuckc = b.split(splitter_C) ;
	b = fuckc[0] ;
	c = fuckc[1] ;
	fuckd = c.split(splitter_D) ;
	c = fuckd[0] ;
	d = fuckd[1] ;*/

	question['QA'] = {'q': q, 'a': a, 'b': b, 'c': c, 'd': d}
	return  question;

}

router.post('/', function(req, res, next) {
	token = req.session.token ;
	User.find({username:token}, 
    function(err, user){
	var tags;
	tags = user[0].tags ;
    	console.log("questions") ;
			//for debugging
			console.log(token) ;
			console.log(user) ;
		  console.log(req.query) ;
		  console.log(req.body) ;
		  console.log(req.session) ;
		  console.log(tags) ;
		  console.log("/questions") ;
		  Question.find({}, function(err, questions){
		  	if(req.body.keyword)
			  	//Query: filter questions according to the keyword
			  	console.log(questions[0].Q, questions[0].ANS) ;
			  	questions = questions.filter(function(x) { return x.Q.includes(req.body.keyword) || x.ANS.includes(req.body.keyword)  ; });
			  	
			  	//Query principle
			  	if(req.body.principle_keyword){
			  		//console.log("mother fucking idiot") ;
			  		questions = questions.filter(function(x) { return x.GROUP.includes(req.body.principle_keyword)   ; });
			  	}

		  
			  	questions_count = questions.length ;
			  	if(questions_count > 0){
			  		//Query question type
			  		questions = chooseQuestionsByType(questions, req.body.q_type) ;

				  	//Sort: sort filtered questions based on q_select_options
				  	questions = sortQuestions(questions, req.body.q_select, q_select_options) ;

				  	//Slice: get first q_count questions by q_count
				  	questions = questions.slice(0, req.body.q_count) ;
				  	console.log("168")
				  	console.log(questions[0])

				  	//Process: Q -> {'q', 'a', 'b', 'c', 'd'}
				  	//questions = questions.map(function(x){return processQuestionAnswers(x);}) ;
				  	//answers_length = 
				  	//console.log(questions[0]) ;
				  	//Keyword recommendation
				  	//query_word_cnt = keywordsRecommend(questions, req.body.keyword) ;
				  	query_word_cnt = null ;
				  }else{
				  	query_word_cnt = null ;
				  }

				  if(req.body.search){
					  res.render('questions', { title: '國考救星豹豹站', 
					  	questions: questions, 
					  	q_count_options: q_count_options,
					  	questions_count: questions_count,
					  	query_word_cnt: query_word_cnt,
					  	keyword: req.body.keyword,
					  	q_count: req.body.q_count,
					  	q_select: req.body.q_select,
					  	q_type: req.body.q_type,
					  	query_active: true,
					  	'token':req.session.token,
					  	tags: tags
					  	//answers_length = answers_length
					  });
					}
					if(req.body.makesheet){
						console.log("question:makesheet") ;
						console.log(req.session.token) ;
						//console.log(req.query) ;
						//console.log(req.body) ;

						//insert a sheet into the database
						var newTestSheet = new TestSheet({
					            username: req.session.token,
					            title: req.body.testsheet_name,
					            exam: [],
					            question_ids: questions.map(function(x){return x.QN;}) 
					        });

					  TestSheet.createTestSheet(newTestSheet, function(err, testsheet){
					      //track for error
					      if(err) throw err;
					      console.log(err);
					  });


						//add sheet id to user
						//redirect to the sheet page
						res.redirect('/sheet') ;
					}


		  } );

		  /*
		  questions = all_questions ;
		  //if keyword are posted, do the following
		  if(req.body.keyword)
		  	//Query: filter questions according to the keyword
		  	questions = questions.filter(function(x) { return x.Q.includes(req.body.keyword) || x.Answer.includes(req.body.keyword)  ; });
		  	
		  	//Query principle
		  	if(req.body.principle_keyword){
		  		//console.log("mother fucking idiot") ;
		  		questions = questions.filter(function(x) { return x.Principle.includes(req.body.principle_keyword)   ; });
		  	}

		  	

		  	questions_count = questions.length ;
		  	if(questions_count > 0){
		  		//Query question type
		  		questions = chooseQuestionsByType(questions, req.body.q_type) ;

			  	//Sort: sort filtered questions based on q_select_options
			  	questions = sortQuestions(req.body.q_select, q_select_options) ;

			  	//Slice: get first q_count questions by q_count
			  	questions = questions.slice(0, req.body.q_count) ;

			  	//Process: Q -> {'q', 'a', 'b', 'c', 'd'}
			  	questions = questions.map(function(x){return processQuestionAnswers(x);}) ;
			  	//answers_length = 
			  	console.log(questions[0]) ;
			  	//Keyword recommendation
			  	query_word_cnt = keywordsRecommend(questions, req.body.keyword) ;
			  }else{
			  	query_word_cnt = null ;
			  }*/
			/*
		  //Update the webpage
		  if(req.body.search){
			  res.render('questions', { title: '國考救星豹豹站', 
			  	questions: questions, 
			  	q_count_options: q_count_options,
			  	questions_count: questions_count,
			  	query_word_cnt: query_word_cnt,
			  	keyword: req.body.keyword,
			  	q_count: req.body.q_count,
			  	q_select: req.body.q_select,
			  	q_type: req.body.q_type,
			  	query_active: true,
			  	'token':req.session.token,
			  	tags: tags
			  	//answers_length = answers_length
			  });
			}
			if(req.body.makesheet){
				console.log("question:makesheet") ;
				console.log(req.session.token) ;
				//console.log(req.query) ;
				//console.log(req.body) ;

				//insert a sheet into the database
				var newTestSheet = new TestSheet({
			            username: req.session.token,
			            title: req.body.testsheet_name,
			            exam: [],
			            question_ids: questions.map(function(x){return x.q_id;}) 
			        });

			  TestSheet.createTestSheet(newTestSheet, function(err, testsheet){
			      //track for error
			      if(err) throw err;
			      console.log(err);
			  });


				//add sheet id to user
				//redirect to the sheet page
				res.redirect('/sheet') ;
			}*/
		}
	)
});

router.post('/add_note', function(req, res, next) {
	console.log('questions/addnote') ;
	console.log(req.session.token) ;
	//console.log(req.body) ;
	console.log(req.body) ;
	n = JSON.parse(Object.keys(req.body)[0]) ;
	console.log(n) ;
	
	var newNotebook = new Notebook({
            username: req.session.token,
            question_id: n.q_id,
            content: n.content,
            tags: n.tags
        });

  Notebook.createNotebook(newNotebook, function(err, notebook){
      //track for error
      if(err) throw err;
      console.log(err);
  });

  res.render('questions', {});
});

router.post('/make_sheet', function(req, res, next) {
	console.log('questions/make_sheet') ;
	console.log(req.session.token) ;
	console.log(req.query) ;
	console.log(req.body) ;

	//insert a sheet into the database
	TestSheet

	//add sheet id to user
	//redirect to the sheet page
	
});

module.exports = router;



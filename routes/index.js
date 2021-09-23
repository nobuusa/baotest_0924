//Setup
var express = require('express');
var _ = require('underscore');
var router = express.Router();
const fs = require('fs');
var path = require('path');

//Read data. This will be replaced with database in the future
/*
var filePath = path.join(__dirname, 'data_v2.json');
var data = fs.readFileSync(filePath, 'utf8');
all_questions = JSON.parse(data);
var filePath = path.join(__dirname, 'cnt.json');
var data = fs.readFileSync(filePath, 'utf8');
cnts = JSON.parse(data);

//Setup options
q_count_options = [10,20,30,50,100,48763] ;
q_select_options = ['題庫順序', '年份最新', '年份最舊', '隨機'] ;
q_type_options = ['選擇題', '申論題', '所有題目'] ;
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  questions = all_questions ;
  current_session = req.session ;
  current_session.token ;
  current_session.username ; //might have safety concerns
  res.render('index', { title: '國考救星豹豹站'});
});



module.exports = router;

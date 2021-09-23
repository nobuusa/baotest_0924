//using mongoose to connect mongodb
var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://bao:baobaoc8763@cluster0.g1xzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//mongoose.connect('mongodb://localhost/nodeauth');


var db = mongoose.connection;

//Notebook Schema
//Need limits
var QuestionSchema = mongoose.Schema({
    QN:{
        type: Number
        //,index: true
    },
    Q: {
        type: String
    },
    YEAR: {
        type: Number
    },
    GROUP: {
        type: String
    },
    SUBJECT: {
        type: String
    },
    ANS: {
        type: String
    },
    ANS_F: {
        type: String
    },
    RESOURCE_00:{
        type: String
    },
    RESOURCE_01:{
        type: String
    },
    RESOURCE_02:{
        type: String
    },
    RESOURCE_03:{
        type: String
    },
    RESOURCE_04:{
        type: String
    },
    EXPLANATION_S:{
        type: String
    },
    EXPLANATION_D:{
        type: String
    },
    REFERENCE_00:{
        type: String
    },
    REFERENCE_01:{
        type: String
    },
    REFERENCE_02:{
        type: String
    },
    REFERENCE_03:{
        type: String
    },
    REFERENCE_04:{
        type: String
    },
    A:{
        type: String
    },
    B:{
        type: String
    },
    C:{
        type: String
    },
    D:{
        type: String
    },
    KEYWORDS_AUTO:{
        type: Array
    }
});

//export Question schema
var Question = module.exports = mongoose.model('Question', QuestionSchema);

//export createUser function
//module.exports.createQuestion = function(newQuestion, callback){
    //newQuestion.save(callback); //mongoose function to insert to DB
//};
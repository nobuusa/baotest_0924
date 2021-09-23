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
var NotebookSchema = mongoose.Schema({
    title: {
        type: String,
        default: ""
        //,index: true
    },
    username:{
        type: String
    },
    content: {
        type: String
    },
    question_id: {
        type: String
    },
    tags:{
        type:Array,
        default: []
    }
});

//export User schema
var Notebook = module.exports = mongoose.model('Notebook', NotebookSchema);

//export createUser function
module.exports.createNotebook = function(newNotebook, callback){
    newNotebook.save(callback); //mongoose function to insert to DB
};
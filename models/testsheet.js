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
var TestSheetSchema = mongoose.Schema({
    username:{
        type: String
    },
    title: {
        type: String,
        default: ""
        //,index: true
    },
    exam: {
        type: Array
    },
    question_ids:{
        type:Array
    }
});

//export User schema
var TestSheet = module.exports = mongoose.model('TestSheet', TestSheetSchema);

//export createUser function
module.exports.createTestSheet = function(newTestSheet, callback){
    newTestSheet.save(callback); //mongoose function to insert to DB
};
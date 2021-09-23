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

//User Schema
var UserSchema = mongoose.Schema({
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
    name: {
        type: String
    },
    profileimage: {
        type: String
    },tags:{
        type:Array,
        default: []
    },
	stats:{
        type: String
    },
	Testing_00: {
		type: String
	},
	School_name: {
		type: String
	},
	principle: {
		type: String
	},
    testsheets: {
        type:Array
    }	
});

//export User schema
var User = module.exports = mongoose.model('User', UserSchema);

//export createUser function
module.exports.createUser = function(newUser, callback){
    newUser.save(callback); //mongoose function to insert to DB
};
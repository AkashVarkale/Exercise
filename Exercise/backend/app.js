/**
* @fileOverview  Initiates the web-interface by defining and resolving dependencies
* @file app.js
*/

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var routes = require('./route/router');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
//Allow-cors
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    next();
});

app.use(cors());
//Support encoded bodies and parse requests to json
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use ('/',routes);

//Routing requests to respective handlers
app.get('/', (req,res) => {
	var resp = {status: "Success", responseCode: 200};
	//logger.createLog(0,(req.header('x-forwarded-for') || req.connection.remoteAddress)+' '+req.method+' '+req.url+' Request => '+req.params+' Response => '+JSON.stringify(resp));
	res.json(resp);
});

app.use((req, res, next) => {
	var resp = {status: "FAILED", responseCode: 404, message: "API Not Found"};
	//logger.createLog(0,(req.header('x-forwarded-for') || req.connection.remoteAddress)+' '+ req.method+' '+req.url+' 404'+' Request => '+JSON.stringify(req.params)+' Response => '+JSON.stringify(resp));
	res.status(404).json(resp);
});

app.listen(port, () => {
	//logger.createLog(0,'Server Listening at port '+port);
	console.log("Entered!! " + port);
});

module.exports = app;
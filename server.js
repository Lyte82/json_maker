'use strict'

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const router = express.Router();
const body_parser = require('body-parser');
const path_str = __dirname + '/public/';
const port = process.env.PORT || 9000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());

app.get('/', (req, res) =>{
	res.sendFile(path_str + 'json_maker.html');
});

app.post('/send_json', (req, res) =>{
	console.log('touch down', req.body);
	fs.writeFile(req.body.filename + '.json', JSON.stringify(req.body.filebody), err =>{
		console.log('Its done, son')
		res.json('Done')
	})
});




app.listen(port, (res, req) =>{
	console.log(`Server connected on port ${port}. go to localhost:${port}`)
});
var express = require('express'),
	app 	= express(),
	port 	= process.env.PORT || 3000;

app.get('/', function(req, res){
	res.send('quick nav');
});

app.listen(port, function(){
	console.log('app listening on port: ' + port);
});

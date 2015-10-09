var server,
    
    express = require('express'),
    app     = express();

app.use(express.static('demos'));
app.use(express.static('bower_components'));
app.use(express.static('dist/css'));
app.use(express.static('dist/js'));

app.use('/', express.static('demos/index.html'));
app.use('/bower_components', express.static('bower_components'));
app.use('/css', express.static('dist/css'));
app.use('/js', express.static('dist/js'));

function listenCb(){
  
    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
}

server = app.listen(3000, listenCb);

module.exports = server; 

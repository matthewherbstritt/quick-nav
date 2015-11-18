var server,
    
    express = require('express'),
    app     = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade');

app.locals.pretty   = true;

app.locals.dummyLinks = [
    
    {
        name: 'About'
    }, 
    
    {
        name: 'Contact', 
    },
    
    {
        name:'Gallery', 
    },
    
    {
        name: 'Portfolio'
    }
    
];

app.locals.siteLinks = [
    
    {
        name: 'Collapse', 
        url: '/collapse'
    },
 
    {
        name: 'Push', 
        url: '/push'
    },
 
    {
        name: 'Slide', 
        url: '/slide'
    }
    
];

app.use(express.static('bower_components'));
app.use(express.static('dist'));

app.get('/', function (req, res) {
    
    var data = { title : 'Home' };
    
    res.render('pages/index', data);
    
});


app.get('/collapse', function (req, res) {
    
    var data = { title : 'Collapse' };
    
    res.render('pages/collapse', data);
    
});

app.get('/push', function (req, res) {
    
    var data = { title : 'Off Canvas: Push' };
    
    res.render('pages/off-canvas-push', data);
    
});

app.get('/slide', function (req, res) {
    
    var data = { title : 'Off Canvas: Slide' };
    
    res.render('pages/off-canvas-slide', data);
    
});

server = app.listen(3000, function(){
    console.log('dev-server listening on port 3000...');
    console.log('dirname', __dirname);
    console.log('process.cwd()', process.cwd());
});

module.exports = server; 

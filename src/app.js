var hbs,

    express         = require('express'),
    exphbs          = require('express-handlebars'),
    app             = express(),
    layoutPath      = './src/views/layouts/',
    environment     = process.env.NODE_ENV || 'development',
    port            = process.env.PORT || 3000,
    inProduction    = (environment === 'production'),
    buildPreview    = process.env.BUILD_PREVIEW || false,
    
    hbsConfig = {
        
        extname        : '.hbs',
        layoutsDir     : inProduction ? './public/' : './src/views/layouts/',
        partialsDir    : './src/views/partials/',
        defaultLayout  : inProduction ? 'main-build.hbs': 'main.hbs'
        
    };
    
hbs = exphbs.create(hbsConfig);

app.use(function(req, res, next){
    res.locals.development = (environment === 'development');
    res.locals.production  = (environment === 'production');
    next();
});

if(buildPreview){
    /* need to disable view cache
    * in order to view changes when
    * previewing build on dev machine.
    * var is set in gulpfile
    **/
    app.disable('view cache');
}

app.engine('hbs', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

serveStaticAssets();

app.get('/', function(req, res){
    return res.render('home', {
        title: 'home'
    });
});

app.get('/demos/:name', function(req, res){
    
    var demoName = req.params.name ,
    
        demos = [
            'demo1',
            'demo2',
            'demo3'
        ];
    
    if(demoName && demos.indexOf(demoName) > -1){
        return res.render(demoName, {
            title: demoName
        });
    }
    
    return res.status(404).send('<h1>404: page not found :(</h1>');
});

app.listen(port, function(){
    console.log('quick nav demo app listening on port: ' + port);
    console.log('node env: ' + environment);
});


/* ==================================================
| Helper Functions
 ==================================================*/

function serveStaticAssets(){
    
    if(inProduction){
        console.log('serving production files')
        app.use(express.static('./public'));
        app.use(express.static('./bower_components/'));
        return;
    }
    
    console.log('serving dev files');
    
    // app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./.tmp'));
    
    // // app.use(express.static('./'));
    // app.use(express.static('./bower_components/'));
    // app.use(express.static('./.tmp'));
    // // app.use('bower_components/', express.static('./bower_components/'));
    // app.use('css/', express.static('./.tmp/css/'));
    // app.use('js/', express.static('./.tmp/js/'));

}


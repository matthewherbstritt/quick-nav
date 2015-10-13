var $ 			= require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
	del			= require('del'),
	gulp 		= require('gulp'),
	wiredep 	= require('wiredep'),
	
	port 		= process.env.PORT || 7200,
	
	layoutsDir  = './src/views/layouts/',
	devLayout 	= 'main.hbs',
	buildLayout = 'main-build.hbs',
	vendorDir 	= './public/vendor/',
	tempDir		= './.tmp/',
	tempCssDir 	= tempDir + 'css/',
	tempJsDir 	= tempDir + 'js/',
	stylesFile 	= 'styles.css',
	
	sassFiles 	= './src/sass/**/*.scss';
	
/* ==================================================
| Helpers
 ==================================================*/

function clean(files, done){
	del(files)
		.then(function(){ done(); })
		.catch(function(error){ done(error); })
}

function transformVendorFiles(filepath, file){
				
	var extname = filepath.split('.')[1],
		newPath = '/vendor/' + file.relative;
	
	if(extname === 'css'){
		return '<link rel="stylesheet" href="'+newPath+'">';
	}
	
	if(extname === 'js'){
		return '<script src="'+newPath+'"></script>';
	}
		
}

function startBrowserSync(isDev){
	
	if(browserSync.active) {
        return;
    }
	
    var devFiles = [
			'./src/**/*.*',
            '!' + sassFiles,
            tempDir + '**/*.css'
        ],
        
        options = {

        logLevel		: 'debug',
        logPrefix		: 'qn-demo',
		proxy 			: 'localhost:' + port,
        notify			: true,
		injectChanges 	: true,
        logFileChanges	: true,
        reloadDelay		: isDev ? 1000 : 2000,
		port 			: 3000,
		
        files           : isDev ? devFiles : []
		
    };
    
    if(isDev){
        gulp.watch([sassFiles], ['sass']);
    } else {
        gulp.watch(['./src/**/*.*'], ['browserSyncReload']);
    }
   
    browserSync(options);
}

function serve(isDev) {

    var nodeOptions = {
		
        script 		: './src/app.js',
        delayTime 	: 1,
		
        env: {
            'PORT'		: port,
            'NODE_ENV'	: isDev ? 'development' : 'production',
            
            /** needed to disable handlebars template 
             * caching when previewing build
             * on a dev machine
             */
            'BUILD_PREVIEW': isDev ? false : true
        },
		
        watch: ['./src/app.js']
		
    };

    return $.nodemon(nodeOptions)
        .on('restart', [], function(ev) {
			
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, 1000);
			
        })
        .on('start', function(){
            startBrowserSync(isDev);
        })
        .on('crash', function () {
            console.log('*** nodemon crashed ***');
        })
        .on('exit', function () {
            console.log('*** nodemon exited ***');
        });
		
}

/* ==================================================
| Tasks
 ==================================================*/
 
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

gulp.task('clean-quick-nav', function(done){
	clean([tempCssDir + 'quick-nav.css', tempJsDir + 'quick-nav.js'], done);
});

gulp.task('clean-styles', function(done){
	clean(tempCssDir + stylesFile, done);
});

gulp.task('copy-quick-nav', function(){
	return gulp.src('./dist/**/*').pipe(gulp.dest(tempDir));
});

gulp.task('co-master-dist', function(done){
	
	var execString = 'checkout master "dist"';

	$.git.exec({ args : execString }, function (err, stdout) {
		if(err){ throw err };
		done();
	});
	
});

gulp.task('delete-dist', function(done){
	clean('./dist', done);
});

gulp.task('delete-public', function(done){
    clean('./public', done);
});

gulp.task('sass', ['clean-styles'], function(){
    
    var inludePaths = require('node-bourbon').with(require('node-neat').includePaths),
        options     = { includePaths: inludePaths };
        
	return gulp
		.src('./src/sass/**/*.scss')
		.pipe($.sass(options))
		.pipe($.rename(stylesFile))
		.pipe(gulp.dest(tempCssDir));
});

gulp.task('get-quick-nav', function(done){
    $.sequence(['clean-quick-nav', 'delete-dist'], 'co-master-dist', 'copy-quick-nav', 'delete-dist')(done);
});

gulp.task('optimize', ['get-quick-nav', 'sass', 'delete-public'], function() {

    var assets 			= $.useref.assets({searchPath: './'}),
		hbsFilter   	= $.filter('*.hbs',  { restore: true }),
		
		cdnOptions 		= [
            {
                file: '/bower_components/normalize-css/normalize.css',
                cdn: '//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css'
            }
        ];
	
    return gulp
        .src(layoutsDir + devLayout)
		.pipe($.cdnizer(cdnOptions))
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))		
		.pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
		.pipe($.revReplace())
		.pipe(hbsFilter)
		.pipe($.rename(buildLayout))
		.pipe(hbsFilter.restore)
		.pipe(gulp.dest('./public'))
		
});

gulp.task('serve-dev', function(done){
	$.sequence('get-quick-nav', 'sass', 'wiredep', function(){
		serve(/* isDev */ true);
        done();
	});
});

gulp.task('serve-build', function(done){
	$.sequence('wiredep', 'optimize', function(){
		serve(/* isDev */ false);
        done();
	});
});

gulp.task('wiredep', function(){

    var wiredep = require('wiredep').stream,
		sources = gulp.src([tempCssDir + '**/*.css', tempJsDir + '**/*.js'], { read: false }),
		
		options = {
        
            bowerJson   : require('./bower.json'),
            directory   : './bower_components/',
            ignorePath  : '../../..'
            
        };

    return gulp
        .src(layoutsDir + devLayout)
        .pipe(wiredep(options))
        .pipe($.inject(sources))
        .pipe(gulp.dest(layoutsDir));
});

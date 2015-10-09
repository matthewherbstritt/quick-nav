var $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del         = require('del'),
    gulp        = require('gulp'),
    
    port        = process.env.PORT || 3000,
    
    sassFiles   = './src/sass/**/*.scss',
    jsFiles     = './src/js/**/*.js',
    demosDir    = './demos/',
    distDir     = './dist/';

/* ==================================================
| Helper Functions
 ==================================================*/
 
function clean(paths, done) {
    del(paths)
      .then(function(){
          console.log(paths + ' deleted ok...');
          done();
      })
      .catch(function(error){
          console.log('del error', error);
          done();
      });
}

function startBrowserSync(){
    
    if(browserSync.active){ return; }

    console.log('Starting BrowserSync on port ' + port);

    var options = {
        
        proxy           : 'localhost:' + port,
        port            : 4000,
        injectChanges   : true,
        logFileChanges  : true,
        logLevel        : 'debug',
        logPrefix       : 'quick-nav',
        notify          : true,
        reloadDelay     : 750,
        
        files: [
            demosDir + '**/*.*',
            distDir + '**/*.*'
        ]
        
    };
          
    gulp
        .watch([sassFiles], ['sass'])
        .on('change', function(){
            console.log('sass files changed');
        });
        
    gulp
        .watch([jsFiles], ['js'])
        .on('change', function(){
            console.log('js files changed');
        });
    
    browserSync(options);
 
}

/* ==================================================
| Tasks
 ==================================================*/

gulp.task('int-tests', function() {
    
  return gulp
    .src('')
    .pipe($.nightwatch({   
        configFile: 'tests/nightwatch.json',
    }));
    
});

gulp.task('clean-js', function(done){
	clean(['dist/js/*.js'], done);
});

gulp.task('js', ['clean-js'], function(){
    gulp.src('src/js/quick-nav.js')
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('clean-css', function(done){
    clean(['dist/css/*.css'], done);
});

gulp.task('sass', ['clean-css'], function () {

    var includePaths = require('node-neat').with(require('node-bourbon'));
        
    gulp.src('src/sass/main.scss')
        .pipe($.plumber())
        .pipe($.sass({ includePaths: includePaths }))
        .pipe($.rename('quick-nav.css'))
        .pipe(gulp.dest('dist/css/'));
    
});

gulp.task('serve-dev', ['sass', 'js'], function(){
    
    var options = {
        
            script: './server.js',
            delayTime: 1,
            
            env: {
                'PORT': 5000,
                'NODE_ENV': 'development' 
            },
            
            watch: ['./server.js']
            
        };
        
    function reloadBrowserSync(){
        setTimeout(function(){
            browserSync.reload({stream: false}) ;
        }, 500)
    }
    
    return $.nodemon(options)
        .on('restart', reloadBrowserSync)
        .on('start', startBrowserSync)
        .on('crash', function(){ console.log('*** nodemon CRASH ***'); })
        .on('exit', function(){ console.log('*** nodemon EXIT ***'); });

});

gulp.task('default', ['serve-dev']);

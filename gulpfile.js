var $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del         = require('del'),
    gulp        = require('gulp');

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

gulp.task('serve', ['sass', 'js'], function(){

    browserSync.init({

        server: {
            
            baseDir: 'demos',
			index: 'index.html',
            
            routes: {
                '/demos': 'demos',
                '/css': 'dist/css',
                '/js': 'dist/js',
                '/bower_components': 'bower_components'
            }
            
        },
        
        files: ['demos/*.html', 'dist/**/*.*'],

        reloadDelay: 500

    });

    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch(['src/js/*.js'], ['js']);
    gulp.watch(['demos/*.html']).on('change', browserSync.reload);

});

gulp.task('default', ['serve']);
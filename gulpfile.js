'use strict';

var // Gulpjs and plugin declarations
gulp = require( 'gulp' ),
sass = require( 'gulp-sass' ),
cssmin = require( 'gulp-minify-css' ),
concat = require( 'gulp-concat' ),
jade = require( 'gulp-jade' ),
jshint = require( 'gulp-jshint' ),
stylish = require('jshint-stylish'),
header = require( 'gulp-header' ),
order = require( 'gulp-order' ),
locals = require( './locals.json' );


/************************************************************
 *                       Gulp Compile                       *
 ************************************************************/

gulp.task( 'compile_jade', function () {

  // Compile Jade to Html
  gulp.src( 'dev/views/*.jade' )
    .pipe( jade({
      pretty: true,
      locals: locals
      }))
    .pipe( gulp.dest( 'app/' ));

});

gulp.task( 'compile_sass', function () {

  // Compile, Minify, Bundle Sass to Css
  gulp.src( 'dev/styles/core-light.scss' )
    .pipe( sass() )
    .pipe( cssmin() )
    .pipe( concat('mockbox-light.css') )
    .pipe( gulp.dest( 'app/styles/' ));

  // Compile, Minify, Bundle Sass to Css
  gulp.src( 'dev/styles/core-dark.scss' )
    .pipe( sass() )
    .pipe( cssmin() )
    .pipe( concat('mockbox-dark.css') )
    .pipe( gulp.dest( 'app/styles/' ));

  // Compile, Minify, Bundle Sass to Css
  gulp.src( 'dev/styles/iframe.scss' )
    .pipe( sass() )
    .pipe( cssmin() )
    .pipe( concat('iframe.css') )
    .pipe( gulp.dest( 'app/styles/' ));

  // Compile, Minify, Bundle Sass to Css
  gulp.src( 'dev/scripts/**/*.css' )
    .pipe( cssmin() )
    .pipe( concat('lib.css') )
    .pipe( gulp.dest( 'app/styles/' ));

});

gulp.task( 'compile_js', function () {

  // Minify, Bundle JavaScript
  gulp.src( 'dev/scripts/app/*.js' )
    .pipe(order([
      "mockbox.js",
      "*.js",
      "mockbox_end.js"
    ]))
    .pipe( concat('mockbox.js') )
    .pipe( gulp.dest( 'app/scripts/' ));


  // Minify, Bundle JavaScript
  gulp.src( 'dev/scripts/popout/*.js' )
    .pipe(order([
      "popout.js",
      "*.js",
      "popout_end.js"
    ]))
    .pipe( concat('popout.js') )
    .pipe( gulp.dest( 'app/scripts/' ));


  // Minify, Bundle JavaScript
  gulp.src( 'dev/scripts/views/*.js' )
    .pipe(order([
      "view.js",
      "*.js",
      "view_end.js"
    ]))
    .pipe( concat('views.js') )
    .pipe( gulp.dest( 'app/scripts/' ));

  // Minify, Bundle JavaScript
  gulp.src( 'dev/scripts/lib/**/*.js' )
    .pipe( concat('lib.js') )
    .pipe( gulp.dest( 'app/scripts/' ));

});


gulp.task('lint', function(){
  gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

/******************************************************************
 *                       Gulp Main Methods                        *
 ******************************************************************/
gulp.task( 'build', [ 'compile_jade', 'compile_sass', 'compile_js' ]);

gulp.task( 'release', [ 'release_jade', 'release_sass', 'release_js' ]);

// Default gulp task
gulp.task( 'default', [ 'build' ]);
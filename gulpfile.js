'use strict';

var // Gulpjs and plugin declarations
gulp = require( 'gulp' ),
sass = require( 'gulp-sass' ),
cssmin = require( 'gulp-minify-css' ),
concat = require( 'gulp-concat' ),
uglify = require( 'gulp-uglify' ),
jade = require( 'gulp-jade' ),
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
  gulp.src( 'dev/styles/core.scss' )
    .pipe( sass() )
    .pipe( cssmin() )
    .pipe( concat('app.css') )
    .pipe( gulp.dest( 'app/styles/' ));

  // Compile, Minify, Bundle Sass to Css
  gulp.src( 'dev/styles/iframe.scss' )
    .pipe( sass() )
    .pipe( cssmin() )
    .pipe( concat('iframe.css') )
    .pipe( gulp.dest( 'app/styles/' ));

});

gulp.task( 'compile_js', function () {

  // Minify, Bundle, Obsfucate JavaScript
  gulp.src( 'dev/scripts/app/*.js' )
    .pipe(order([
      "mockbox.js",
      "*.js",
      "mockbox_end.js"
    ]))
    //.pipe( uglify() )
    .pipe( concat('app.js') )
    .pipe( gulp.dest( 'app/scripts/' ));


  // Minify, Bundle, Obsfucate JavaScript
  gulp.src( 'dev/scripts/popout/*.js' )
    .pipe(order([
      "popout.js",
      "*.js",
      "popout_end.js"
    ]))
    //.pipe( uglify() )
    .pipe( concat('popout.js') )
    .pipe( gulp.dest( 'app/scripts/' ));

});


/******************************************************************
 *                       Gulp Main Methods                        *
 ******************************************************************/
gulp.task( 'build', [ 'compile_jade', 'compile_sass', 'compile_js' ]);

gulp.task( 'release', [ 'release_jade', 'release_sass', 'release_js' ]);

// Default gulp task
gulp.task( 'default', [ 'watch' ]);
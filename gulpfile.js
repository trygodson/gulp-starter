var {task,dest, src, series, watch, parallel} = require('gulp');
var rename = require('gulp-rename');
var autoprefix = require('gulp-autoprefixer');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass')(require('sass'));

const style = (done) => {
  src('src/scss/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(autoprefix({cascade: true,}))
  .pipe(rename({extname: '.min.css'}))
  .pipe(sourcemaps.write('/'))
  .pipe(dest('./dist/css'));
  done();
}

const js = (done) => {
  ['src/js/script.js'].map(e => {
    return browserify({
      entries: [e],
    })
    .transform(babelify,{presets: ["@babel/preset-env"]} )
    .bundle()
    .pipe(source(e))
    .pipe(rename({extname: '.min.js'}))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('/'))
    .pipe(dest('./dist/js'))
  
  })
  //browserify
  //transform babelify
  //bundle
  //source
  //rename .min
  //buffer
  //init sourcemap
  //uglify
  //write sourcemap
  //dist

  // src('src/js/script.js').pipe(dest('./dist/js'));
  done();
} 

function browsersync(){
  browserSync.init({
     server: {
       baseDir: './dist/'
     },
  })
}

function reload(done){
  browserSync.reload();
  done();
}

function watchfiles() {
  
  watch('src/js/**/*.js', series(js, reload));
  watch('src/scss/**/*.scss', series(style, reload));
  watch ('**/*.html', reload);
}
task('watch', parallel(browsersync, watchfiles))


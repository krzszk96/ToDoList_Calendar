var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

gulp.task('reload',function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function(){
  browserSync({
    server: 'src'
  });

  gulp.watch('src/*.html',['reload']);
  gulp.watch('src/scss/**/*.scss',['sass']);
  gulp.watch('src/js/*.js',['reload']);
});

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('css', function(){
  return gulp.src('src/css/**/*.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function(){
  return gulp.src('src/js/**/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('img', function(){
  return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
  .pipe(changed('dist/img'))
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'));
});

gulp.task('html',function(){
  return gulp.src('src/*.html')
  .pipe(htmlReplace({
    'css': 'css/style.css',
    'js': 'js/script.js'
  }))
  .pipe(htmlMin({
    sortAttributes: true,
    sortClassName: true,
    //collapseWhitespace: true
  }))
  .pipe(gulp.dest('dist/'))
});

gulp.task('clean', function(){
  return del(['dist']);
});

gulp.task('build', function(){
  sequence('clean', ['html', 'js', 'css', 'img']);
});

gulp.task('default', ['serve']);

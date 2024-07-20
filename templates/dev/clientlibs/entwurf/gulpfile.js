const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('compile-ts', function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('wwwroot/js'));
});

gulp.task('bundle-js', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['wwwroot/js/main.js'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('wwwroot/js'));
});

gulp.task('minify-js', function () {
  return gulp.src('wwwroot/js/bundle.js')
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('wwwroot/js'));
});

gulp.task('build', gulp.series('compile-ts', 'bundle-js', 'minify-js'));

gulp.task('watch', function () {
  gulp.watch('Scripts/**/*.ts', gulp.series('build'));
});

gulp.task('default', gulp.series('build'));
var concat = require('gulp-concat');
var del = require('del');
var fs = require('fs');
var gif = require('gulp-if');
var gulp = require('gulp');
var jison = require('gulp-jison');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  allScripts: ['src/*.js'],
	tests: ['test/grammar-tests.js'],
	buildDir: './build',
	copyrightNotice: 'src/copyright.js',
	uglifyScripts: [
		'src/diagram.js',
		'src/grammar.jison',
		'src/jquery-plugin.js',
		'fonts/daniel/daniel_700.font.js',
		'src/sequence-diagram.js'
	]
};

gulp.task('clean', function(callback) {
  del(['build'], callback);
});

gulp.task('lint', function() {
	return gulp.src(paths.allScripts.join(paths.tests))
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
	return gulp.src(paths.uglifyScripts)
		.pipe(gif('*.jison', jison({ moduleType: 'commonjs' })))
		.pipe(sourcemaps.init())
			.pipe(concat('sequence-diagram-min.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(header(fs.readFileSync(paths.copyrightNotice, 'utf8')))
		.pipe(gulp.dest(paths.buildDir));
});

gulp.task('deploy', ['build'], function() {
	return gulp.src(paths.buildDir + '/sequence-diagram-min.js*')
		.pipe(gulp.dest('_site'));
});

gulp.task('watch', function() {
  gulp.watch(paths.uglifyScripts, ['lint', 'build', 'deploy']);
});

gulp.task('default', ['lint', 'build', 'deploy']);
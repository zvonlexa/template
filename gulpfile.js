// Инициализируем плагины
var gulp = require('gulp'),
	jade = require('gulp-jade'),
	stylus = require('gulp-stylus'),
	plumber = require('gulp-plumber'),
	concatCss = require('gulp-concat-css'),
	minifyCss = require('gulp-minify-css'),
//	autoprefixer = require('gulp-autoprefixer'),
//	imagemin = require('gulp-imagemin'),
//	webserver = require('gulp-webserver'),
//	cssbeautify = require('gulp-cssbeautify'),
//	gutil = require('gulp-util'),
//	cache = require('gulp-cache'),
	include = require('gulp-include'),
	rename = require("gulp-rename"),
	uglify = require('gulp-uglify'),
//	jadeOrig = require('jade'),
	nib = require('nib');

// Функция обработки ошибок
handleError = function(err) {
	gutil.log(err);
	gutil.beep();
};

// Пути к файлам
path = {
	html: {
		source: ['./source/**/*.jade', '!./source/partials/*.jade', '!./source/blocks/**/*.jade'],
		watch: 'source/**/*.jade',
		destination: './public/',
		basedir: './source'
	},
	css: {
		source: ['./source/css/*.styl', '!./source/css/lib/**/*.styl', '!./source/**/_*.styl'],
		watch: 'source/**/*.styl',
		build: './source/css/build/',
		destination: './public/css/'

	},
	assets: {
		source: './modules/plugins/jquery/dist/jquery*',
		watch: 'modules/plugins/jquery/dist/jquery*',
		destination: './public/js'
	},
	img: {
		source: './source/img/**/*.{jpg,jpeg,png,gif}',
		watch: 'source/img/**/*',
		destination: './public/img'
	},
	js: {
		source: './source/js/*.js',
		watch: './source/js/*',
		destination: './public/js'
	}
};


// Локальный сервер
/*
gulp.task('webserver', function() {
	gulp.src('public')
	.pipe(webserver({
		host: 'localhost', // Если нужен сервер в сети ставьте 0.0.0.0
		port: 3000,
		livereload: true,
		open: "/index.html"
	}));
});
*/

// Собираем Stylus
gulp.task('stylus', function() {
	gulp.src(path.css.source)
		.pipe(plumber())
		.pipe(stylus({use:[nib()]}))
		.pipe(concatCss('main.css'))
//		.pipe(minifyCss({keepBreaks:true}))
		.pipe(gulp.dest(path.css.destination));
});


// Собираем html из Jade
gulp.task('jade', function() {
	gulp.src(path.html.source)
		.pipe(plumber())
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest(path.html.destination));
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
	gulp.src(path.img.source)
		.pipe(plumber())
		.pipe(gulp.dest(path.img.destination));
});

// Копируем файлы
gulp.task('copy', function() {
	gulp.src(path.assets.source)
		.pipe(plumber())
		.pipe(gulp.dest(path.assets.destination));
});

// Собираем JS
gulp.task('js', function() {
	gulp.src(path.js.source)
		.pipe(plumber())
		.pipe(include())
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(path.js.destination))
});

// Запуск сервера разработки gulp watch
gulp.task("watch", function() {
	gulp.watch(path.css.watch, ['stylus']);
	gulp.watch(path.html.watch, ['jade']);
	gulp.watch(path.js.watch, ['js']);
//	gulp.watch(path.js.plugins.watch, ['plugins']);
//	gulp.watch(path.assets.watch, ['copy']);
});

//gulp.task("build", ['stylus', 'jade', 'images', 'plugins', 'copy']);

//gulp.task("build", ['stylus', 'jade', 'copy', 'js']);

gulp.task("build", ['stylus', 'jade', 'js']);

gulp.task('default', ['watch']);

//gulp.task("default", ["build", "watch", "webserver"]);

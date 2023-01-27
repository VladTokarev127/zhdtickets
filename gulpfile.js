// var gulp           = require('gulp'),
// 		autoprefixer   = require('gulp-autoprefixer'),
// 		rigger         = require('gulp-rigger'),
// 		rename         = require('gulp-rename'),
// 		concat         = require('gulp-concat'),
// 		minify				 = require('gulp-minify-css'),
// 		uglify         = require('gulp-uglify'),
// 		del            = require('del'),
// 		browserSync    = require('browser-sync'),
// 		sass           = require('gulp-sass'),
// 		sourcemaps     = require('gulp-sourcemaps'),
// 		imagemin       = require('gulp-imagemin'),
// 		cache          = require('gulp-cache'),
// 		notify         = require('gulp-notify'),
// 		reload         = browserSync.reload;

// var path = {
// 		dist: {
// 				html: 'dist/',
// 				js: 'dist/js/',
// 				css: 'dist/style/',
// 				img: 'dist/img/',
// 				fonts: 'dist/fonts/'
// 		},
// 		src: {
// 				html: 'src/*.html',
// 				js: 'src/js/main.js',
// 				style: 'src/style/main.sass',
// 				img: 'src/img/**/*.*', 
// 				fonts: 'src/fonts/**/*.*'
// 		},
// 		watch: {
// 				html: 'src/**/*.html',
// 				js: 'src/js/**/*.js',
// 				style: 'src/style/**/*.sass',
// 				img: 'src/img/**/*.*',
// 				fonts: 'src/fonts/**/*.*'
// 		},
// 		clean: './dist'
// };

// gulp.task('html:build', function () {
// 		gulp.src(path.src.html)
// 				.pipe(rigger())
// 				.pipe(gulp.dest(path.dist.html)) 
// 				.pipe(reload({stream: true})); 
// });

// gulp.task('js:build', function () {
// 		gulp.src([
// 				'src/libs/jquery/dist/jquery.min.js',
// 				'src/libs/inputmask/jquery.inputmask.bundle.js',
// 				'src/libs/owlcarousel/owl.carousel.min.js',
// 				'src/libs/magnific/jquery.magnific-popup.min.js',
// 				path.src.js
// 				])
// 				.pipe(rigger())
// 				.pipe(concat('main.js'))
// 				.pipe(uglify())
// 				.pipe(rename({suffix: '.min', prefix : ''}))
// 				.pipe(sourcemaps.write())
// 				.pipe(gulp.dest(path.dist.js))
// 				.pipe(reload({stream: true}));
// });

// gulp.task('scss:build', function () {
// 		gulp.src(path.src.style)
// 				.pipe(sourcemaps.init())
// 				.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
// 				.pipe(autoprefixer())
// 				.pipe(minify())
// 				.pipe(rename({suffix: '.min', prefix : ''}))
// 				.pipe(sourcemaps.write())
// 				.pipe(gulp.dest(path.dist.css))
// 				.pipe(reload({stream: true}));
// });

// gulp.task('browser-sync', function() {
// 	browserSync({
// 		server: {
// 			baseDir: 'dist'
// 		},
// 		notify: false,
// 		// tunnel: true,
// 		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
// 	});
// });

// gulp.task('fonts:build', function() {
// 		gulp.src(path.src.fonts)
// 				.pipe(gulp.dest(path.dist.fonts))
// });

// gulp.task('imagemin', function() {
// 	return gulp.src(path.src.img)
// 	.pipe(cache(imagemin()))
// 	.pipe(gulp.dest(path.dist.img)); 
// });

// gulp.task('removedist', function() { return del.sync('dist'); });

// gulp.task('build', [
// 		'removedist',
// 		'html:build',
// 		'js:build',
// 		'scss:build',
// 		'fonts:build',
// 		'imagemin'
// ]);

// gulp.task('watch', function(){
// 		gulp.watch([path.watch.html], function(event, cb) {
// 				gulp.start('html:build');
// 		});
// 		gulp.watch([path.watch.style], function(event, cb) {
// 				gulp.start('scss:build');
// 		});
// 		gulp.watch([path.watch.js], function(event, cb) {
// 				gulp.start('js:build');
// 		});
// 		gulp.watch([path.watch.img], function(event, cb) {
// 				gulp.start('imagemin');
// 		});
// 		gulp.watch([path.watch.fonts], function(event, cb) {
// 				gulp.start('fonts:build');
// 		});
// });

// gulp.task('default', ['build', 'browser-sync', 'watch']);

let preprocessor = 'sass', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
		fileswatch   = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

import pkg from 'gulp'
const { gulp, src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import bssi          from 'browsersync-ssi'
import ssi           from 'ssi'
import webpackStream from 'webpack-stream'
import webpack       from 'webpack'
import TerserPlugin  from 'terser-webpack-plugin'
import gulpSass      from 'gulp-sass'
import dartSass      from 'sass'
import sassglob      from 'gulp-sass-glob'
const  sass          = gulpSass(dartSass)
import less          from 'gulp-less'
import lessglob      from 'gulp-less-glob'
import styl          from 'gulp-stylus'
import stylglob      from 'gulp-noop'
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import imagemin      from 'gulp-imagemin'
import changed       from 'gulp-changed'
import concat        from 'gulp-concat'
import rsync         from 'gulp-rsync'
import del           from 'del'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'dist/',
			middleware: bssi({ baseDir: 'dist/', ext: '.html' })
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}

function scripts() {
	return src(['src/js/*.js', '!src/js/*.min.js', 'src/libs/**/*.js'])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			plugins: [
				new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }), // jQuery (npm i jquery)
			],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: ['babel-plugin-root-import']
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat('main.min.js'))
		.pipe(dest('dist/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src([`src/style/*.*`, `!src/style/_*.*`])
		.pipe(eval(`${preprocessor}glob`)())
		.pipe(eval(preprocessor)({ 'include css': true }))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('main.min.css'))
		.pipe(dest('dist/css'))
		.pipe(browserSync.stream())
}
function fonts() {
	return src(['src/fonts/**/*'])
		.pipe(dest('dist/fonts/'))
		.pipe(browserSync.stream())
}

function images() {
	return src(['src/img/**/*'])
		.pipe(changed('src/img/dist'))
		.pipe(imagemin())
		.pipe(dest('dist/img/'))
		.pipe(browserSync.stream())
}

function buildcopy() {
	return src([
		'{src/js,src/style}/*.min.*',
		'src/img/**/*.*',
		'!src/img/**/*',
		'src/fonts/**/*'
	], { base: 'src/' })
	.pipe(dest('dist'))
}

async function buildhtml() {
	let includes = new ssi('src/', 'dist/', '/**/*.html')
	includes.compile()
	del('dist/parts', { force: true })
}

async function cleandist() {
	del('dist/**/*', { force: true })
}

function deploy() {
	return src('dist/')
		.pipe(rsync({
			root: 'dist/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// clean: true, // Mirror copy with file deletion
			include: [/* '*.htaccess' */], // Included files to deploy,
			exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch(`src/style/**/*`, { usePolling: true }, styles)
	watch(['src/js/**/*.js', '!src/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('src/img/**/*', { usePolling: true }, images)
	watch('src/fonts/**/*', { usePolling: true }, fonts)
	watch('src/*.html', { usePolling: true }, buildhtml)
	watch(`src/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

export { scripts, styles, images, fonts, deploy }
export let assets = series(scripts, styles, images, fonts)
export let build = series(cleandist, images, fonts, scripts, styles, buildcopy, buildhtml)
export default series(scripts, styles, images, fonts, buildhtml, parallel(browsersync, startwatch))
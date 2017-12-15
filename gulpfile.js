const browserToOpen = "chrome"

var gulp = require('gulp'),
watch = require('gulp-watch');
  concat = require('gulp-continuous-concat');
exec = require('child_process').exec,
  nodemon = require('gulp-nodemon');
browserSync = require('browser-sync');
reload = browserSync.reload;
sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  open = require('gulp-open');
imagemin = require('gulp-imagemin');

function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  };
};

gulp.task('imagecompressor', function () {
  gulp.src('app/public/Assets/Images_Uncompressed/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('app/public/Assets/Images'))
});


gulp.task('mongo', runCommand('mongod'));

gulp.task('stop-mongo', function () {
  exec('mongod --shutdown', function (err, stdout, stderr) {
    console.log(stdout);
  });
});

gulp.task('sass', function () {
  return sass('app/public/SCSS/**/*.scss', {
    sourcemap: true,
    style: 'compressed'
  })
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['last 7 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/public/CSS'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  let src = 'app/routesPartials/';
  return gulp.src([src + 'routeHeaders.js', src + 'mailRoutes.js', src + 'forumRoutes.js', src + 'chatRoutes.js', src + 'authRoutes.js', src + 'signupRoutes.js', src + 'profileFtRoutes', src + 'calendarRoutes.js', src + 'contentManagerRoutes.js', src + 'adminRoutes.js', src + 'mentorshipRoutes.js',, src + 'analyticsRoutes.js', src + 'searchRoutes.js', src + 'utilityRoutes.js', src + 'functionRoutes.js'])
  .pipe(watch(src+'*.js'))
    .pipe(concat('routes.js'))
    //.pipe(uglify()) UGLIFY LATER TODO
    .pipe(gulp.dest('app/'))
})

gulp.task('webserver', function (cb) {
  var started = false;
  nodemon({
    script: 'server.js'
    , ext: 'js html'
    , exec: 'node --debug'
    , env: { 'NODE_ENV': 'development' }
  }).on('start', function () {
    //to prevent multiple instances
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('browser-sync', ['webserver'], function () {
  //timeout on the sync in case mongo does not run 
  //setTimeout(function () {
  browserSync.init(["app/public/SCSS/**/*.scss", "app/public/views/**/*.html"], {
    proxy: "localhost:8080",
    reloadDelay: 1000,
    //files: ["app/public/views/**/*.html"], //does not really work as intended :)
    browser: browserToOpen,
    port: 8081,
    reloadOnRestart: true
  });
  gulp.watch("app/public/SCSS/**/*.scss", ['sass']);
});

gulp.task('default', ['scripts', 
// 'imagecompressor', //USE ONE FOR COMPRESSING IMG's 
'stop-mongo', 'mongo', 'browser-sync', 'sass'], function (callback) {
});

process.on('SIGINT', function () {
  process.stdout.write('\nCaught interrupt signal. exiting...\n');
  process.exit(0);
});


//mongo admin --eval "db.shutdownServer()"

//NOTE: Fall back if the browser sync stuff is *whack*
// //Open the correct url for the app
// gulp.task('open-dev', function () {
//   //use setTimeout to decrease chance of opening app
//   //before mongod and server are up and running
//   setTimeout(function () {
//     gulp.src(__filename)
//       .pipe(open({ uri: 'http://localhost:8080' }));
//   }, 1500);
// });

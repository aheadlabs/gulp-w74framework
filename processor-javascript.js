const
concat = require('gulp-concat'),
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
stripdebug = require('gulp-strip-debug'),
uglify = require('gulp-uglify')
;

logger.info('Warming up JavaScript processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

exports.default = (done) => {
    this.delete(`${_paths.output_paths.js}**/*.js`);
    this.copy([
        `${_paths.source_paths.node_modules}bootstrap/dist/js/bootstrap.bundle.min.js`,
        `${_paths.source_paths.node_modules}jquery/dist/jquery.slim.min.js`
    ], _paths.output_paths.js);

    done();
};

exports.delete = (path) => {
    logger.info(`Deleting JavaScript files from ${path}`);
    return del(path, {force: true});
}

exports.copy = (source, destination) => {
    logger.info(`Moving JavaScript files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(concat('scripts.min.js'))
        .pipe(stripdebug())
        .pipe(uglify())
        .pipe(gulp.dest(destination));
}

exports.bareCopy = (source, destination) => {
    logger.info(`Copying JavaScript files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(gulp.dest(destination));
}

exports.distWordpress = () => {
    this.delete(`${_paths.output_wordpress_theme.js}**/*.js`);
    this.bareCopy(`${_paths.output_paths.js}scripts.min.js`, `${_paths.output_wordpress_theme.js}`);
}

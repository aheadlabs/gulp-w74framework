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

exports.default = () => {

    let source = [`${_paths.source_paths.node_modules}bootstrap/dist/js/bootstrap.bundle.min.js`];
    let destination = `${_paths.source_paths.node_modules}jquery/dist/jquery.slim.min.js`;

    logger.info(`Processing Javascript files...`);

    return gulp.src(source).on('end', function() {
        logger.info(`Deleting Javascript files from ${destination}`);
        return del(`${_paths.output_paths.js}**/*.js`, {force: true});
    })
        .pipe(concat('scripts.min.js')).on('end', function() {
            logger.info(`Concatenated Javascript into scripts.min.js`);
            logger.info(`Starting stripdebug() process on scripts.min.js`)
        })
        .pipe(stripdebug()).on('end', function() {
            logger.info(`Finished stripdebug() process on scripts.min.js`);
            logger.info(`Starting uglify() process on scripts.min.js`)
        })
        .pipe(uglify()).on('end', function() {
            logger.info(`Finished uglify() process on scripts.min.js`);
            logger.info(`Moving Javascript files from ${source} to ${destination}`);
        })
        .pipe(gulp.dest(destination)).on('end', function() {
            logger.info(`Finished processing Javascript files.`);
        });
};

exports.distWordpress = () => {
    // this.delete(`${_paths.output_wordpress_theme.js}**/*.js`);
    // this.bareCopy(`${_paths.output_paths.js}scripts.min.js`, `${_paths.output_wordpress_theme.js}`);
}

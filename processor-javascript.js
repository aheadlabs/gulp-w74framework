const
concat = require('gulp-concat'),
core = require('./core'),
gulp = require('gulp'),
{ logger } = require('./logger'),
stripdebug = require('gulp-strip-debug'),
uglify = require('gulp-uglify')
;

let 
_paths,
_source,
_destination,
_wordpress
;

exports.deployToWordpress = gulp.series(deleteWordpressFiles, copyWordpressFiles);
exports.do = gulp.series(up, deleteDistFiles, processDistFiles, this.deployToWordpress, down);

function up(done) {
    logger.info('##### JAVASCRIPT #####');
    logger.info('Warming up...');
    _paths = core.getPaths();
    _source = [
        `${_paths.source_paths.node_modules}jquery/dist/jquery.slim.min.js`,
        `${_paths.source_paths.node_modules}bootstrap/dist/js/bootstrap.bundle.min.js`,
        `${_paths.source_paths.js}**/*.js`
    ];
    _destination = `${_paths.output_paths.js}`;
    _wordpress = _paths.output_wordpress_theme.js ? `${_paths.output_wordpress_theme.js}` : null;
    done();
}

function down(done) {
    logger.info('##### --- #####');
    done();
}

function deleteDistFiles(done) {
    core.deleteFiles(_destination, '**/*.js');
    done();
}

function processDistFiles() {
    return gulp.src(_source)
        .on('end', () => logger.info('Concatenating scripts...'))
        .pipe(concat('scripts.min.js'))
        .on('end', () => logger.info('Removing debug stuff...'))
        .pipe(stripdebug())
        //.on('end', () => logger.info('Minifying...'))
        //.pipe(uglify())
        .on('end', () => logger.info(`Copying JavaScript files from ${_source} to ${_destination}...`))
        .pipe(gulp.dest(_destination))
        .on('end', () => logger.info('Finished processing JavaScript files.'))
    ;
}

function deleteWordpressFiles(done) {
    if(_wordpress) core.deleteFiles(_wordpress, '**/*.js');
    done();
}

function copyWordpressFiles(done) {
    if(_wordpress) {
        return gulp.src(`${_destination}**/*.js`)
            .on('end', () => logger.info(`Copying JavaScript files from ${_destination} to ${_wordpress}...`))
            .pipe(gulp.dest(_wordpress))        
            .on('end', () => logger.info('Finished deployment of JavaScript files.'))
        ;
    }
    done();
}

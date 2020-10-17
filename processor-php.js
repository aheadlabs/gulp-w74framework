const
core = require('./core'),
gulp = require('gulp'),
{ logger } = require('./logger')
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
    logger.info('##### PHP #####');
    logger.info('Warming up...');
    _paths = core.getPaths();
    _source = `${_paths.source_paths.src}**/*.php`;
    _destination = `${_paths.output_paths.dist}`;
    _wordpress = _paths.output_wordpress_theme.dest ? `${_paths.output_wordpress_theme.dest}` : null;
    done();
}

function down(done) {
    logger.info('##### --- #####');
    done();
}

function deleteDistFiles(done) {
    core.deleteFiles(_destination, '**/*.php');
    done();
}

function processDistFiles() {
    return gulp.src(_source)
        .on('end', () => logger.info(`Copying PHP files from ${_source} to ${_destination}...`))
        .pipe(gulp.dest(_destination))
        .on('end', () => logger.info('Finished processing PHP files.'))
    ;
}

function deleteWordpressFiles(done) {
    if (_wordpress) core.deleteFiles(_wordpress, '**/*.php');
    done();
}

function copyWordpressFiles(done) {
    if (_wordpress) {
        return gulp.src(`${_destination}**/*.php`)
            .on('end', () => logger.info(`Copying PHP files from ${_destination} to ${_wordpress}...`))
            .pipe(gulp.dest(_wordpress))        
            .on('end', () => logger.info('Finished deployment of PHP files.'))
        ;
    }
    done();
}

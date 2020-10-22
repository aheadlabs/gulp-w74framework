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
    logger.info('##### Fonts #####');
    logger.info('Warming up...');
    _paths = core.getPaths();
    _source = `${_paths.source_paths.fonts}**/*.{ttf, otf, eot, woff, woff2, svg}`;
    _destination = `${_paths.output_paths.fonts}`;
    _wordpress = _paths.output_wordpress_theme.fonts ? `${_paths.output_wordpress_theme.fonts}` : null;
    done();
}

function down(done) {
    logger.info('##### --- #####');
    done();
}

function deleteDistFiles(done) {
    core.deleteFiles(_destination, '**/*.{ttf, otf, eot, woff, woff2, svg}');
    done();
}

function processDistFiles() {
    return gulp.src(_source)
        .on('end', () => logger.info(`Copying font files from ${_source} to ${_destination}...`))
        .pipe(gulp.dest(_destination))
        .on('end', () => logger.info('Finished processing font files.'))
    ;
}

function deleteWordpressFiles(done) {
    if (_wordpress) core.deleteFiles(_wordpress, '**/*.{ttf, otf, eot, woff, woff2, svg}');
    done();
}

function copyWordpressFiles(done) {
    if (_wordpress) {
        return gulp.src(`${_destination}**/*.{ttf, otf, eot, woff, woff2, svg}`)
            .on('end', () => logger.info(`Copying fonts files from ${_destination} to ${_wordpress}...`))
            .pipe(gulp.dest(_wordpress))        
            .on('end', () => logger.info('Finished deployment of font files.'))
        ;
    }
    done();
}

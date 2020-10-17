const
autoprefixer = require('autoprefixer')(),
core = require('./core'),
cssnano = require('cssnano'),
gulp = require('gulp'),
{ logger } = require('./logger'),
postcss = require('gulp-postcss'),
replace = require('gulp-replace'),
sass = require('gulp-sass'),
tools = require('./tools')
;

let 
_paths,
_source,
_destination,
_wordpress,
_version
;

exports.deployToWordpress = gulp.series(deleteWordpressFiles, copyWordpressFiles);
exports.do = gulp.series(up, deleteDistFiles, processDistFiles, this.deployToWordpress, down);

function up(done) {
    logger.info('##### STYLES #####');
    logger.info('Warming up...');
    _paths = core.getPaths();
    _source = `${_paths.source_paths.css}*.scss`;
    _destination = `${_paths.output_paths.dist}`;
    _wordpress = _paths.output_wordpress_theme.dest ? `${_paths.output_wordpress_theme.dest}` : null;
    _version = tools.getPackageVersion(tools.getPackage(_paths.source_paths.root))
    logger.debug(`Theme version is ${_version}`);
    done();
}

function down(done) {
    logger.info('##### --- #####');
    done();
}

function deleteDistFiles(done) {
    core.deleteFiles(_destination, '*.css');
    done();
}

function processDistFiles() {
    return gulp.src(_source)
        .on('end', () => logger.info('Transpiling SASS files...'))
        .pipe(sass({outputStyle: 'compressed'}))
        .on('end', () => logger.info(`Replacing version with value: ${_version}...`))
        .pipe(replace('{{version}}', `${_version}`))
        .on('end', () => logger.info('Prefixing CSS for browser polyfills...'))
        .pipe(postcss([autoprefixer]))
        .on('end', () => logger.info('Minifying...'))
        .pipe(postcss([cssnano]))
        .on('end', () => logger.info(`Copying style files to ${_destination}...`))
        .pipe(gulp.dest(_destination))
        .on('end', () => logger.info('Finished processing styles.'))
    ;
}

function deleteWordpressFiles(done) {
    if(_wordpress) core.deleteFiles(_wordpress, '*.css');
    done();
}

function copyWordpressFiles(done) {
    if(_wordpress) {
        return gulp.src(`${_destination}*.css`)
            .on('end', () => logger.info(`Copying style files from ${_destination} to ${_wordpress}...`))
            .pipe(gulp.dest(_wordpress))        
            .on('end', () => logger.info('Finished deployment of style files.'))
        ;
    }
    done();
}

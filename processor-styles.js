const
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer'),
postcss = require('gulp-postcss'),
replace = require('gulp-replace'),
sass = require('gulp-sass')
;

logger.info('Warming up styles processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

const cssProcessors = [
    require('autoprefixer')(),
    require('cssnano')
];

exports.default = (done) => {
    // Get theme version
    const version = core.getVersion(_paths.output_paths.wordpress);
    logger.debug(`Theme version is ${version}`);

    // Delete output files
    this.delete(`${_paths.output_paths.theme}*.css`);

    // Transpile SCSS files
    this.transpileScss(`${_paths.source_paths.css}*.scss`, `${_paths.source_paths.css}`, version);
    logger.debug('Bootstrap SCSS files are @include-d in the styles.scss file from the node_modules sources.');

    // Copy CSS files
    this.copy(`${_paths.source_paths.css}*.css`, `${_paths.output_paths.theme}`);

    done();
};

exports.delete = (path) => {
    logger.info(`Deleting CSS files from ${path}`);
    return del(path, {force: true});
}

exports.copy = (source, destination) => {    
    logger.info(`Processing and moving styles from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(postcss(cssProcessors))
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}

exports.transpileScss = (source, destination, version) => {
    logger.info(`Transpiling SCSS files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(replace('{{version}}', `${version}`))
        .pipe(gulp.dest(destination));
}

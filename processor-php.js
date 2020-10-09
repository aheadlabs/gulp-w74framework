const
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer')
;

logger.info('Warming up PHP processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

exports.default = (done) => {
    this.delete(`${_paths.output_paths.dist}**/*.php`);
    this.copy(`${_paths.source_paths.src}**/*.php`, _paths.output_paths.dist);

    if(_paths.output_wordpress_theme.dest){
        this.delete(`${_paths.output_wordpress_theme.dest}**/*.php`);
        this.copy(`${_paths.source_paths.src}**/*.php`, _paths.output_wordpress_theme.dest)
    }
    done();
};

exports.delete = (path) => {
    logger.info(`Deleting PHP files from ${path}`);
    return del(path, {force: true});
}

exports.copy = (source, destination) => {    
    logger.info(`Moving PHP files from ${source} to ${destination}`);
    return gulp.src(source)
        .pipe(newer(destination))
        .pipe(gulp.dest(destination));
}

const
concat = require('gulp-concat'),
core = require('./core'),
fs = require('fs'),
gulp = require('gulp'),
https = require('https'),
{ logger } = require('./logger'),
stripdebug = require('gulp-strip-debug'),
uglify = require('gulp-uglify'),
validUrl = require('valid-url')
;

let
_destination,
_gulpConfiguration,
_paths,
_source = [],
_wordpress
;

exports.deployToWordpress = gulp.series(deleteWordpressFiles, copyWordpressFiles);
exports.do = gulp.series(up, deleteDistFiles, processDistFiles, this.deployToWordpress, down);

function parsePath(path, _paths){
    // If path is a URL, download it
    if (validUrl.isWebUri(path)){
        const url = new URL(path);
        let filePath = `${_paths.source_paths.js}_${url.hostname}_${url.pathname.split("/").join("_")}${url.pathname.endsWith(".js") ? '': '.js'}`;
        //let file = fs.createWriteStream(filePath);

        let urlData = https.get(url, res => {
            res.on('data', data => {
                urlData += data;
            });
            res.on('end', () => {
                fs.writeFileSync(filePath, urlData, 'utf8');
            });
        });

        return filePath;
    }

    // If path is from node_modules, replace token by real path
    if (path.indexOf('{node_modules}') >= 0){
        return path.replace('{node_modules}', _paths.source_paths.node_modules);
    }

    return path;
}

function up(done) {
    logger.info('##### JAVASCRIPT #####');
    logger.info('Warming up...');
    _paths = core.getPaths();

    // Add scripts
    _gulpfileConfiguration = `${_paths.parameters.theme_path}/gulpfile.json`;
    if(fs.existsSync(_gulpfileConfiguration)){
        _gulpConfiguration = require(_gulpfileConfiguration);
        _gulpConfiguration.scripts.forEach(script => _source.push(parsePath(script, _paths)));
    }
    _source.push(`${_paths.source_paths.js}**/*.js`);

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

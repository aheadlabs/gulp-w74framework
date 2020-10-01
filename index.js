const
gulp = require('gulp'),
{ logger } = require('./logger'),
//processorImages = require('./processor-images').default,
//processorPhp = require('./processor-php').default,
//processorStyles = require('./processor-styles').default,
//processorJavaScript = require('./processor-javascript').default,
watcher = require('./watcher').default
;

exports.build = gulp.series(
    require('./processor-php').default,
    require('./processor-images').default,
    require('./processor-styles').default,
    require('./processor-javascript').default
);

exports.watch = gulp.series(
    this.build,
    watcher
);

// TODO Create gulp file demo (gulpfile-demo.js) on GitHub and update gulp-w74framework documentation
// TODO We are not deleting files from destination that are not in the Vinyl source, so newer() is useless.

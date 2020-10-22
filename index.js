const
gulp = require('gulp'),
{ logger } = require('./logger'),
processorPhp = require('./processor-php'),
processorImages = require('./processor-images'),
processorStyles = require('./processor-styles'),
processorJavascript = require('./processor-javascript'),
watcher = require('./watcher')
;

exports.build = gulp.series(
    processorPhp.do,
    processorImages.do,
    processorStyles.do,
    processorJavascript.do
);

exports.watch = gulp.series(
    this.build,
    watcher.do
);

// TODO We are not deleting files from destination that are not in the Vinyl source, so newer() is useless.
// TODO Process .pot, .po and .mo files and move .mo files

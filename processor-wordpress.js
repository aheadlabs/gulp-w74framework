const
core = require('./core'),
errors = require('./errors.json'),
{ logger } = require('./logger')
;

logger.info('Warming up WordPress processor...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

exports.default = (done) => {
    if(_paths.output_wordpress_theme.dest){
        require('./processor-php').distWordpress();
        require('./processor-images').distWordpress();
        require('./processor-styles').distWordpress();
        require('./processor-javascript').distWordpress();
    }

    done();
};

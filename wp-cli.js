const
execSync = require('child_process').execSync
;

exports.getOption = function(optionName, wordPressPath) {
    const command = `wp option get ${optionName} --path="${wordPressPath}"`;
    return String(execSync(command)).replace(/\n$/, '');
}

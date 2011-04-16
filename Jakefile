//
// Jakefile for customSelect
//

var sys = require('sys'),
    exec  = require('child_process').exec;

desc("This builds the uglified version of customSelect JS");
task('default', [], function () {
  exec('/usr/local/bin/uglifyjs -nc -o src/jquery.customSelect.min.js src/jquery.customSelect.js', function (error, stdout, stderr) {
    if (error !== null) {
      console.log('Uglify error: ' + error);
    }
  });
});
//
// Jakefile for customSelect
//

var sys = require('util'),
    exec  = require('child_process').exec;

desc("This builds the uglified version of customSelect JS");
task('default', [], function () {
  exec('/usr/local/bin/uglifyjs -nc -o src/jquery.customSelect.min.js src/jquery.customSelect.js', function (error, stdout, stderr) {
    if (error !== null) {
      console.log('Uglify error: ' + error);
    } else{
      exec("cat src/jquery.customSelect.min.js|gzip -cf|wc -c", function (error, stdout) {
        console.log('Gzipped size of minified script:', (stdout/1024+"").substr(0, 4) + 'k');
      })
    }
  });
});
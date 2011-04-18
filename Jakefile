//
// Jakefile for the pages branch of customSelect
// Essentially it grabs a few files and brings them in to
// this branch.
//

var exec = require('child_process').exec,
    path = require('path'),
    fs   = require('fs');

desc("Pulls in files from the master branch");
task('default', ['cleanLocal'], function () {
  var filesToCopy = [
        'src/jquery.customSelect.js',
        'src/jquery.customSelect.css',
        'test/customSelect.spec.js',
      ];
      
  (function copyFiles(err, stdout, stderr) {
    if (err) {
      console.log("error copying file!");
      console.log(stderr);
    } else if (filesToCopy.length) {
      exec('git checkout master ' + filesToCopy.shift(), copyFiles);
    }
  })();
});

desc("Fetch and build vendor files");
task("vendor", ['cleanVendor'], function () {
  var vendorFiles = vendorFiles = [
        'https://github.com/pivotal/jasmine/raw/master/lib/jasmine.js',
        'https://github.com/pivotal/jasmine/raw/master/lib/jasmine-html.js',
        'https://github.com/velesin/jasmine-jquery/raw/master/lib/jasmine-jquery.js'
      ];
  
  (function getVendorFiles(err, stdout, stderr) {
    if (err) {
      console.log("error fetching file!");
      console.log(stderr);
    } else if (vendorFiles.length) {
      var file = vendorFiles.shift();
      exec('curl "' + file + '" > test/vendor/' + path.basename(file), getVendorFiles);
    } else {
      // Uglifying time
      exec('cat test/vendor/jasmine.js test/vendor/jasmine-html.js test/vendor/jasmine-jquery.js > test/vendor/build.js', function () {
        exec('/usr/local/bin/uglifyjs -nc -o test/vendor/jasmine.js test/vendor/build.js', function (err, stdout, stderr) {
          if (err !== null) {
            console.log('Uglify error: ' + err);
            console.log(stderr);
          }
          
          removeFiles([
            'test/vendor/jasmine-html.js',
            'test/vendor/jasmine-jquery.js',
            'test/vendor/build.js'
          ]);
        });        
      });
    }
  })();

  exec('curl "https://github.com/pivotal/jasmine/raw/master/lib/jasmine.css" > test/vendor/jasmine.css');
});

desc("Remove all of our code files from the master branch");
task('cleanLocal', [], function () {
  removeFiles([
    'src/jquery.customSelect.js',
    'src/jquery.customSelect.css',
    'test/customSelect.spec.js'
  ]);
});

desc("Remove all files that have been copied from vendors");
task('cleanVendor', [], function () {
  removeFiles([
    'test/vendor/jasmine.js',
    'test/vendor/jasmine.css'
  ]);
});

function removeFiles(files) {
  files.forEach(function (path) {
    fs.unlink(path);
  });
}
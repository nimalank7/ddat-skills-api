// Core dependencies
const path = require('path')
const fs = require('fs')

checkFiles()
runGulp()

// Warn if node_modules folder doesn't exist
function checkFiles () {
  const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'))
  if (!nodeModulesExists) {
    console.error('ERROR: Node module folder missing. Try running `npm install`')
    process.exit(0)
  }
}

// Run gulp
function runGulp () {
  const spawn = require('cross-spawn')

  process.env['FORCE_COLOR'] = 1
  var gulp = spawn('./node_modules/.bin/gulp')
  gulp.stdout.pipe(process.stdout)
  gulp.stderr.pipe(process.stderr)
  process.stdin.pipe(gulp.stdin)

  gulp.on('exit', function (code) {
    console.log('gulp exited with code ' + code.toString())
  })
}

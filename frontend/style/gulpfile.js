const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// Compile SCSS into CSS
function compileSass() {
  return src('*.scss') // Source directory for any scss files
    .pipe(sass().on('error', sass.logError)) // Compile and log errors
    .pipe(dest('dist/index.css')); // Output destination
}

// Watch for file changes
function watchFiles() {
  watch('*.scss', compileSass);
}

// Export tasks to make them public
exports.compileSass = compileSass;
exports.default = series(compileSass, watchFiles);
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var paths = {
    src: 'BJUI/js'
};

var files = [
    paths.src + '/bjui-core.js',
    paths.src + '/bjui-regional.zh-CN.js',
    paths.src + '/bjui-frag.js',
    paths.src + '/bjui-extends.js',
    paths.src + '/bjui-basedrag.js',
    paths.src + '/bjui-slidebar.js',
    paths.src + '/bjui-contextmenu.js',
    paths.src + '/bjui-navtab.js',
    paths.src + '/bjui-dialog.js',
    paths.src + '/bjui-taskbar.js',
    paths.src + '/bjui-ajax.js',
    paths.src + '/bjui-alertmsg.js',
    paths.src + '/bjui-pagination.js',
    paths.src + '/bjui-util.date.js',
    paths.src + '/bjui-datepicker.js',
    paths.src + '/bjui-ajaxtab.js',
    paths.src + '/bjui-datagrid.js',
    paths.src + '/bjui-tablefixed.js',
    paths.src + '/bjui-tabledit.js',
    paths.src + '/bjui-spinner.js',
    paths.src + '/bjui-lookup.js',
    paths.src + '/bjui-tags.js',
    paths.src + '/bjui-upload.js',
    paths.src + '/bjui-theme.js',
    paths.src + '/bjui-initui.js',
    paths.src + '/bjui-plugins.js',
    paths.src + '/bjui-drag.js',
    paths.src + '/bjui-address.js'
];

gulp.task('build', function() {
    gulp.src(files)
        .pipe(uglify({
            output: {
                max_line_len: 0
            }
        }))
        .pipe(concat('bjui-all.js'))
        .pipe(gulp.dest(paths.src));
});

gulp.task('default', ['build']);

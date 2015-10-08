var gulp = require('gulp');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var staticHash = require('gulp-static-hash');
var minimist = require('minimist');

var knownOptions = {
    string: 'file',
    default: {
        env: process.env.NODE_ENV || 'production'
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('s', function() {
    var file = '/bjui-' + options.file + '.js';
    return gulp.src(paths.src + file)
        .pipe(uglify({
            output: {
                max_line_len: 0
            },
            preserveComments: function(node, comment) {
                console.log(comment.value);
                console.log(comment.type);
                if (/^\/\* =+/.test(comment.value) && /\* =+$/.test(comment.value)) {
                    return true;
                }
            }
        }))
        .pipe(concat(file + ".bak"))
        .pipe(gulp.dest(paths.dist));
});

var paths = {
    src: 'BJUI/js',
    dist: 'BJUI/js'
};

var file = [
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
    paths.src + '/bjui-plugins.js'
];

gulp.task('build', function() {
    gulp.src(file)
        .pipe(uglify({
            output: {
                max_line_len: 0
            }
        }))
        .pipe(concat('bjui-all.js'))
        .pipe(gulp.dest(paths.dist));
});

// 清洁工作
gulp.task('clean', function() {
    gulp.src(paths.dist)
        .pipe(clean({
            force: true
        }));
});

gulp.task('default', ['build']);

const gulp = require("gulp");

gulp.task("watch appConfig change", function (done) {
    gulp.watch("./appConfig/*.ts", gulp.parallel(["copy config to weChatMiniProgram"]));
    done();
});

gulp.task("copy config to weChatMiniProgram", function (done) {
    gulp.src("./appConfig/*.ts").pipe(gulp.dest("./weChatMiniProgram/miniprogram/appConfig"));
    done();
});

//  todo 未启用
gulp.task("copy provider to weChatMiniProgram", function(done) {
    gulp.src("./provider/*.ts").pipe(gulp.dest("./weChatMiniProgram/miniprogram/provider"));
    done();
});

gulp.task("default", gulp.parallel(["copy config to weChatMiniProgram", "watch appConfig change"]), function (done) {
    done();
});
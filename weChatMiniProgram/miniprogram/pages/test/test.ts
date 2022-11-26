Page({
    data: {},
    onLoad() {
        this.setData({
            uploadFile: this.uploadFile.bind(this)
            //这里需要绑定uploadFile函数，因为在uploader组件中会调用这个方法，不绑定的话，this会指向uploader组件中的this，但是uploader组件中没有这个方法，这个方法需要用户自定义
        });
    },
    uploadFile(files: Array<any>) {
        console.log('upload files', files);
    }
});
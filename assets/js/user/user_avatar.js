$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    var layer = layui.layer;
    // 1.2 配置选项
    const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    // $('#file').hide();
    $('#btnup').on('click', function() {
            $('#file').click()
        })
        // 文件修改就会触发更改事件
    $('#file').on('change', function(e) {
            // console.log(e);
            var filelist = e.target.files;
            // console.log(filelist);
            if (filelist.length == 0) {
                return layer.msg('请选择照片!')
            }
            // 1.拿到用户选择的文件
            var file = e.target.files[0];
            // console.log(file);

            // 2.将文件，转化为路径
            var newImgUrl = URL.createObjectURL(file);
            // console.log(newImgUrl);

            // 先销毁旧的裁剪区域，然后给图片设置新的src地址，然后渲染到区域
            $('#image').cropper('destroy').attr('src', newImgUrl).cropper(options);



        })
        // 为确定按钮绑定点击事件
    $('#btnUpLoad').on('click', function() {
        // 1.拿到用户裁剪之后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将

        // 2.调用接口,将图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新头像失败!')
                }
                layer.msg('更换头像成功')
                window.parent.getUser();

            }
        })

    })
})
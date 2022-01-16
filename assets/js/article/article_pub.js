$(function() {


    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器 
    initEditor();
    // 1. 初始化图片裁剪器 
    var $image = $('#image')
        // 2. 裁剪选项 
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }
        // 3. 初始化裁剪区域 
    $image.cropper(options);
    // 为选择封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
            $('#btn-file').click();
        })
        // 监听btn-file的change事件，获取用户选择文件的列表
    $('#btn-file').on('change', function(e) {
            // 获取到文件列表的数组
            var files = e.target.files;
            console.log(files);

            if (files.length == 0) {
                return layer.msg('请选择文件!')
            }
            // 根据文件，创建对应的url地址
            var newImgfile = URL.createObjectURL(files[0]);
            // 为裁剪区域重新赋值图片
            $('#image').cropper('destroy').attr('src', newImgfile).cropper(options) //销毁旧的裁剪区域,将图片地址修改,重新渲染裁剪区域

        })
        // 定义文章的发布状态
    var art_state = '已发布'
        // 为存为草稿按钮绑定点击事件
    $('#save').on('click', function() {
            art_state = '草稿'
        })
        // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单的默认提交
        e.preventDefault();
        // art_state = '已发布';
        // 2.基于form表单快速创建一个formdata对象

        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)
            // 创建一个canvas画布，将Canvas画布的内容转化为文件对象，
        $image.cropper('getCroppedCanvas', { width: 400, height: 280 }).toBlob(function(blob) {
            // 得到文件对象进行后续操作
            // 将文件对象存到fd中
            fd.append('cover_img', blob);
            // 发起ajax数据请求
            publishArricle(fd);


        })

    })



    // 定义ajax请求，实现发布文章
    function publishArricle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意:如果向服务器提交的是formData 格式的数据，
            // 必须添加以下两个配置对象
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!');
                }
                layer.msg('发布文章成功!');
                // 发布文章成功后，跳转到文章发布页面
                location.href = '/article/artlist.html'


            }
        })
    }




    // 发起ajax请求，获取文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!')
                };
                // 使用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tbl-list', res)
                $('[name=cate_id]').html(htmlStr);
                // 动态渲染的表单元素，记得添加render()方法
                form.render();

            }
        })
    }
})
$(function() {
    // 1.获取文章分类的列表
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 为添加类别绑定点击事件
    var index = null;
    $('#btnAddCate').on('click', function() {
            index = layer.open({
                area: ['500px', '250px'],
                type: 1,
                title: '添加文章分类',
                content: $('#dialog-add').html()
                    // 通过模板引擎方式的script方式绘制内容部分
            });
        })
        // 因为script标签是动态生成的，不能直接调用id，所以通过事件代理的方式来绑定submit事件
        // 页面上有的元素
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            // console.log('ok');

            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加图书失败!');
                    }
                    initArtCateList();
                    layer.msg('添加图书成功!');
                    // 根据索引，关闭对应的弹出层
                    layer.close(index);

                }
            })
        })
        // 通过事件代理的方式，给编辑按钮绑定点击事件
    var indexEdit = null;
    $('body').on('click', '#btn-edit', function() {
            // console.log('ok');
            // 弹出修改文章信息的层
            indexEdit = layer.open({
                area: ['500px', '250px'],
                type: 1,
                title: '修改文章分类',
                content: $('#dialog-edit').html()
                    // 通过模板引擎方式的script方式绘制内容部分

            });


            var id = $(this).attr('data-id');
            console.log(id);
            // 发起请求，获取对应的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    // console.log(res);
                    form.val('form-edit', res.data);


                }

            })


        })
        // 通过代理的形式，为表单添加提交事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败!')
                    }
                    layer.msg('更新数据成功!')
                    layer.close(indexEdit);
                    initArtCateList();
                }
            })
        })
        // 通过代理的方式，给删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log(index);
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!');
                    }
                    layer.msg('删除成功');
                    initArtCateList();

                }
            })


            layer.close(index);
        });
    })

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取图书列表失败!')
                };
                var htmlStr = template('tpl-table', res);
                $('#Tbody').html(htmlStr);

            }
        })
    }
})
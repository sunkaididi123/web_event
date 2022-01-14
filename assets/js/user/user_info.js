$(function() {
    var form = layui.form;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }

    })
    initUserInfo();
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            // 发起ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('获取用户信息失败')
                    }
                    // form.val('formUserInfo', res.data);
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                    layer.msg('更改成功!')
                    window.parent.getUser();

                }
            })


        })
        // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')

                }
                // console.log(res);
                // 调用form.val快速为表单复制
                form.val('formUserInfo', res.data)


            }
        })
    }


    // 给重置按钮绑定点击事件
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();

    })
})
$(function() {
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if ($('#oldPwd').val() === value) {
                return '新旧密码不能相同!'
            }

        },
        oldPwd: function(value) {
            if ($('#newPwd').val() !== value) {
                return '两次密码不相同!'
            }

        }

    })


    //为表单绑定提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!')
                    // 重置表单
                $('.layui-form')[0].reset();

            }
        })
    })
})
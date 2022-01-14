$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click', () => {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击去登陆账号的链接
    $('#link_login').on('click', () => {
            $('.reg-box').hide();
            $('.login-box').show();
        })
        // 从layui导入from对象
    var form = layui.form;
    // 通过form.verify()这个函数自定义校验规则
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                // 通过形参拿到的是确认密码框的内容
                // 还需要拿到密码框的内容
                var pwdput = $('.reg-box [name=password]').val();

                // 然后进行一次等于的判断，如果判断失败则return一个提示消息
                if (value !== pwdput) {
                    return '两次密码不一致!'
                }
            }
        })
        // var layer = layui.layer;

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', (e) => {
            // 阻止表单默认提交行为
            e.preventDefault();
            // 发起post请求，注册用户
            // 参数1：请求的url地址
            // 参数2：请求的数据，对象
            // 参数3：服务器返回的消息
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            $.post('/api/reguser', data, (res) => {
                if (res.status !== 0) {
                    console.log(res);

                    return layer.msg(res.message);

                };
                layer.msg('注册成功!请登录');
                // 模拟人的点击行为
                $('#link_login').click();


            })


        })
        // 监听登录表单的提交事件
    $('#form_login').on('submit', (e) => {
        e.preventDefault();
        // 快速获取表单中的数据
        var datain = $('#form_login').serialize();
        // console.log(datain);

        $.post('/api/login', datain, (res) => {
            if (res.status !== 0) {
                console.log(res.message);

                return layer.msg('登录失败')
            }
            layer.msg('登录成功');
            // console.log(res.token);
            // 将登录成功的token字符串保存到localStorage中
            localStorage.setItem('token', res.token);

            location.href = '/index.html'



        })

    })
})
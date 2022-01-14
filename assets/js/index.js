$(function() {

    // 调用函数获取用户基本信息
    getUser();
    // 点击按钮，实现退出功能
    $('#btnlogout').on('click', function() {
        // console.log('ok') ;
        // 提示用户是否确定退出
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            console.log('ok');

            //do something
            // 1.清空本地存储localstorage里面的内容
            localStorage.removeItem('token');

            // 2.重新跳转到首页
            location.href = '/login.html'
                // 关系询问框
            layui.layer.close(index);
        });

    })


})


// 获取用户的基本信息
function getUser() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                // 调用randerAvatar 渲染用户头像
                randerAvatar(res.data);

            }
            // 无论成功还是失败，最终都会调用complete函数
            // complete: function(res) {
            //     // console.log('执行了complete');
            //     // console.log(res);
            //     // 在complete回调函数中可以通过res.responseJSON拿到
            //     // 服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1.强制清空token
            //         localStorage.removeItem('token');

        //         // 2.强制跳转到登录页
        //         location.href = '/login.html'

        //     }



        // }


    })

}
//渲染用户头像
function randerAvatar(user) {
    var username = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + username)
        // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.fontimg').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();

    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = username[0].toUpperCase();
        $('.fontimg').html(first).show();
    }


}
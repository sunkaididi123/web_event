// 注意：每次调用$.get(),$.post()或$.ajax()方法的时候，都会先调用ajaxPrefilter这个函数
// 在这个函数中，我们可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 统一为有权限的接口拼接，设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };
    options.complete = function(res) {

        // console.log('执行了complete');
        // console.log(res);
        // 在complete回调函数中可以通过res.responseJSON拿到
        // 服务器响应回来的数据
        if (res.responseJSON.status == 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');

            // 2.强制跳转到登录页
            location.href = '/login.html'

        }
    }

})
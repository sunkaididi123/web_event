// 注意：每次调用$.get(),$.post()或$.ajax()方法的时候，都会先调用ajaxPrefilter这个函数
// 在这个函数中，我们可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url;


})
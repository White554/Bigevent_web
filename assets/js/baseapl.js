// 每次调用$.ajax() $.post() $.get() 都会先调用$.ajxaPrefilter()  可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统计拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统一为有权限的接口添加headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
        // 为有权限的额接口添加complete回调函数
        options.complete = function (res) {
            console.log(res);
            // 可以使用res.responseJSON拿到服务器响应回来的数组
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空存储的token
                localStorage.removeItem('token')
                // 强制跳转到登陆页面
                location.href = '/login.html'
            }
        }
    }

})
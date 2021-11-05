$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录链接
    $('#link_log').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义校验规则，从layui获取form
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 自定义一个叫做pwd校验规则  在文本框应用 |pwd
        pwd: [/^[\S]{6,12}$/, '密码必须是6到12位数字，并且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 形参拿到的是确认密码框的内容
            // 还需要拿到密码框的内容进行一次判断
            // 如果不一致则返回一个字符串即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认行为 
        e.preventDefault();
        // 发起ajax的post请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功!请登录')
            $('#link_log').click();
        })
    })

    // 监听表单的登录行为
    $('#form_login').on("submit", function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 发起ajax的post请求
        var data = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }
        $.post('/api/login', data, function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('登录失败')
            }
            layer.msg('登录成功')
            // 将登录成功得到的token字符，保存到localStroage中
            localStorage.setItem('token', res.token)
            location.href = '/index.html'
        })
    })
})
$(function () {
    var form = layui.form

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度应该在1~6个字符之间'
            }
        }
    })

    initUserInfo()
    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res.data);
                if (res.status !== 0) {
                    return layui.msg('获取用户信息失败')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单的数据
    $('#btnRest').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })



    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法 重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})
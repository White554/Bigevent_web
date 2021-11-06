$(function () {
    // 调用获取用户基本信息
    getUserInfo();

    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function (index) {
            // 1 清空本地存储的token
            localStorage.removeItem('token')
            // 2 跳转到登陆页面
            location.href = '/login.html'

            // 关闭confirm询问框
            layer.close(index)
        })
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        }
        // 无论是成功还是失败都会调用comlete函数
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
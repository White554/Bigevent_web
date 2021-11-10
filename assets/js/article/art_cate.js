$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    function getArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    getArticleList()

    // 为添加按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 通过代理为表单代理事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                getArticleList()
                layer.msg('新增分类成功')
                // 根据索引 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 为编辑按钮代理绑定代理事件
    var idnexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出修改文章分类信息
        idnexEdit = layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // 发起请求获取对应信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理为修改分类表单绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败')
                }
                layer.msg('修改分类成功')
                layer.close(idnexEdit)
                getArticleList()
            }
        })
    })


    // 通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' },
            function (idnex) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败')
                        }
                        layer.msg('删除分类成功')
                        // 关闭弹出层
                        layer.close(idnex)
                        // 重新刷新页面
                        getArticleList()
                    }
                })
            })
    })
})
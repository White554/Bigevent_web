$(function () {
    // 定义查询参数对象，发请求时将参数对象传递给服务器
    var q = {
        pagenum: 1,// 默认请求第一个数据
        pagesize: 2, // 每页显示几条数据
        cate_id: null, // 文章分类的id
        state: null // 文章的发布状态
    }
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padzero(dt.getMonth() + 1)
        var d = padzero(dt.getDate())

        var hh = padzero(dt.getHours())
        var mm = padzero(dt.getMinutes())
        var ss = padzero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }
    // 初始化表格
    initTable()
    // 初始化分类数组
    initCate()

    // 初始化表格
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                // 使用模板引擎渲染数据
                var htmlstr = template('tql-table', res)
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                layer.msg('获取文章分类成功')
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                // 调用layui重新渲染页面
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 修改查询对象q中对应的值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage方法
        laypage.render({
            elem: 'pageBox',  // 分页容器id
            count: total,     // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,    // 默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的回调函数
            jump: function (obj, first) {
                // 将最新的页码存在对象q中
                q.pagenum = obj.curr;
                // 把最新的的条目数复制到查询对象q中
                q.pagesize = obj.limit
                // 根据最新的q重新渲染列表
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 数据删除完成后需要判断当前页面是否还有数据
                    if (len === 1) {
                        // 删除完毕页面没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            // 关闭confirm询问框
            layer.close(index)
        })
    })

    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id')
        location.href = '/article/art_edit.html?Id=' + id
    })
})
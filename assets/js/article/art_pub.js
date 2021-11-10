$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章类别
    initCate()
    // 初始化文本编辑器
    initEditor()

    // 获取文章的类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
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

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverfile的change事件
    $('#coverFile').on('change', function (e) {
        // 获取文件的数组列表
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择封面')
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnsave').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单创建formdata对象
        var fd = new FormData($(this)[0])
        // 将文章发布状态存在fd中
        fd.append('state', art_state)
        // 将裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blo) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件存储到fd对象中
                fd.append('cover_img', blo)
                // 发起ajax请求
                publishArticle(fd)
            })
    })

    // 定义一个发布新文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // formData的对象必须添加两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布新文章失败')
                }
                layer.msg('发布新文章成功')
                // 发布新文章后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})
// const { post } = require("jquery");

$(function() {
    // 定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求参数对象发送到服务器
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
            pagenum: 1, //页码值，默认请求第一页的数据
            pagesize: 2, //每页显示几条数据,，默认显示2条
            cate_id: '', //文章分类的id
            state: '' //文章的发布状态

        }
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormate = function(data) {
            const dt = new Date(data);
            var y = dt.getFullYear()
            var m = padZero(dt.getMinutes() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + ' - ' + m + ' - ' + d + ' ' + hh + ':' + mm + ':' + ss;
        }
        // 定义补零的函数
    function padZero() {
        return n > 9 ? n : '0' + n;
    }

    var layer = layui.layer;
    initTable();
    initCate();

    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询对象q对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表单结构;
        initTable();
    })

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                // 使用模板引擎渲染页面数据
                console.log(res);

                layer.msg('获取文章列表成功!')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);

                // 调用分页的方法
                renderPage(res.total);
            }
        })

    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败!')
                }
                // 调用模板引擎，渲染分类的可选项
                var htmlStr = template('tpl-cast', res);
                $('[name=cate_id]').empty().html(htmlStr);
                form.render();
            }
        })
    }

    // 定义渲染分页的方法 
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.rander()方法来渲染页面结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            conut: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            curr: q.pagenum, //设置默认被选中的分页
            // 分页发生切换的时候，触发jump回调函数
            // 触发jump的方式有两种
            // 方式一：点击页码的时候，会触发jump回调
            // 方式二：只要调用了laypage.rander()方法就会触发jump回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值赋值到q这个查询对象中
                q.pagenum = obj.curr;
                // 把最新的条目数,赋值到q这个查询参数对象的pagesize身上
                q.pagesize = obj.limit //得到每页显示的条数
                    // 根据最新的q获取对应的数据列表，并渲染表格
                    // 可以通过first的值来判断是否执行initTable方法,通过哪种方式触发的kump回调
                    // 如果first的值为true，就是第二种方式触发的
                    // 如果first的值为false，就是第一种方式触发的
                if (!first) {
                    initTable();
                }




            }
        })

    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('body').on('click', '#btn-delete', function() {
        // 拿到删除按钮的个数
        var len = $('#btn-delete').length;

        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {
            // 询问用户是否要删除数据
            var id = $('#btn-delete').attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')
                        // 当数据删除完成后，需要判断当前这一页是否有剩余的数据
                        // 如果没有剩余的数据则让页码值-1之后
                        // 再重新调用initTable()方法
                    if (len === 1) {
                        // 如果len的值为1，证明删除完毕后，页面上没有数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;

                    }

                    initTable();


                }

            })

            layer.close(index);
        });

    })
})
$(function () {


//获得私信页面
    function getMessageList(friendId) {

        $.ajax({
            url: "/manage/messages",
            type: "get",
            data: {
                "async": true,
                "uid": friendId
            },
            success: function (data) {
                $("#mainContainer").html(data);
                $(".navbar-custom-menu").load(window.location.href + " #user-nav");
            },
            error: function () {
                layer.msg("后台好像偷了点小懒哦，重新刷新一下试试！", {icon: 2});            }
        })
    };

//点击左侧用户列表，显示右边聊天记录
    $(document).on("click", '.chat-list-tr', function () {
        $('.chat-list-tr').removeClass('active');
        $(this).addClass('active');
        var friendId = $(this).attr("data-uid");
        //1、显示右侧聊天框
        getMessageList(friendId);
        //2、修改左侧最后一条私信状态
        $(this).find(".last-message-time").removeClass("text-maroon").addClass("text-gray");
    });


//发布私信
    $(document).on('click', '#message-send-btn', function () {
        if ($("#message-content").val().length < 1) {
            layer.alert("好像还没有输入任何内容哦！", {icon: 2});
            return false;
        }
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        var friendId = $("#userchatUl").attr("data-uid");
        var content = $("#message-content").val();
        $.ajax({
            url: "/messages",
            type: 'POST',
            data: {
                "friendId": friendId,
                "content": content
            },
            beforeSend: function (request) {
                request.setRequestHeader(header, token); // 添加  CSRF Token
            },
            success: function (data) {
                if (data.success) {
                    layer.msg("发送成功", {icon: 1});
                    getMessageList(friendId);
                }
            },
            error: function () {
                layer.msg("后台好像偷了点小懒哦，重新刷新一下试试！", {icon: 2});            }
        });
    });

//刷新右侧消息列表和左侧一条记录
    $(document).on('click', '#refresh-message-btn', function () {
        var friendId = $("#userchatUl").attr("data-uid");
        getMessageList(friendId);//获得右侧聊天列表

    });

// //每过60s，自动刷新一下
// setInterval(function () {
//     $("#refresh-message-btn").click();
// }, 60 * 1000);

    /**
     * 点击删除按钮
     */
    $(document).on('click', '#remove-message-btn', function () {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        var friendId = $("#userchatUl").attr("data-uid");

        var name = $("#nickname-span").html();
        layer.confirm('你确认要删除和' + name + '的私信吗', {
            btn: ['确认', '取消'], //按钮
            icon: 8
        }, function (index) {
            $.ajax({
                url: "/messages",
                type: 'PUT',
                async: false,
                data: {
                    "friendId": friendId,
                },
                beforeSend: function (request) {
                    request.setRequestHeader(header, token); // 添加  CSRF Token
                },
                error: function () {
                    layer.msg("后台好像偷了点小懒哦，重新刷新一下试试！", {icon: 2});                },
                complete: function () {
                    getMessageList(friendId);
                    layer.close(index);
                }
            });
        });
    });




})
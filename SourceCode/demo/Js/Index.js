var userTicket = "fa12cad9122f4bf7905bcfa07afd3674";
var desKey = encMe('2', userTicket);
var demo;
$(function () {

    var option = {
        checkBox: true,
        rowNumber: true,
        url: "http://www.isaacxu.com/Home/TableDemo",
        selectOnCheck: true,
        tableId: "#demo", //表的id
        param: {
            RP: 5,
            Page: 1,
            UserId: desKey
        }, //分页对象
        pageList: [5, 15, 20], //每页显示数据个数
        ajaxType: "get",
        ajaxDataType: "jsonp",
        toolbar: [{
            id: "add",
            icon: 'icon-plus',
            text: '添加',
            handler: function () {

            }
        },
            {
                id: "delete",
                icon: 'icon-trash',
                text: '删除',
                handler: function () {
                    if (demo.getSelection().length <= 0) {
                        alert("请先选择需要删除的数据！");
                    } else {
                        if (confirm('确认删除这' + demo.getSelection().length + '条数据吗？')) {
                            $.ajax({
                                url: "http://www.isaacxu.com/Home/DelTableDemo",
                                type: "get",
                                dataType: "jsonp",
                                data:{
                                    UserId: desKey,
                                    Query: demo.getSelection().join(',')
                                },
                                success: function () {

                                }
                            })
                            alert("删除成功");
                        }
                    }
                }
            }
        ],
        tableHeader: $("#tabdiv").html(),
        column: [[
            { title: "ck", field: 'Id' },
            { title: '姓名', field: 'Name', width: "120px" },
            {
                title: "性别", field: "Sex",width: "60px", formatter: function (val) {
                    switch (val) {
                        case 1:
                            return "<span style='color:green;font-weight:bold'>男</span>";
                        default:
                            return "<span style='color:red;font-weight:bold'>女</span>";
                    }
                }
            },
            { title: "年龄", field: "Age", width: "85px" },
            { title: "职业", field: "Profession", width: "120px" },
            { title: "留言", field: "Message" },
            {
                title: "操作", field: "id", width: "120px", formatter: function (val, n, data) {
                    var a = "<a href='javascript:;'>删除</a>";
                    return a;
                }
            }
        ]]
    };
    demo = $.table(option);
});
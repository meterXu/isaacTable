var userTicket = "fa12cad9122f4bf7905bcfa07afd3674";
var desKey = encMe('2', userTicket);
var demo;
var param = {
    RP: 5,
    Page: 1,
    UserId: desKey
};

var option = {
    checkBox: true,
    rowNumber: true,
    url: "http://www.isaacxu.com/Home/TableDemo",
    selectOnCheck: true,
    tableId: "#demo", //表的id
    param: param, //分页对象
    pageList: [10, 15, 20], //每页显示数据个数
    ajaxType: "get",
    ajaxDataType: "jsonp",
    toolbar: [{
        id: "add",
        icon: 'icon-plus',
        text: '添加',
        handler: function () {
            var index = layer.open({
                title: "添加数据",
                type: 1,
                closeBtn: 0,
                shift: 2,
                btn: ['确定', '取消'],
                shadeClose: true, //开启遮罩关闭
                skin: 'layui-layer-demo', //加上边框
                area: ['480px', '350px'], //宽高
                content: $("#addModel").html(),
                yes: function () {
                    $(".addModelForm").validationEngine({
                        "promptPosition": "centerRight"
                    });
                    if ($(".addModelForm").validationEngine("validate")) {
                        var data = "{" +
                            "\"Name\":\"" + $(".addModelForm:last #Name").val() + "\"," +
                            "\"Sex\":\"" + $(".addModelForm:last #Sex").val() + "\"," +
                            "\"Age\":\"" + $(".addModelForm:last #Age").val() + "\"," +
                            "\"Profession\":\"" + $(".addModelForm:last #Profession").val() + "\"," +
                            "\"Message\":\"" + $(".addModelForm:last #Message").val() + "\"" +
                            "}";
                        $.ajax({
                            url: "http://www.isaacxu.com/Home/AddTableDemo",
                            type: "get",
                            dataType: "jsonp",
                            data: {
                                UserId: desKey,
                                Query: data
                            },
                            success: function (res) {
                                if (res) {
                                    layer.close(index);
                                    layer.msg("添加成功");
                                }
                                else {
                                    layer.msg("添加失败");
                                }
                                demo.ReLoad();
                            }
                        })
                    }

                }
            });
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

                        delData(demo.getSelection().join(','));
                    }
                }
            }
        }
    ],
    column: [[
        { title: "ck", field: 'Id' },
        { title: '姓名', field: 'Name', width: "120px" },
        {
            title: "性别", field: "Sex", width: "60px", formatter: function (val) {
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
            title: "操作", field: "Id", width: "120px", formatter: function (val, n, data) {
                var a = "<a href='javascript:;' onclick='btnDelData(\"" + val + "\")'>删除</a>";
                return a;
            }
        }
    ]]
};
$(function () {
    option.tableHeader = $("#tabdiv").html();
    demo = $.table(option);
    $(".tab li").click(function () {
        var type = $(this).data("type");
        param.Query = "Type[Equal]&" + type;
        demo.ReLoad();
        $(".tab li").removeClass("selected");
        $(this).addClass("selected");
    })
});

function btnDelData(val) {
    if (confirm("你确定要删除这条数据吗？")) {
        delData(val)
    }
}

function delData(val) {
    $.ajax({
        url: "http://www.isaacxu.com/Home/DelTableDemo",
        type: "get",
        dataType: "jsonp",
        data: {
            UserId: desKey,
            Query: val
        },
        success: function (res) {
            if (res) {
                layer.msg("删除成功");
                demo.ReLoad();
            }
            else {
                layer.msg("删除失败");

            }

        }
    })
}
var userTicket = "fa12cad9122f4bf7905bcfa07afd3674";
var desKey = encMe('2', userTicket);
var demo;
$(function () {

    var option = {
        checkBox: true,
        rowNumber: true,
        url: "http://wwww.isaacxu.com/Home/IsaacTableData",
        selectOnCheck: true,
        tableId: "#demo", //表的id
        param: new DataGridParam(1, 5), //分页对象
        pageList: [5, 15, 20], //每页显示数据个数
        toolbar: [{
            id: "delete",
            icon: 'icon-trash',
            text: '删除',
            handler: function () {
                if (demo.getSelection().length <= 0) {
                    alert("请先选择需要删除的数据！");
                } else {
                    if (confirm('确认删除这' + demo.getSelection().length + '条数据吗？')) {
                        alert("删除成功");
                    }
                }
            }
        }],
        tableHeader: $("#tabdiv").html(),
        column: [[
            { title: "ck", field: 'Id' },
            { title: '姓名', field: 'Name', width: "135px" },
            {
                title: "性别", field: "Sex", formatter: function (val) {
                    switch (val) {
                        case 1:
                            return "<span style='color:green;font-weight:bold'>男</span>";
                        default:
                            return "<span style='color:red;font-weight:bold'>女</span>";
                    }
                }
            },
            { title: "年龄", field: "Age" },
            { title: "职业", field: "Profession" },
            {
                title: "留言", field: "Message", width: "135px", formatter: function (n, val, data) {
                    return "<input type='text' class='remarktext'/><input class='remarkbtn' type='button' value='确定'/>";
                }
            },
            {
                title: "操作", field: "id", formatter: function (val, n, data) {
                    var a = "<a href='javascript:alert(\"" + n + "\");'>更新</a>";
                    return a;
                }
            }
        ]]
    };
    demo = $.table(option);
});
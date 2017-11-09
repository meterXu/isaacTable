var userTicket = "6BDACD76-5650-4078-A9E6-2862865AC52C";
var desKey = encMe('1460', userTicket);
var demo;
function btnDelData(val)
{
    if(confirm("你确定要删除这条数据吗？"))
    {
        delData(val)
    }
}

function delData(val) {
    $.ajax({
        url: "http://120.76.73.57:8081/Home/DelTableDemo",
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

$(function () {
    var option = {
        checkBox: true,
        rowNumber: true,
        url: "http://120.76.73.57:8081/Home/TableDemo",
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
        toolbar: [
            {
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
                    // if (demo.getSelection().length <= 0) {
                    //     alert("请先选择需要删除的数据！");
                    // } else {
                    //     if (confirm('确认删除这' + demo.getSelection().length + '条数据吗？')) {
    
                    //         delData(demo.getSelection().join(','));
                    //     }
                    // }
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
            { title: "网络", field: "Type", width: "120px",formatter:function(val){
                switch(val){
                    case 1:{
                        return "电信";
                    }
                    case 2:{
                        return "移动";
                    }
                    case 3:{
                        return "联通";
                    }
                }
            } },
            { title: "留言", field: "Message" },
            {
                title: "操作", field: "Id", width: "120px", formatter: function (val, n, data) {
                    var a = "<a href='javascript:;' onclick='btnDelData(\"" + val + "\")'>删除</a>";
                    return a;
                }
            }
        ]]
    };
    demo = $.table(option);
    $(".tab li").click(function(){
        $(".tab li").removeClass("selected");
        $(this).addClass("selected");
        var index=$(this).index(".tab li");
        if(index==0){
            demo.Option.param.Query="";
        }else{
            demo.Option.param.Query="Type[Equal]&"+index;
        }
        demo.ReLoad();
    })
});
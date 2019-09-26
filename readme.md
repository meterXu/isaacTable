# isaacTable 
![license](https://img.shields.io/github/license/meterXu/isaacTable.svg)    
[在线示例](https://table.isaacxu.com) |
[帮助文档](https://table.isaacxu.com/demo/doc.html)

issacTable是一个web版表格控件，可以嵌入你的页面，动态展现你的数据，简单易用，基于jquery开发。

![issacTable](http://7u.isaacxu.com/table.jpg)

## 快速开始
```html
<!DOCTYPE html>
<html>  
    <head>  
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Static Template</title>
    <link href="https://table.isaacxu.com/src/css/isaac.table.css" rel="stylesheet" />  
    <script type="text/javascript" src="https://table.isaacxu.com/src/js/jquery-1.9.1.js"></script>  
    <script type="text/javascript" src="https://table.isaacxu.com/src/js/isaac.table.js"></script>  
    <script>  
        $(function(){  
            $("#table").isaacTable({
              columns: [[
                       { title: "序号", field: "id" },
                       { title: "小写", field: "scode" },
                       { title: "大写", field: "lcode" }
                     ]],
              data:{
                "total":3,
                "rows":[{id:1,scode:'a',lcode:'A'},
                {id:2,scode:'b',lcode:'B'},
                {id:3,scode:'c',lcode:'C'}]
                }
            });  
        })  
    </script>
    </head>  
    <body>
        <table id="table"></table>
    </body>  
</html>
```



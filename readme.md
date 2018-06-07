# isaacTable 

[在线示例](http://app.isaacxu.com/table) |
[帮助文档](http://app.isaacxu.com/table/demo/doc.html) |
[关于作者](http://app.isaacxu.com/job)

issacTable是一个web版表格控件，可以嵌入你的任何页面，动态展现你的任何数据，简单易用，基于jquery开发。

![issacTable](http://app.isaacxu.com:9091/table/Images/table.jpg)

## 安装
1.  从github上下载源码

    `git clone https://github.com/772413635/isaacTable.git`
2.  拷贝整个源代码到你的项目中
3.  在所需要的页面中添加引用

    `<html>`  
    `<head>`  
    `<link href="isaacTable/src/css/isaac.table.css" rel="stylesheet" />`  
    `<script type="text/javascript" src="isaacTable/src/js/jquery-1.9.1.js"></script>`  
    `<script type="text/javascript" src="isaacTable/src/js/isaac.table.js"></script>`  
    `</head>`  
    `<body></body>`  
    `</html>`
## 使用
1.  编写js脚本初始化表格

    `<script>`  
    `$(function(){`  
    `    ...`  
    `    $("#table").isaacTable(option);`  
    `})`  
    `</script>`


# isaacTable 
![license](https://img.shields.io/github/license/meterXu/isaacTable.svg)    
[在线示例](https://app.isaacxu.com/table) |
[帮助文档](https://app.isaacxu.com/table/demo/doc.html) |

issacTable是一个web版表格控件，可以嵌入你的页面，动态展现你的数据，简单易用，基于jquery开发。

![issacTable](https://app.isaacxu.com/table/demo/table.jpg)

## 安装
1.  从github上下载源码

    `git clone https://github.com/meterXu/isaacTable.git`
2.  拷贝整个源代码到你的项目中
3.  在所需要的页面中添加引用

    `<html>`  
    `<head>`  
    `<link href="isaactable/src/css/isaac.table.css" rel="stylesheet" />`  
    `<script type="text/javascript" src="isaactable/src/js/jquery-1.9.1.js"></script>`  
    `<script type="text/javascript" src="isaactable/src/js/isaac.table.js"></script>`  
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


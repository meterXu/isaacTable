//meter的表控件，纯手写
function GridData(option) {
    var _this = this;//保存作用域;
    if (option.tableId == null || option.tableId == "") {
        throw "未指定tableId";
    }
    //设置默认值
    var _option = {
        checkBox: true, //是否显示复选框
        rowNumber: true, //是否显示编号
        isFooter: true, //是否显示底部
        isPagination: true, //是否显示分页
        param: new DataGridParam(1, 5), //默认分页对象
        textAlign: 'left', //默认文字水平排列方式
        isCheckNull: true, //检查空值
        selectOnCheck: true, //选中数据同时选中复选框
        multipleSelect: true, //是否可以多个选择
        cellResize: true//是否可以拖动单元格
};
    //赋值
    _option.url = option.url;
    _option.column = option.column;
    _option.tableId = option.tableId;
    _option.toolbar = option.toolbar;
    _option.tdata = option.tdata;
    _option.pageList = option.pageList;
    _option.tableHeader = option.tableHeader;
    if (option.ajaxSuccess) {
        _option.ajaxSuccess = option.ajaxSuccess;
    }
    if (option.loadSuccess) {
        _option.loadSuccess = option.loadSuccess;
    }


    if (option.checkBox != null && option.checkBox == false) {
        _option.checkBox = option.checkBox;
    }
    if (option.rowNumber != null && option.rowNumber == false) {
        _option.rowNumber = option.rowNumber;
    }
    if (option.isFooter != null && option.isFooter == false) {
        _option.isFooter = option.isFooter;
    }
    if (option.isPagination != null && option.isPagination == false) {
        _option.isPagination = option.isPagination;
    }
    if (option.param != null) {
        _option.param = option.param;
    }
    if (option.textAlign != null) {
        _option.textAlign = option.textAlign;
    }
    if (option.isCheckNull != null) {
        _option.isCheckNull = option.isCheckNull;
    }
    if (option.multipleSelect != null && option.multipleSelect == false) {
        _option.multipleSelect = option.multipleSelect;
    }

    //Id复制
    var nojTableId = _option.tableId.replace("#", "");
    _option.foolerId = nojTableId + "_datafooter";
    _option.paginationId = nojTableId + "_dataPage";
    _option.selectionId = nojTableId + "_selection";
    _option.pageSelect = nojTableId + "_pageSelect";
    _option.baseToolbar = nojTableId + "_baseToolbar";
    //table加上底部
    $("#" + nojTableId + "_base_footer").remove();
    var selection = "<div id='" + _option.selectionId + "' class='isaac_page_left isaac_selection'></div>";
    $(_option.tableId).after(" <div id='" + nojTableId + "_base_footer' class='isaac_page'>" +
        "<div id='" + _option.foolerId + "'></div>" + selection +
        "<div class='isaac_pagination'>" +
        "<ul id='" + _option.paginationId + "' class='right'></ul>" +
        "</div></div>");

    //加载toolbar
    loadToolbar(_option.toolbar);
    loadTableHeader();

    this.Option = _option;
    //返回选中的值集合
    this.getSelection = function () {
        var selectValue = new Array();
        $(_option.tableId).find("input[name='isaac_chk']").each(function (i, n) {
            if (n.checked) {
                selectValue.push(n.value);
            }
        });
        return selectValue;
    };
    //加载数据，生成表，或者其他神马
    this.loadData = function () {
        if (_option.tdata != null) {
            $(_option.tableId).empty();
            $("#" + _option.foolerId).empty();
            $("#" + _option.paginationId).empty();
            $("#" + _option.selectionId).empty();
            if (_option.ajaxSuccess) {
                _option.ajaxSuccess(_option.tdata);
            } else {
                priveTable(_option.tdata);
            }

            loadPageList();
            if (_option.isFooter) {
                loadFooter(_option.tdata);
            }
            if (_option.isPagination) {
                loadPagination(_option.tdata);
            }
            if (_option.loadSuccess) {
                _option.loadSuccess(data);
            }
        } else {
            $.ajax({
                url: _option.url,
                type: 'post',
                dataType: 'json',
                data: _option.param,
                beforeSend: function () {
                    $("#" + _option.foolerId).html("<div class='loading'></div>");
                },
                success: function (data) {
                    _option.data = data;
                    $(_option.tableId).empty();
                    $("#" + _option.foolerId).empty();
                    $("#" + _option.paginationId).empty();
                    $("#" + _option.selectionId).empty();
                    if (_option.ajaxSuccess) {
                        _option.ajaxSuccess(data);
                    } else {
                        priveTable(data);
                    }
                    loadPageList();

                    if (_option.isFooter) {
                        loadFooter(data);
                    }
                    if (_option.isPagination) {
                        loadPagination(data);
                    }
                    if (_option.loadSuccess) {
                        _option.loadSuccess(data);
                    }
                }
            });
        }

    };
    //当前页刷新数据
    this.ReLoad = function () {
        this.loadData();
    };
    //加载第一页数据
    this.LoadFirst = function () {
        _option.param.Page = 1;
        this.loadData();
    };
    //加载某一页数据
    this.LoadDataPage = function (page) {
        _option.param.Page = page;
        this.loadData();
    };
    //生成表
    function priveTable(data) {
        //给table加上样式
        $(_option.tableId).addClass("isaac_table").attr("style", "width: 100%");
        var th = "";
        var tr = "";
        if (_option.rowNumber) {//是否显示编号
            th += "<th class='isaac_number'></th>";
        }
        if (_option.checkBox) {//是否显示复选框
            th += "<th style='width:15px;'><input type='checkbox' class='isaac_chk' id='" + nojTableId + "_chkAll' onclick='ChkAll(this)'/></th>";//添加单选框
        }
        for (var i = 1; i < _option.column[0].length; i++) {
            if (_option.column[0][i].width)
                th += "<th class='isaac_table_th' style='width:" + _option.column[0][i].width + "'><div class='isaac_table_cell'>" + _option.column[0][i].title + "</div></th>";//创建标题
            else {
                th += "<th class='isaac_table_th' ><div class='isaac_table_cell'>" + _option.column[0][i].title + "</div></th>";//创建标题
            }
        }
        for (var j = 0; j < data.Rows.length; j++) {
            var td = "";
            var numbert = parseInt((_option.param.Page - 1) * _option.param.RP + j);//数据编号,从0开始
            if (_option.rowNumber)
                td += "<td class='isaac_td_number'>" + (numbert + 1) + "</td>";
            if (_option.checkBox)
                td += "<td class='t_one'><input type='checkbox' class='isaac_chk' id=" + nojTableId + "_chk_" + j + " name='isaac_chk' value=\"" + data.Rows[j][_option.column[0][0].field] + "\"/></td>";
            for (var k = 1; k < _option.column[0].length; k++) {
                if (_option.column[0][k].formatter)
                    td += "<td>" + _option.column[0][k].formatter(data.Rows[j][_option.column[0][k].field], numbert, data.Rows[j]) + "</td>";
                else {
                    if (_option.isCheckNull) {
                        td += "<td>" + CheckNull(data.Rows[j][_option.column[0][k].field]) + "</td>";
                    } else {
                        td += "<td>" + data.Rows[j][_option.column[0][k].field] + "</td>";
                    }
                }
            }
            tr += "<tr>" + td + "</tr>";
        }
        $(_option.tableId).append("<thead><tr>" + th + "</tr></thead>" + tr);
        switch (_option.textAlign) {
            case "center":
                $(_option.tableId + " th:not(.t_one)," + _option.tableId + " td:not(.t_one)").css("text-align", 'center'); break;
            default:
                $(_option.tableId + " th:not(.t_one)," + _option.tableId + " td:not(.t_one)").css("text-align", 'left');
        }
        selectOnCheck();
        cellResize();
    }
    //加载底部信息栏
    function loadFooter(data) {
        //加载左下角
        $("#" + _option.foolerId).addClass("isaac_page_left");
        var one = (data.Total == 0) ? 0 : (_option.param.Page - 1) * _option.param.RP + 1;
        var two = _option.param.Page * _option.param.RP <= data.Total ? _option.param.Page * _option.param.RP : data.Total;
        $("#" + _option.foolerId).append("<div class='page-txt'>第" + one + "-" + two + "条  /  共" + data.Total + "条数据</div>");
    };

    //加载每页显示页数
    function loadPageList() {
        if (_option.pageList.length > 0) {
            var select = "<select id='" + _option.pageSelect + "' class='isaac_select_option'>";
            for (var i = 0; i < _option.pageList.length; i++) {
                select += "<option value='" + _option.pageList[i] + "'>每页" + _option.pageList[i] + "条</option>";
            }
            select += "</select>";
            $("#" + _option.selectionId).append(select);
            $("#" + _option.pageSelect).val(_option.param.RP);
        }
        $("#" + _option.selectionId).append("<div class='isaac_refresh' title='刷新'></div>");

        $("#" + _option.selectionId + " .refresh").click(function () {
            _this.ReLoad();
        });
        $("#" + _option.pageSelect).change(function () {
            _option.param.Page = 1;
            _option.param.RP = this.value;
            _this.ReLoad();
        });
    }
    //加载分页
    function loadPagination(data) {
        //加载页数
        var pages = 0;//总页数
        if (data.Total % _option.param.RP == 0) {//可整除
            pages = data.Total / _option.param.RP;
        } else {//不可整除
            pages = parseInt(data.Total / _option.param.RP) + 1;
        }
        var li = "";
        if (_option.param.Page > 1) {
            li += "<li><a>最前页</a></li><li><a>上一页</a></li>";
        }
        switch (pages) {
            case 0:
                li += ""; break;
            case 1:
                li += "<li><a>" + 1 + "</a></li>"; break;
            case 2:
                li += "<li><a>" + 1 + "</a></li>" + "<li><a>" + 2 + "</a></li>"; break;
            case 3:
                li += "<li><a>" + 1 + "</a></li>" + "<li><a>" + 2 + "</a></li>" + "<li><a>" + 3 + "</a></li>"; break;
            default:
                if (_option.param.Page <= 3) {
                    for (var n = 1; n <= (_option.param.Page + 3 > pages ? pages : _option.param.Page + 3) ; n++) {
                        if (n == _option.param.Page)
                            li += "<li class='isaac_pagination_active'><a>" + n + "</a></li>";
                        else
                            li += "<li><a>" + n + "</a></li>";
                    }
                } else {
                    for (var m = _option.param.Page - 3; m <= (_option.param.Page + 3 > pages ? pages : _option.param.Page + 3) ; m++) {
                        if (m == _option.param.Page)
                            li += "<li class='isaac_pagination_active'><a>" + m + "</a></li>";
                        else
                            li += "<li><a>" + m + "</a></li>";
                    }
                }
        }


        if (_option.param.Page < pages) {
            li += "<li><a>下一页</a></li><li><a>最末页</a></li>";
        }
        $("#" + _option.paginationId).append(li);
        $("#" + _option.paginationId + " li").each(function (l) {
            $(this).css("cursor", "pointer");
            $(this).click(function () {
                var gotoPage = 0;
                switch (this.innerHTML.toLowerCase().replace("<a>", "").replace("</a>", "")) {
                    case "最前页":
                        gotoPage = 1;
                        break;
                    case "上一页":
                        gotoPage = _option.param.Page - 1;
                        break;
                    case "最末页":
                        gotoPage = pages;
                        break;
                    case "下一页":
                        gotoPage = _option.param.Page + 1;
                        break;
                    default:
                        gotoPage = parseInt(this.innerHTML.toLowerCase().replace("<a>", "").replace("</a>"));
                }
                _this.LoadDataPage(gotoPage);

            });
        });
        $("#" + _option.paginationId + " li:first").addClass("isaac_li_first");
        $("#" + _option.paginationId + " li:last").addClass("isaac_li_last");
        $("#" + _option.paginationId + " li:contains(" + (_option.param.Page) + ")").addClass("isaac_pagination_active");
    };

    //加载表头
    function loadTableHeader() {
        if (_option.tableHeader != null) {

            $("#" + nojTableId + "_tableHeader").html(_option.tableHeader);
        }

    }

    //加载toolbar
    function loadToolbar(data) {
        $("#" + _option.baseToolbar).remove();
        $("#" + nojTableId + "_tableHeader").remove();
        if (data != null && data.length >= 1) {
            var toobar = "<div id='" + _option.baseToolbar + "' class='isaac_operate'>";
            for (var i = 0; i < data.length; i++) {
                toobar += " <a href='javascript:void(0);' id='" + _option.tableId + "_" + data[i].id + "' ><i class='icon " + data[i].icon + "'></i>" + data[i].text + "</a>";
            }
            toobar += "</div><div id=" + nojTableId + "_tableHeader></div>";
            $(_option.tableId).before(toobar);

            $(data).each(function (j, n) {
                $("a[id='" + _option.tableId + "_" + n.id + "']").click(function () {
                    n.handler();
                });
            });
        }
    }

    //选中数据同时选中复选框
    function selectOnCheck() {
        if (_option.selectOnCheck) {
            if (_option.checkBox) {
                if (_option.multipleSelect) {
                    $(_option.tableId + " tr").not($(_option.tableId + " tr:first")).each(function (i, n) {
                        $(n).find("td:not(.t_one)").click(function () {
                            var chk = $("#" + nojTableId + "_chk_" + i)[0];
                            if (chk.checked) {
                                chk.checked = false;
                            } else {
                                chk.checked = true;
                            }

                        });
                    });
                } else {
                    $(_option.tableId + " tr").not($(_option.tableId + " tr:first")).each(function (i, n) {
                        $(n).find("td:not(.t_one)").click(function () {
                            var chk = $("#" + nojTableId + "_chk_" + i)[0];
                            if (chk.checked) {
                                chk.checked = false;
                            } else {
                                chk.checked = true;
                            }
                            $(_option.tableId + " tr").not($(_option.tableId + " tr:first")).each(function (j, k) {
                                if (j != i) {
                                    var chk2 = $("#" + nojTableId + "_chk_" + j)[0];
                                    chk2.checked = false;
                                }

                            });

                        });
                    });
                }

            }
        }
    }

    //拖拉列宽
    function cellResize() {
        if (_option.cellResize) {
            var oldWidth = 0;
            var oldPointX = 0;
            var tdPaddingLeft=0;
            var tdBorderLeft=0;
            var isResize = false;
            $(_option.tableId + " .isaac_table_cell").mousemove(function (ev) {//单元格鼠标移动
                var e = ev;
                oldWidth = this.offsetWidth;
                if ((computePx(this) + oldWidth) - e.clientX <= 3&& (computePx(this) + oldWidth) > e.clientX) {
                    $(this).attr("style", "cursor:e-resize");
                    oldPointX = e.clientX;
                    isResize = true;
                    tdPaddingLeft=this.offsetLeft;
                    tdBorderLeft=this.offsetParent.clientLeft;
                } else {
                    $(this).removeAttr("style");
                    isResize = false;
                }

            });

            $(_option.tableId + " .isaac_table_cell").mousedown(function (ev) {//单元格鼠标按下
                if (isResize) {
                    var ft = this;
                    var width = $(_option.tableId)[0].offsetWidth;
                    var height = $(_option.tableId)[0].offsetHeight;
                    var top = computePy($(_option.tableId)[0]);
                    var left = computePx($(_option.tableId)[0]);
                    var div = "<div class='isaac_layout' style='width:" + width + "px;height:" + height + "px;top:" + top + "px;left:" + left + "px'>" +
                        "<div class='isaac_verticalLine' style='left:" + (oldPointX - left + 5) + "px'><div class='isaac_lineContent'>左右拖动</div></div></div>";
                    $(this).after(div);
                    $(".isaac_layout").mousemove(function (ev2) {
                        if (isResize) {
                            var e = ev2;
                            $(".isaac_verticalLine").css("left", (e.clientX - left));
                            var number = oldWidth -oldPointX +e.clientX - 2;

                            if (number < 30) {
                                number = "亲,列宽太小了["+(number+tdPaddingLeft+tdBorderLeft)+"]";
                                $(".isaac_lineContent").css("background-color", "#d60000");
                                $(".isaac_verticalLine").css("border-left-color", "#d60000");
                            }
                            else {
                                number = "宽度:" + (number+tdPaddingLeft+tdBorderLeft);
                                $(".isaac_lineContent").css("background-color", "#006dcc");
                                $(".isaac_verticalLine").css("border-left-color", "#006dcc");
                            }
                            $(".isaac_lineContent").text(number);
                        }

                    });
                    $(".isaac_layout").mouseup(function (ev2) {
                        var e = ev2;
                        isResize = false;
                        var number = oldWidth -oldPointX +e.clientX-2;
                        if (number < 30)
                            number = 29;
                        $(ft).parent().animate({ width: (number) }, 500);
                        $(_option.tableId).unbind("mousemove");

                        $(".isaac_layout").remove();
                    });
                }



            });
            $(_option.tableId + " .datagrid-cell").mouseup(function (ev) {//单元格鼠标弹起
                isResize = false;
            });
        }

    }
}


function computePx(dmo) {
    var x = dmo.offsetLeft;
    while (true) {
        if (dmo.offsetParent) {
            dmo = dmo.offsetParent;
            x += dmo.offsetLeft;
        } else {
            break;
        }
    }
    return x;
}
function computePy(dmo) {
    var x = dmo.offsetTop;
    while (true) {
        if (dmo.offsetParent) {
            dmo = dmo.offsetParent;
            x += dmo.offsetTop;
        } else {
            break;
        }
    }
    return x;
}

function DataGridParam(page, rp) {
    this.Query = null;
    this.Page = page;
    this.RP = rp;
}
//全选函数
function ChkAll(dmo) {
    if (dmo.checked == true) {
        $("input[name=isaac_chk]").each(function (i, n) {
            if (n.checked == false) {
                n.checked = true;
            }
        });
    } else {
        $("input[name=isaac_chk]").each(function (i, n) {
            if (n.checked == true) {
                n.checked = false;
            }
        });
    }

};

function CheckNull(value) {
    if (value == null || value == "underfind") {
        return "";
    } else {
        return value;
    }
}

$.table = function (options) {
    var table = new GridData(options);
    table.loadData();
    return table;
}
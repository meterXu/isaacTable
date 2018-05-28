/**
 * itable表格控件
 * 作者：Meter
 * 邮箱：xhgainxq@gmail.com
 * 说明：参考了miniUI，easyUI等成熟的UI框架以及结合工作这些年的经验，开发了这款简单实用的表格控件，不足之处请大家多多包涵，有问题可以github上Issues。
 */
(function ($) {
    /**
     * 初始化控件itable
     * @param options 初始化参数
     */
    $.fn.isaacTable = function (options) {
        var res = [];//返回表格对象
        //设置默认值
        var _options = {
            checkBox: true, //是否显示复选框
            rowNumber: true, //是否显示编号
            isFooter: true, //是否显示底部
            isPagination: true, //是否显示分页
            ajaxType: "post",//ajax请求类型
            ajaxDataType: "json",//返回数据类型
            pageList: [5, 10, 15, 20],//显示条数下拉框
            param: { page: 1, rp: 5 }, //默认分页对象
            textAlign: 'left', //默认文字水平排列方式
            isCheckNull: true, //检查空值
            selectOnCheck: true, //选中数据同时选中复选框
            multipleSelect: true, //是否可以多个选择
            cellResize: true//是否可以拖拉单元格
        };
        //赋值
        _options.url = _options.url || options.url;
        _options.columns = _options.columns || options.columns;
        _options.toolbar = _options.toolbar || options.toolbar;
        _options.ajaxType = _options.ajaxType || options.ajaxType;
        _options.ajaxDataType = _options.ajaxDataType || options.ajaxDataType;
        _options.data = _options.data || options.data;
        _options.pageList = _options.pageList || options.pageList;
        _options.tableHeader = _options.tableHeader || options.tableHeader;
        _options.ajaxSuccess = _options.ajaxSuccess || options.ajaxSuccess;
        _options.loadSuccess = _options.loadSuccess || options.loadSuccess;
        _options.param = _options.param || options.param;
        _options.textAlign = _options.textAlign || options.textAlign;
        if (options.checkBox != null && options.checkBox == false) {
            _options.checkBox = options.checkBox;
        }
        if (options.rowNumber != null && options.rowNumber == false) {
            _options.rowNumber = options.rowNumber;
        }
        if (options.isFooter != null && options.isFooter == false) {
            _options.isFooter = options.isFooter;
        }
        if (options.isPagination != null && options.isPagination == false) {
            _options.isPagination = options.isPagination;
        }
        if (options.isCheckNull != null && options.isCheckNull == false) {
            _options.isCheckNull = options.isCheckNull;
        }
        if (options.multipleSelect != null && options.multipleSelect == false) {
            _options.multipleSelect = options.multipleSelect;
        }
        this.each(function (i, d) {
            res.push(inititable(i, d, _options));
        });
        return res;
        //初始化itable
        function inititable(i, selector, options) {
            var _this=this;
            var tableKey = "isaacTable_",//表格标识
                baseToolbarKey = "baseToolbar_",//表格底部toolbar标识
                foolerInfoKey = "foolerInfo_",//表格底部toolbar内分页信息标识
                selectionKey = "selection_",//表格底部toolbar内下拉框标识
                refreshKey = "refresh_",//表格底部toolbar内刷新按钮标识
                paginationKey = "pagination_";//表格底部toolbar内分页标识
            //Id复制
            var nojTableId = tableKey + i;
            options.baseToolbarId = tableKey + baseToolbarKey + i;
            options.foolerInfoId = tableKey + foolerInfoKey + i;
            options.selectionId = tableKey + selectionKey + i;
            options.refreshId = tableKey + refreshKey + i;
            options.paginationId = tableKey + paginationKey + i;
            //table加上底部
            $("#"+options.baseToolbarId).remove();
            $(selector).after(
                "<div id='" + options.baseToolbarId + "' class='isaac_page'>" +
                "<div id='" + options.foolerInfoId + "'></div>" + 
                "<div id='" + options.selectionId + "' class='isaac_page_left isaac_selection'></div>"+
                "<div id='" + options.refreshId +"' class='isaac_refresh' title='刷新'></div>"+
                "<div id='" +options.paginationId+"' class='isaac_pagination'></div>" +
                "</div>");
            if ($(selector).width() > 0) {
                $("#"+baseToolbarId).outerWidth($(selector).width());
            }
            //加载toolbar
            loadToolbar(options.toolbar);
            loadTableHeader();
            loadData();
            this.options = options;
            //返回选中的值集合
            this.getSelection = function () {
                var selectValue = new Array();
                $(selector).find("input[name='isaac_chk']").each(function (i, n) {
                    if (n.checked) {
                        selectValue.push(n.value);
                    }
                });
                return selectValue;
            };
             //当前页刷新数据
            this.reLoad = function () {
                loadData();
            };
            //加载第一页数据
            this.LoadFirst = function () {
                options.param.page = 1;
                loadData();
            };
            //加载某一页数据
            this.LoadDataPage = function (page) {
                options.param.page = page;
                loadData();
            };
            //加载数据，生成表，或者其他神马
            function loadData() {
                if (options.data != null) {
                    $(selector).empty();
                    $("#" + options.foolerInfoId).empty();
                    $("#" + options.selectionId).empty();
                    $("#" + options.paginationId).empty();
                    if (options.ajaxSuccess) {
                        options.ajaxSuccess(options.data);
                    } else {
                        priveTable(options.data);
                    }

                    loadPageList();
                    if (options.isFooter) {
                        loadFooter(options.data);
                    }
                    if (options.isPagination) {
                        loadPagination(options.data);
                    }
                    if (options.loadSuccess) {
                        options.loadSuccess(options.data);
                    }
                } else {
                    $.ajax({
                        url: options.url,
                        type: options.ajaxType,
                        dataType: options.ajaxDataType,
                        data: options.param,
                        beforeSend: function () {
                            //给table加上样式
                            $(selector).addClass("isaac_table").attr("style", "width: 100%");
                            $(selector).html("<tr><td><div class='loadDiv'><div class='loading'></div> 正在加载......</div></td></tr>");
                        },
                        success: function (data) {
                            options.data = data;
                            $(selector).empty();
                            $("#" + options.foolerId).empty();
                            $("#" + options.paginationId).empty();
                            $("#" + options.selectionId).empty();
                            if (options.ajaxSuccess) {
                                options.ajaxSuccess(data);
                            } else {
                                priveTable(data);
                            }
                            if (options.isFooter) {
                                loadFooter(data);
                            }
                            loadPageList();
                            if (options.isPagination) {
                                loadPagination(data);
                            }
                            if (options.loadSuccess) {
                                options.loadSuccess(data);
                            }
                        }
                    });
                }

            };
            //生成表
            function priveTable(data) {
                var th = "";
                var tr = "";
                if (options.rowNumber) {//是否显示编号
                    th += "<th class='isaac_number'></th>";
                }
                if (options.checkBox) {//是否显示复选框
                    th += "<th style='width:15px;'><input type='checkbox' class='isaac_chk isaac_chk_all' id='" + nojTableId + "_chkAll'/></th>";//添加单选框
                }
                for (var i = 1; i < options.columns[0].length; i++) {
                    if (options.columns[0][i].width)
                        th += "<th class='isaac_table_th' style='width:" + options.columns[0][i].width + "'><div class='isaac_table_cell'>" + options.columns[0][i].title + "</div></th>";//创建标题
                    else {
                        th += "<th class='isaac_table_th' ><div class='isaac_table_cell'>" + options.columns[0][i].title + "</div></th>";//创建标题
                    }
                }
                for (var j = 0; j < data.rows.length; j++) {
                    var td = "";
                    var numbert = parseInt((options.param.page - 1) * options.param.rp + j);//数据编号,从0开始
                    if (options.rowNumber)
                        td += "<td class='isaac_td_number'>" + (numbert + 1) + "</td>";
                    if (options.checkBox)
                        td += "<td class='t_one'><input type='checkbox' class='isaac_chk' id=" + nojTableId + "_chk_" + j + " name='isaac_chk' value=\"" + data.rows[j][options.columns[0][0].field] + "\"/></td>";
                    for (var k = 1; k < options.columns[0].length; k++) {
                        if (options.columns[0][k].formatter)
                            td += "<td>" + options.columns[0][k].formatter(data.rows[j][options.columns[0][k].field], numbert, data.rows[j]) + "</td>";
                        else {
                            if (options.isCheckNull) {
                                td += "<td>" + checkNull(data.rows[j][options.columns[0][k].field]) + "</td>";
                            } else {
                                td += "<td>" + data.rows[j][options.columns[0][k].field] + "</td>";
                            }
                        }
                    }
                    tr += "<tr>" + td + "</tr>";
                }
                $(selector).addClass("isaac_table").append("<thead><tr>" + th + "</tr></thead>" + tr);
                switch (options.textAlign) {
                    case "center":
                        $(selector).find("th:not(.t_one),td:not(.t_one)").css("text-align", 'center');
                        break;
                    default:
                        $(selector).find("th:not(.t_one),td:not(.t_one)").css("text-align", 'left');
                        break;
                }
                initSelectOnCheck();
                initChkAll();
                initCellResize();
            }

            //加载底部信息栏
            function loadFooter(data) {
                //加载左下角
                $("#" + options.foolerInfoId).addClass("isaac_page_left");
                var one = (data.total == 0) ? 0 : (options.param.page - 1) * options.param.rp + 1;
                var two = options.param.page * options.param.rp <= data.total ? options.param.page * options.param.rp : data.total;
                $("#" + options.foolerInfoId).append("<div class='page-txt'>第" + one + "-" + two + "条  /  共" + data.total + "条数据</div>");
            };

            //加载每页显示页数
            function loadPageList() {
                if (options.pageList && options.pageList.length > 0) {
                    var select = "<select class='isaac_selection_select'>";
                    for (var i = 0; i < options.pageList.length; i++) {
                        if(options.pageList[i]==options.param.rp){
                            select += "<option value='" + options.pageList[i] + "' selected='selected'>每页" + options.pageList[i] + "条</option>";
                        }else{
                            select += "<option value='" + options.pageList[i] + "'>每页" + options.pageList[i] + "条</option>";
                        }
                       
                    }
                    select += "</select>";
                    $("#" +  options.selectionId).append(select);
                }
                $("#" + options.refreshId).click(function () {
                    _this.reLoad();
                });
                $("#" + options.pageSelectId).children("select").change(function () {
                    options.param.page = 1;
                    options.param.rp = this.value;
                    _this.reLoad();
                });
            }
            //加载分页
            function loadPagination(data) {
                //加载页数
                var pages = 0;//总页数
                if (data.total % options.param.rp == 0) {//可整除
                    pages = data.total / options.param.rp;
                } else {//不可整除
                    pages = parseInt(data.total / options.param.rp) + 1;
                }
                var li = "";
                if (options.param.page > 1) {
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
                        if (options.param.page <= 3) {
                            for (var n = 1; n <= (options.param.page + 3 > pages ? pages : options.param.page + 3); n++) {
                                if (n == options.param.page)
                                    li += "<li class='isaac_pagination_active'><a>" + n + "</a></li>";
                                else
                                    li += "<li><a>" + n + "</a></li>";
                            }
                        } else {
                            for (var m = options.param.page - 3; m <= (options.param.page + 3 > pages ? pages : options.param.page + 3); m++) {
                                if (m == options.param.page)
                                    li += "<li class='isaac_pagination_active'><a>" + m + "</a></li>";
                                else
                                    li += "<li><a>" + m + "</a></li>";
                            }
                        }
                }


                if (options.param.page < pages) {
                    li += "<li><a>下一页</a></li><li><a>最末页</a></li>";
                }
                $("#" + options.paginationId).append("<ul class='isaac_page_right'>"+li+"</ul>");
                $("#" + options.paginationId + " li").each(function (l) {
                    $(this).css("cursor", "pointer");
                    $(this).click(function () {
                        var gotoPage = 0;
                        switch (this.innerHTML.toLowerCase().replace("<a>", "").replace("</a>", "")) {
                            case "最前页":
                                gotoPage = 1;
                                break;
                            case "上一页":
                                gotoPage = options.param.page - 1;
                                break;
                            case "最末页":
                                gotoPage = pages;
                                break;
                            case "下一页":
                                gotoPage = options.param.page + 1;
                                break;
                            default:
                                gotoPage = parseInt(this.innerHTML.toLowerCase().replace("<a>", "").replace("</a>"));
                        }
                        _this.LoadDataPage(gotoPage);

                    });
                });
                $("#" + options.paginationId + " li:first").addClass("isaac_li_first");
                $("#" + options.paginationId + " li:last").addClass("isaac_li_last");
                $("#" + options.paginationId + " li:contains(" + (options.param.page) + ")").addClass("isaac_pagination_active");
            };

            //加载表头
            function loadTableHeader() {
                if (options.tableHeader != null) {

                    $("#" + nojTableId + "_tableHeader").html(options.tableHeader);
                }

            }

            //加载toolbar
            function loadToolbar(data) {
                if (data != null && data.length >= 1) {
                    var toobar = "<div id='" + options.baseToolbarId + "' class='isaac_operate'>";
                    for (var i = 0; i < data.length; i++) {
                        toobar += " <a href='javascript:void(0);' id='" + selector + "_" + data[i].id + "' ><i class='icon " + data[i].icon + "'></i>" + data[i].text + "</a>";
                    }
                    toobar += "</div><div id=" + nojTableId + "_tableHeader></div>";
                    $(selector).before(toobar);

                    $(data).each(function (j, n) {
                        $("a[id='" + selector + "_" + n.id + "']").click(function () {
                            n.handler();
                        });
                    });
                }
            }
            //初始化选中数据同时选中复选框功能
            function initSelectOnCheck() {
                if (options.selectOnCheck) {
                    if (options.checkBox) {
                        if (options.multipleSelect) {
                            $(selector).children("tbody").children("tr").each(function (i, n) {
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
                            $(selector).children("tbody").children("tr").each(function (i, n) {
                                $(n).find("td:not(.t_one)").click(function () {
                                    $(selector).find(".isaac_chk").prop("checked", false);
                                    var chk = $("#" + nojTableId + "_chk_" + i)[0];
                                    if (chk.checked) {
                                        chk.checked = false;
                                    } else {
                                        chk.checked = true;
                                    }

                                });
                            });
                        }

                    }
                }
            }
            //初始化全选功能
            function initChkAll() {
                $(selector).find(".isaac_chk_all").click(function () {
                    if (this.checked == true) {
                        $(selector).find(".isaac_chk").prop("checked", true);
                    } else {
                        $(selector).find(".isaac_chk").prop("checked", false);
                    }
                });


            };
            //初始化拖拉列宽
            function initCellResize() {
                if (options.cellResize) {
                    var oldWidth = 0;
                    var oldPointX = 0;
                    var tdPaddingLeft = 0;
                    var tdBorderLeft = 0;
                    var isResize = false;
                    $(selector).find(".isaac_table_cell").mousemove(function (ev) {//单元格鼠标移动
                        var e = ev;
                        oldWidth = this.offsetWidth;
                        if ((computePx(this) + oldWidth) - e.clientX <= 3 && (computePx(this) + oldWidth) > e.clientX) {
                            $(this).attr("style", "cursor:e-resize");
                            oldPointX = e.clientX;
                            isResize = true;
                            tdPaddingLeft = this.offsetLeft;
                            tdBorderLeft = this.offsetParent.clientLeft;
                        } else {
                            $(this).removeAttr("style");
                            isResize = false;
                        }

                    });
                    $(selector).find(".isaac_table_cell").mousedown(function (ev) {//单元格鼠标按下
                        if (isResize) {
                            var ft = this;
                            var width = $(selector)[0].offsetWidth;
                            var height = $(selector)[0].offsetHeight;
                            var top = computePy($(selector)[0]);
                            var left = computePx($(selector)[0]);
                            var div = "<div class='isaac_layout' style='width:" + width + "px;height:" + height + "px;top:" + top + "px;left:" + left + "px'>" +
                                "<div class='isaac_verticalLine' style='left:" + (oldPointX - left + 5) + "px'><div class='isaac_lineContent'>左右拖动</div></div></div>";
                            $(this).after(div);
                            $(".isaac_layout").mousemove(function (ev2) {
                                if (isResize) {
                                    var e = ev2;
                                    $(".isaac_verticalLine").css("left", (e.clientX - left));
                                    var number = oldWidth - oldPointX + e.clientX - 2;

                                    if (number < 30) {
                                        number = "亲,列宽太小了[" + (number + tdPaddingLeft + tdBorderLeft) + "]";
                                        $(".isaac_lineContent").css("background-color", "#d60000");
                                        $(".isaac_verticalLine").css("border-left-color", "#d60000");
                                    }
                                    else {
                                        number = "宽度:" + (number + tdPaddingLeft + tdBorderLeft);
                                        $(".isaac_lineContent").css("background-color", "#006dcc");
                                        $(".isaac_verticalLine").css("border-left-color", "#006dcc");
                                    }
                                    $(".isaac_lineContent").text(number);
                                }

                            });
                            $(".isaac_layout").mouseup(function (ev2) {
                                var e = ev2;
                                isResize = false;
                                var number = oldWidth - oldPointX + e.clientX - 2;
                                if (number < 30)
                                    number = 29;
                                $(ft).parent().animate({ width: (number) }, 500);
                                $(selector).unbind("mousemove");

                                $(".isaac_layout").remove();
                            });
                        }



                    });
                    $(selector).find(".datagrid-cell").mouseup(function (ev) {//单元格鼠标弹起
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

        function checkNull(value) {
            if (value == null || value == "underfind") {
                return "";
            } else {
                return value;
            }
        }
    }
})(jQuery);
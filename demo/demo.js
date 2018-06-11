var data,
attribute_option={
    checkBox:false,
    isPagination:false,
    multipleSelect:false,
    columns:[[                
        {title:"序号",field:"id"},
        {title:"属性名",field:"name"},
        {title:"类型",field:"type"},
        {title:"默认值",field:"default"},
        {title:"说明",field:"remark"}
    ]]
},
method_option={    
    checkBox:false,
    isPagination:false,
    multipleSelect:false,
    columns:[[                
        {title:"序号",field:"id"},
        {title:"方法名",field:"name"},
        {title:"方法参数",field:"param"},
        {title:"说明",field:"remark"}
    ]]},
event_option={    
    checkBox:false,
    isPagination:false,
    multipleSelect:false,
    columns:[[                
        {title:"序号",field:"id"},
        {title:"事件名",field:"name"},
        {title:"事件参数",field:"param"},
        {title:"说明",field:"remark"}
    ]]};
$(function(){
    $.getJSON("data.json", function(res){
        attribute_option.data=res.attribute;
        method_option.data=res.method;
        event_option.data=res.event;
        $("#attribute").isaacTable(attribute_option);
        $("#method").isaacTable(method_option);
        $("#event").isaacTable(event_option);
      });
   

});
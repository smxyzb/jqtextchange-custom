# jqtextchange-custom
jqtextchange 插件改装版，加入默认值处理函数以及自定义值处理等

通常我们需要在用户输入的时候限制用户输入的数值类型或者小数位数等，因此根据我项目需要修改了此插件，因本人技术有限，暂时做成这样子，后续会不断完善，欢迎拍砖

使用方法：
自动绑定请给对应input 加类名 jqtextchange

参数说明

data-type:数据类型  number interger float positive

data-decimal:保留几位小数

data-max:最大值 

data-min:最小值

data-func:自定义绑定处理函数，在没有默认处理函数的情况下才会触发

data-callback:处理完成后（已经将处理的值填入input）的回调函数

其他默认属性：maxlength

详见 jqtextchange.html

逐渐完善中....

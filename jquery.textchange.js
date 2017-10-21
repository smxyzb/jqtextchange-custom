(function (a) {
	a.event.special.textchange = {
		setup: function () {
			a(this).data("lastValue", this.contentEditable === "true" ? a(this).html() : a(this).val());
			a(this).bind("keyup.textchange", a.event.special.textchange.handler);
			a(this).bind("cut.textchange paste.textchange input.textchange", a.event.special.textchange.delayedHandler)
		}, teardown: function () {
			a(this).unbind(".textchange");
		}, handler: function () {
			a.event.special.textchange.triggerIfChanged(a(this))
		}, delayedHandler: function () {
			var c = a(this);
			setTimeout(function () {
				a.event.special.textchange.triggerIfChanged(c)
			}, 25);
		}, triggerIfChanged: function (a) {
			var b = a[0].contentEditable === "true" ? a.html() : a.val();
			b !== a.data("lastValue") && (a.trigger("textchange", [a.data("lastValue")]), a.data("lastValue", b))
		}
	};
	a.event.special.hastext = {
		setup: function () {
			a(this).bind("textchange", a.event.special.hastext.handler);
		}, teardown: function () {
			a(this).unbind("textchange", a.event.special.hastext.handler);
		}, handler: function (c, b) {
			b === "" && b !== a(this).val() && a(this).trigger("hastext");
		}
	};
	a.event.special.notext = {
		setup: function () {
			a(this).bind("textchange",a.event.special.notext.handler);
		}, teardown: function () {
			a(this).unbind("textchange", a.event.special.notext.handler);
		}, handler: function (c, b) {
			a(this).val() === "" && a(this).val() !== b && a(this).trigger("notext");
		}
	}

	var reg = {
		dom:a(".jqtextchange"),
		regexp:{
			"interger":{
				"regex":/^[0-9]*[1-9][0-9]*$/,//整数
			},
			"positive":{
				"regex":/^[1-9]*[1-9][0-9]*$/,//正整数
			},
			"float":{
				"regex":/^\d+\.\d+$/,
			},
			"integer":{
				"regex":/^[\-\+]?\d+$/,
			},
			"number":{
                "regex":/^\d+(?=\.{0,1}\d+$|$)/,// /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
            },
           
        },
        deal:{
        	"interger":function(obj,data,len,min,max){
        		if(data==""){
					return data;
				}
				if(data.split("")[0]==0){
					data = data.substr(1,data.length-1);
				}
				var newData = data.substr(0,len);
				if(len)
					newData = data.replace(/[^0-9.]+/g,'').replace(/[.]+/g,'');
				if(min || max){
					if(newData <= Number(min))
						newData = min==0?(newData==0?0:newData):min
					if(newData >  Number(max))
						newData = max
				}
				console.log(newData)
				return newData;
        	},
        	"positive":function(obj,data,len){
        		if(data.charAt(0) === '0'){
        			data = data.substr(1);
        		}
        		data = data.replace(/[^0-9.]+/g,'').replace(/[.]+/g,'');
        		return len ? data.substr(0,len):data;
        	},
        	"float":function(obj,data,opt){
        		var dt = $(obj).attr("data-type");
        		if(opt){
        			var len = $(obj).attr("data-decimal");
        			if(len!=undefined && len!=0){
        				if(data.indexOf(".")>-1){
        					if(data.split(".")[1].length>1){
        						data = data.replace(/\.{2,}/g,".");//只允许一个小数点
        						data = data.substring(0,data.indexOf('.') + 3);
        					}
        				}
        				return Number(data).toFixed(len);
        			}
        		}
        		return data.replace(/[^0-9.]+/g,'').replace(/[.]+/g,'');
        	},
        	"number":function(obj,data,opt){
        		var dt = $(obj).attr("data-type");
        		var decimal = $(obj).attr("data-decimal");
        		data = data.replace(/[^\d.-]/g,'');
        		data = reg.formatter(data,decimal);
        		return data;
        	},
        },
        formatter:function(data,decimal){
        	var dpos = data.indexOf(".");
        	var s1,s2,point="";
        	if(dpos>=0){
        		s1 = data.substring(0,dpos+1);
        		s2 = data.substring(dpos+1,data.length);
        		if(s2){
        			var dpos2 = data.indexOf(".");
        			if(dpos2>-1){
        				s2 = s2.replace(".","");
        			}
        			if(decimal>0 && s2.length >0){
        				s2 = s2.substr(0,Number(decimal));
        			}
        			return s1+s2;
        		}else{
        			return s1;
        		}
        	}else{
        		return data;
        	}
        }
    }

    function init(){
    	//console.log(reg.dom)
    	reg.dom.each(function(){
    		a(this).off();
    		var dt = a(this).attr("data-type");
    		a(this).on("textchange",function(){
    			var e = window.event,
    			decimal = a(this).attr("data-decimal"),
    			callback = a(this).attr("data-callback"),
    			len = a(this).attr("maxlength"),
    			max = a(this).attr("data-max"),
    			min = !a(this).attr("data-min")?0:a(this).attr("data-min");
    			if(typeof(e)){
    				if(e && e.type=="keyup"){
    					return;
    				}
    			}
    			var exp = reg.regexp[dt].regex;
    			var deal = reg.deal[dt];
    			var val = a(this).val();
    			if(val=="") return;
    			if(deal){//默认处理函数
    				var d = deal(this,val,len,min,max);
    				a(this).val(d);
    				//填入内容后的回调函数
    				if (callback){
    					eval(''+callback+''); 
    				}
    			}else{//自定义绑定函数
    				var func = a(this).attr("data-func");
    				if(exp.test(val) && func){
    					eval(''+func+'()'); 
    				}
    			}
    		})

    		if(dt=="number"){
    			var decimal = parseInt(a(this).attr("data-decimal")),max = a(this).attr("data-max"),min = a(this).attr("data-min");
    			if(!decimal)return;
    			var power = Math.pow(10,decimal);
    			a(this).on("blur",function(){
    				var val = a(this).val();
	    			if(val=="") return;
	    			val = Number(val);
    				val = val<min || val==""?min:val>max?max:val;
    				val = parseInt(accMul(val,power));
    				a(this).val(accDiv(val,power));
    			})
    		}
    	})
    }

    /* 乘法精确计算 */
	function accMul(arg1, arg2) {
		var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {
		}
		try {
			m += s2.split(".")[1].length
		} catch (e) {
		}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	}

    /* 除法精确计算 */
	function accDiv(arg1, arg2) {
		var t1 = 0, t2 = 0, r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length
		} catch (e) {
		}
		try {
			t2 = arg2.toString().split(".")[1].length
		} catch (e) {
		}
		with (Math) {
			r1 = Number(arg1.toString().replace(".", ""))
			r2 = Number(arg2.toString().replace(".", ""))
			return (r1 / r2) * pow(10, t2 - t1);
		}
	}

    setTimeout(function(){init()},200);
    window.textChangeInit = init;
})(jQuery);

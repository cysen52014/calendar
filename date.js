/* 
 * 日期插件
 * 滑动选取日期（年，月，日）
 * V1.1
 */
(function ($) {      
    $.fn.date = function (options,Ycallback,Ncallback) {   
        //插件默认选项
        var that = $(this);
        var docType = $(this).is('input');
        var datetime = false;
        var nowdate = new Date();
        var indexY=1,indexM=1,indexD=1;
        var indexH=1,indexI=1,indexS=0;
        var initY=parseInt((nowdate.getYear()+"").substr(1,2));
        var initM=parseInt(nowdate.getMonth()+"")+1;
        var initD=parseInt(nowdate.getDate()+"");
        var initH=parseInt(nowdate.getHours());
        var initI=parseInt(nowdate.getMinutes());
        var initS=parseInt(nowdate.getYear());
        var yearScroll=null,monthScroll=null,dayScroll=null;
        var HourScroll=null,MinuteScroll=null,SecondScroll=null;
		
        $.fn.date.defaultOptions = {
            beginyear:2000,                 //日期--年--份开始
            endyear:2020,                   //日期--年--份结束
            beginmonth:1,                   //日期--月--份结束
            endmonth:12,                    //日期--月--份结束
            beginday:1,                     //日期--日--份结束
            endday:31,                      //日期--日--份结束
            beginhour:0,
            endhour:23,
            beginminute:00,
            endminute:59,
            curdate:false,                   //打开日期是否定位到当前日期
            theme:"date",                    //控件样式（1：日期，2：日期+时间）
            mode:null,                       //操作模式（滑动模式）
            event:"click",                    //打开日期插件默认方式为点击后后弹出日期 
            show:true
        }
        //用户选项覆盖插件默认选项   
        var opts = $.extend( true, {}, $.fn.date.defaultOptions, options );
		var beginyear = opts.beginyear,endyear = opts.endyear,endmonth = opts.endmonth,beginmonth = opts.beginmonth,endday = opts.endday,beginday = opts.beginday,beginhour = opts.beginhour,beginminute = opts.beginminute,endminute = opts.endminute;
        if(opts.theme === "datetime"){datetime = true;}
        if(!opts.show){
            that.unbind('click');
        }
        else{
            //绑定事件（默认事件为获取焦点）
            that.unbind(opts.event).bind(opts.event,function () {
                createUL();      //动态生成控件显示的日期
                init_iScrll();   //初始化iscrll
                extendOptions(); //显示控件
                that.blur();
                if(datetime){
                    showdatetime();
                    refreshTime();
                }
                refreshDate();
                bindButton();
            })  
        };
        function refreshDate(){
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();

            if(opts.curdate){
				yearScroll.scrollTo(0, initY*40, 100, true);
				monthScroll.scrollTo(0, initM*40-40, 100, true);
				dayScroll.scrollTo(0, initD*40-40, 100, true); 
		   }
			
        }
        function refreshTime(){
			resetInitDete();
            HourScroll.refresh();
            MinuteScroll.refresh();
            SecondScroll.refresh();

            /*if(initH>12){    //判断当前时间是上午还是下午
                 SecondScroll.scrollTo(0, initD*40-40, 100, true);   //显示“下午”
                 initH=initH-12-1;
            }*/
			//initH=parseInt(nowdate.getHours());
			/*SecondScroll.scrollTo(0, initD*40-40, 100, true);
            HourScroll.scrollTo(0, initH*40, 100, true);
            MinuteScroll.scrollTo(0, initI*40, 100, true);   */
            
        }
	    function resetIndex(){
            indexY=1;
            indexM=1;
            indexD=1;
            indexH=1;
            indexI=1;
        }
        function resetInitDete(){
            if(opts.curdate){return false;}
            initY = 1;
            initM = 1;
            initD = 1;
			initH = 1;
            initI=1;

        }
        function bindButton(){
            resetIndex(); 
            $("#dateconfirm").unbind('click').click(function () {	
                var datestr = $("#yearwrapper ul li:eq("+indexY+")").html().substr(0,$("#yearwrapper ul li:eq("+indexY+")").html().length-1)+"-"+
                          $("#monthwrapper ul li:eq("+indexM+")").html().substr(0,$("#monthwrapper ul li:eq("+indexM+")").html().length-1)+"-"+
			  $("#daywrapper ul li:eq("+Math.round(indexD)+")").html().substr(0,$("#daywrapper ul li:eq("+Math.round(indexD)+")").html().length-1);
               if(datetime){ 
                   var hour = parseInt($("#Hourwrapper ul li:eq("+indexH+")").html())<10 ? '0'+ parseInt($("#Hourwrapper ul li:eq("+indexH+")").html()) : parseInt($("#Hourwrapper ul li:eq("+indexH+")").html());
                   var mins = parseInt($("#Minutewrapper ul li:eq("+indexI+")").html())<10?'0'+parseInt($("#Minutewrapper ul li:eq("+indexI+")").html()):parseInt($("#Minutewrapper ul li:eq("+indexI+")").html());
				   $("#Hourwrapper ul li:eq("+indexH+")").html(hour);
                     datestr+=" "+hour+":"+ mins;
                }

                if(Ycallback===undefined){  
                     if(docType){that.val(datestr);}else{that.html(datestr);}
                }else{
                                    Ycallback(datestr);
                }
                $("#datePage").hide(); 
                $("#dateshadow").hide();
            });
            $("#datecancle").click(function () {
                $("#datePage").hide(); 
		        $("#dateshadow").hide();
                Ncallback(false);
            });
        }		
        function extendOptions(){
            $("#datePage").show(); 
            $("#dateshadow").show();

        }
        //日期滑动
        function init_iScrll() {
            var strY = nowdate.getYear();
            var strM = nowdate.getMonth()+1;
		    
            yearScroll = new iScroll("yearwrapper",{snap:"li",vScrollbar:false,
			      onRefresh : function(){
				     this.y = 0;
				  },
                  onScrollEnd:function () { 
                       indexY = (this.y/40)*(-1)+1;
                       var y = parseInt($('#yearwrapper ul li').eq(indexY).text());
	                   var td = isTDate();
					   var hh = parseInt($('#Hourwrapper ul li').eq(indexH).text());

					   if(beginyear == y){
						  opts.beginmonth = beginmonth;
						  opts.endmonth = endmonth;
						  opts.beginday = beginday;
						  opts.endday = checkdays(strY,strM);
						  opts.beginhour = beginhour;
					   }else{ 
						  opts.beginmonth = 1;
					      opts.endmonth = endmonth;
						  opts.beginday = 1;
						  opts.endday = endday;
						  opts.beginhour = 10;
					   }
					  //  if(td){
							// if(hh==22){
							//    opts.beginminute = 0;
							//    opts.endminute = 0;
							// }else{
							//    opts.beginminute = 0;
							//    opts.endminute = 59;
							// }
					  //   }else{
							// opts.beginminute = 0;
							// opts.endminute = 59;
					  //  }
					   if(!opts.curdate){
						   $("#monthwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createMONTH_UL());
						   $("#daywrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createDAY_UL());
						   $("#Hourwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createHOURS_UL());
						   //$("#Minutewrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createMINUTE_UL());
					   }
					   dayScroll.refresh();
					   HourScroll.refresh();
					   //MinuteScroll.refresh();
                  }
              });
              monthScroll = new iScroll("monthwrapper",{snap:"li",vScrollbar:false,
			      onRefresh : function(){
				     this.y = 0;
				  },
                  onScrollEnd:function (){ 
				      indexM = (this.y/40)*(-1)+1;
                      var m = parseInt($('#monthwrapper ul li').eq(indexM).text());
					  var hh = parseInt($('#Hourwrapper ul li').eq(indexH).text());
					  var td = isTDate();
                      
                      if(beginmonth == m){
						  opts.beginday = beginday;
						  opts.endday = checkdays(strY,strM);
						  opts.beginhour = beginhour;
					   }else{ 
						  opts.beginday = 1;
						  opts.endday = endday;
						  opts.beginhour = 10;
					   }
					 //   if(td){
						// 	if(hh==22){
						// 	   opts.beginminute = 0;
						// 	   opts.endminute = 0;
						// 	}else{
						// 	   opts.beginminute = 0;
						// 	   opts.endminute = 59;
						// 	}
						// }else{
						// 	opts.beginminute = 0;
						// 	opts.endminute = 59;
					 //   }
					   
					   //setHour();
			           if(!opts.curdate){
						   $("#daywrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createDAY_UL());
						   $("#Hourwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createHOURS_UL());
						   //$("#Minutewrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createMINUTE_UL());
					   }
					   dayScroll.refresh();
					   HourScroll.refresh();
					   //MinuteScroll.refresh();
                  }
              });
              dayScroll = new iScroll("daywrapper",{snap:"li",vScrollbar:false,
			      onRefresh : function(){
				     this.y = 0;
				  },
                  onScrollEnd:function () { 
                       indexD = (this.y/40)*(-1)+1;
                       var d = parseInt($('#daywrapper ul li').eq(indexD).text());
					   var hh = parseInt($('#Hourwrapper ul li').eq(indexH).text());
					   var td = isTDate();
					   if(beginday == d){
						  opts.beginhour = beginhour;
					   }else{ 
						  opts.beginhour = 10;
					   } 
					   
					   if(td){
					      opts.beginhour = beginhour;
						  // if(hh==22){
						  //    opts.beginminute = 0;
						  //    opts.endminute = 0;
						  // }else{
						  //    opts.beginminute = 0;
						  //    opts.endminute = 59;
						  // }
					   }else{
					      opts.beginhour = 10;
						  // opts.beginminute = 0;
						  // opts.endminute = 59;
					   }
					   if(!opts.curdate){
						  //setHour();
					      $("#Hourwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createHOURS_UL());
						  //$("#Minutewrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createMINUTE_UL());
					   }
					   HourScroll.refresh();
					   //MinuteScroll.refresh();
                  }
			   });
			   
        }
		function isTDate(){
			var hh = parseInt($('#Hourwrapper ul li').eq(indexH).text());
			var hy = parseInt($('#yearwrapper ul li').eq(indexY).text());
			var hm = parseInt($('#monthwrapper ul li').eq(indexM).text());
			var hd = parseInt($('#daywrapper ul li').eq(indexD).text());
			var bh = opts.beginhour;
			var c;
			if(hy==beginyear&&hm==beginmonth&&hd==beginday){
				c = true;
			}else{
				c = false;
			}
			return c;
	    }
        function showdatetime(){
            
            $("#datescroll_datetime").show(); 
            $("#Hourwrapper ul").html(createHOURS_UL());
            $("#Minutewrapper ul").html(createMINUTE_UL());
            init_iScroll_datetime();
            addTimeStyle();
            //$("#Secondwrapper ul").html(createSECOND_UL());
        }

        //日期+时间滑动
        function init_iScroll_datetime(){
            HourScroll = new iScroll("Hourwrapper",{snap:"li",vScrollbar:false,
			    onRefresh : function(){
				    this.y = 0;
			    },
                onScrollEnd:function () { 
                    indexH = Math.round((this.y/40)*(-1))+1;
					var hh = parseInt($('#Hourwrapper ul li').eq(indexH).text());
					var tday = isTDate(); 
					if(tday){
						if(hh==22){
						   opts.beginminute = 0;
						   opts.endminute = 0;
						}else{
						   opts.beginminute = 0;
						   opts.endminute = 59;
						}
					}else{
					    opts.beginminute = 0;
						opts.endminute = 59;
					}
					//$("#Minutewrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createMINUTE_UL());
                    //HourScroll.refresh();
					//MinuteScroll.refresh();
                }
            })
            MinuteScroll = new iScroll("Minutewrapper",{snap:"li",vScrollbar:false,
			    onRefresh : function(){
				     this.y = 0;
				},
                onScrollEnd:function () {
                    indexI = Math.round((this.y/40)*(-1))+1;
                    HourScroll.refresh();
                }
            })
            SecondScroll = new iScroll("Secondwrapper",{snap:"li",vScrollbar:false,
			    onRefresh : function(){
				     this.y = 0;
				},
                onScrollEnd:function () {
                    indexS = Math.round((this.y/40)*(-1));
                    HourScroll.refresh();
                }
            });

        } 
        function checkdays (year,month){
            var new_year = year;    //取当前的年份        
            var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）        
            if(month>12)            //如果当前大于12月，则年份转到下一年        
            {        
                new_month -=12;        //月份减        
                new_year++;            //年份增        
            }        
            var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天        
            return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期    
        }
        function  createUL(){
            CreateDateUI();
            opts.beginyear = beginyear;
            opts.endyear = endyear;
            opts.beginmonth = beginmonth;
            opts.endmonth = endmonth;
            opts.beginday = beginday;
            opts.endday = endday;
            opts.beginminute = beginminute;
            opts.endminute = endminute;
            //opts.beginhour = beginday;
            $("#yearwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createYEAR_UL());
            $("#monthwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createMONTH_UL());
            $("#daywrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createDAY_UL());
            $("#Hourwrapper ul").css({'transform': 'translate3d(0px, 0, 0px)'}).html(createHOURS_UL());
            //$("#yearwrapper ul").html(createYEAR_UL());
            //$("#monthwrapper ul").html(createMONTH_UL());
            //$("#daywrapper ul").html(createDAY_UL());			
        }
        function CreateDateUI(){
            var str = ''+
                '<div id="dateshadow"></div>'+
                '<div id="datePage" class="page">'+
                    '<section>'+
                        '<div id="datetitle"><h1>请选择日期</h1></div>'+
                        '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>'+
                        '<div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>'+
                        '<div id="datescroll">'+
                            '<div id="yearwrapper">'+
                                '<ul></ul>'+
                            '</div>'+
                            '<div id="monthwrapper">'+
                                '<ul></ul>'+
                            '</div>'+
                            '<div id="daywrapper">'+
                                '<ul></ul>'+
                            '</div>'+
                        '</div>'+
                        '<div id="datescroll_datetime">'+
                            '<div id="Hourwrapper">'+
                                '<ul></ul>'+
                            '</div>'+
                            '<div id="Minutewrapper">'+
                                '<ul></ul>'+
                            '</div>'+
                            '<div id="Secondwrapper">'+
                                '<ul></ul>'+
                            '</div>'+
                        '</div>'+
                    '</section>'+
                    '<footer id="dateFooter">'+
                        '<div id="setcancle">'+
                            '<ul>'+
                                '<li id="dateconfirm">确定</li>'+
                                '<li id="datecancle">取消</li>'+
                            '</ul>'+
                        '</div>'+
                    '</footer>'+
                '</div>'
            $("#datePlugin").html(str);
        }
        function addTimeStyle(){
            $("#datePage").css("height","380px");
            // $("#datePage").css("top","60px");
            $("#yearwrapper").css("position","absolute");
            $("#yearwrapper").css("bottom","200px");
            $("#monthwrapper").css("position","absolute");
            $("#monthwrapper").css("bottom","200px");
            $("#daywrapper").css("position","absolute");
            $("#daywrapper").css("bottom","200px");
        }
        //创建 --年-- 列表
        function createYEAR_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginyear; i<=opts.endyear;i++){
                str+='<li>'+i+'年</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --月-- 列表
        function createMONTH_UL(){
            var str="<li>&nbsp;</li>"; 
			if(opts.endmonth<opts.beginmonth){
		        for(var i=0;i<=opts.endmonth;i++){
					if(i==0){
						i=12;
					}else{
					    i=1;
					}
					str+='<li>'+i+'月</li>'
				}
			}else{
				for(var i=opts.beginmonth;i<=opts.endmonth;i++){
					if(i<10){
						i="0"+i
					}
					str+='<li>'+i+'月</li>'
				}
			}
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --日-- 列表
        function createDAY_UL(){ 
            //$("#daywrapper ul").html(""); 
			var strY = nowdate.getFullYear();
            var strM = nowdate.getMonth()+1;
			var dd = checkdays(strY,strM);
            var str="<li>&nbsp;</li>"; 
			if(opts.endday<opts.beginday){
			    for(var i=opts.beginday;i<=dd;i++){
					str+='<li>'+i+'日</li>'
				}
			}else{
				for(var i=opts.beginday;i<=opts.endday;i++){
					str+='<li>'+(i<10?'0'+i:i)+'日</li>'
				}
			}
            return str+"<li>&nbsp;</li>";                   
        }
        //创建 --时-- 列表
        function createHOURS_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginhour;i<=opts.endhour;i++){
                str+='<li>'+(i<10?'0'+i:i)+'时</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --分-- 列表
        function createMINUTE_UL(){ 
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginminute;i<=opts.endminute;i++){
                if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'分</li>'
            }
            return str+"<li>&nbsp;</li>";
        }
        //创建 --分-- 列表
        function createSECOND_UL(){
            var str="<li>&nbsp;</li>";
            str+="<li>上午</li><li>下午</li>"
            return str+"<li>&nbsp;</li>";;
        }
    }
})(jQuery);  

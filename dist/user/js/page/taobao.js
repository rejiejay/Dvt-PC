/**
 * 个人中心
 * 初始化
 * 渲染所有订单
 */
var allTaobaoList = [];
var _clientWidth = 1170;
function taobao() {
  // 初始化
  (function () {
    ajaxGetData();
    // 初始化侧边栏
    _clientWidth = document.body.clientWidth;
    if (_clientWidth < 500) {
      $(".Sidebar").css("right","-"+(_clientWidth+10)+"px");
      $(".Sidebar").css("width",(_clientWidth+10)+"px");
    }
    $("#closeSidebar").click(function(){
      if (_clientWidth < 500) {
        $(".Sidebar").animate({right:"-"+(_clientWidth+10)+"px"},70);
      }else{
        $(".Sidebar").animate({right:'-330px'},70);
      }
    })
    // 遇到问题
    $("#meetTrouble").click(function(){
      $(".Sidebar").animate({right:'0'},70);
    });
    $(".meetTrouble").click(function(){
      $(".Sidebar").animate({right:'0'},70);
    });
  })();
  // 获取数据
  function ajaxGetData() {
    $.ajax({
      type: "GET", 
      url: URLbase+URLversion+"/gather/link/listOrder.do", 
      contentType: "application/json; charset=utf-8", 
      headers: {
        'token':$.cookie('token'),
        'digest':$.cookie('digest')
      },
      success: function (val) {
        if (isTaobaoTimeout === false) {
          isTaobaoTimeout = true;
          mySetInterval();
        }
        if (val.result == "0") {
          allTaobaoList = val.data;
          Rendering();
        }else {
          alert("获取订单失败,原因:"+val.message);
        }
      }
    });
  }

	function mySetInterval() {
		this.setInterval(function(){
			ajaxGetData();
		},5000);
	}

  // 渲染所有订单
  function Rendering() {
    if (allTaobaoList.length == 0) {
      return
    }
    // 渲染UI
    var item = "";
    for (var i = 0; i < allTaobaoList.length; i++) {
      var taobaoItemHTML = [
        '<div class="List-item">',
          '<div class="item-title">',
            '订单号:<span>'+allTaobaoList[i].orderSn+'</span>状态:<span>'+paystatus(allTaobaoList[i].payStatus)+'</span>',
          '</div>',
          '<div class="item-content">',
            '<div class="content1">',
              '<div>'+allTaobaoList[i].orderName+'</div>',
              '<div class="orderDesc">'+allTaobaoList[i].orderDesc+'</div>',
              '<div class="minor">'+dateToFormat(allTaobaoList[i].checkIn)+'到'+dateToFormat(allTaobaoList[i].checkOut)+'</div>',
              '<div class="minor">'+allTaobaoList[i].roomNum+'间房/'+allTaobaoList[i].adultNum+'成人/'+allTaobaoList[i].childNum+'儿童</div>',
              '<div class="minor">'+templateToString(allTaobaoList[i].template)+'</div>',
            '</div>',
            '<div class="content2">',
              amountstatus(allTaobaoList[i].payStatus,allTaobaoList[i].payAmount,allTaobaoList[i].notPayAmount),
              '<div class="minor">产品总金额:<span>'+allTaobaoList[i].productAmount+'</span>RMB</div>',
              '<div class="minor">优惠金额:<span>'+allTaobaoList[i].discount+'</span>RMB</div>',
              '<div class="minor">订单总金额:<span>'+allTaobaoList[i].orderAmount+'</span>RMB</div>',
            '</div>',
            '<div class="content3">',
              information(allTaobaoList[i].infoId,allTaobaoList[i].isConfirmed,i),
            '</div>',
          '</div>',
          '<div class="line"></div>',
        '</div>'
      ].join('');
      item += taobaoItemHTML;
    }
    $("#Render-item").html(item);

    // 绑定事件
    var supplementNum = 0;
    for (var j = 0; j < allTaobaoList.length; j++) {
      // 判断绑定什么事件
      if (allTaobaoList[j].infoId == null) {
        supplementNum++;
        // 第一次 填写信息收集
        $("#supplement"+j).click(function(event){
          var i = event.target.getAttribute("data-id");
          localStorage.setItem('_token',$.cookie('token'));
          localStorage.setItem('_digest',$.cookie('digest'));
          localStorage.setItem('_uniqueKey',allTaobaoList[i].uniqueKey);
          localStorage.setItem('loginSuccessful',JSON.stringify(allTaobaoList[i]));
          if (_clientWidth < 768) {
            window.open("./../info/mobile/index.html");
          }else {
            window.open("./../info/gather.html");
          }
          $("#pop-up").click(function(event) {
            if (_clientWidth < 768) {// 手机端
              window.open("./../info/mobile/index.html");
              location = "./../info/mobile/index.html";
            }else {
              window.open("./../info/gather.html");
              location = "./../info/gather.html";
            }
          });
          // $('#taobaoModal').modal({backdrop:'static'});
        });
      }else {
        // 信息收集
        $("#checking"+j).click(function(event){
          var i = event.target.getAttribute("data-id");
          localStorage.setItem('_token',$.cookie('token'));
          localStorage.setItem('_digest',$.cookie('digest'));
          localStorage.setItem('_uniqueKey',allTaobaoList[i].uniqueKey);
          localStorage.setItem('loginSuccessful',JSON.stringify(allTaobaoList[i]));
          if (_clientWidth < 768) {// 手机端
            window.open("./../info/mobile/index.html");
          }else {
            window.open("./../info/view/index.html");
          }
          $("#pop-up").click(function(event) {
            if (_clientWidth < 768) {
              window.open("./../info/mobile/index.html");
              location = "./../info/mobile/index.html";
            }else {
              location = "./../info/view/index.html";
              window.open("./../info/view/index.html");
            }
          });
          // $('#taobaoModal').modal({backdrop:'static'});
        });
        // 如果有确认函，显示并绑定确认函
        if (allTaobaoList[j].isConfirmed == "Y") {
          $("#confirm"+j).click(function(event){
            var P = event.target.getAttribute("data-id");
            localStorage.setItem('confirmUniqueKey',allTaobaoList[P].uniqueKey);
            window.open("./../info/confirm/index.html");
            $("#pop-confirm").click(function(event) {
              window.open("./../info/confirm/index.html");
              location = "./../info/confirm/index.html";
            });
            // $('#confirmModal').modal({backdrop:'static'});
          });
        }
      }
    }
    // 如果只有一个  ，自动弹出信息收集
    // if ( supplementNum == 1 ) {
    //   for (var F = 0; F < allTaobaoList.length; F++) {
    //     if (allTaobaoList[F].infoId == null) {
    //       localStorage.setItem('_token',$.cookie('token'));
    //       localStorage.setItem('_digest',$.cookie('digest'));
    //       localStorage.setItem('_uniqueKey',allTaobaoList[F].uniqueKey);
    //       localStorage.setItem('loginSuccessful',JSON.stringify(allTaobaoList[F]));
    //       if (_clientWidth < 768) {
    //         window.open("./../info/mobile/index.html");
    //       }else {
    //         window.open("./../info/gather.html");
    //       }
    //       $("#pop-up").click(function(event) {
    //         if (_clientWidth < 768) {
    //           window.open("./../info/mobile/index.html");
    //           location = "./../info/mobile/index.html";
    //         }else {
    //           window.open("./../info/gather.html");
    //           location = "./../info/gather.html";
    //         }
    //       });
    //       $('#taobaoModal').modal({backdrop:'static'});
    //       return
    //     }
    //   }
    // }else if (supplementNum > 1) {
    //   alert('您有多份信息收集未完成，请尽快完成')
    // }

    function paystatus(val) {
      if (val == 1) {
        return "已付全款"
      }else if (val == 2) {
        return "已付定金"
      }
    }
    function amountstatus(payStatus,payAmount,notPayAmount) {
      if (payStatus == 1) {
        return ""
      }else if (payStatus == 2) {
        var _string = "<div class='minor'>已付金额:<span>"//
          +payAmount+"</span>RMB</div><div class='minor'>未付金额:<span>"//
          +notPayAmount+"</span>RMB</div>";
        return _string
      }
    }
    function information(infoId,isConfirmed,i) {
      if (infoId == null) {
        return "<div class='supplement' id='supplement"+i+"' data-id="+i+">填写出行信息</div>"
      }else {
        // 说明可以查看确认函
        if (isConfirmed == 'Y') {
          return "<div class='checking' id='checking"+i+"' data-id="+i+">查看信息</div><div class='checking' id='confirm"+i+"' data-id="+i+">查看确认函</div>"
        }else {
          return "<div class='checking' id='checking"+i+"' data-id="+i+">查看信息</div>"
        }
      }
    }
  }
}

var isTaobaoTimeout = false;

// stamp 转换 xxxx-xx-xx 字符串
function dateToFormat(stamp) {
  var _data = new Date(stamp);

  var year = _data.getFullYear();//获取完整的年份(4位,1970)

  var month = _data.getMonth()+1;//获取月份(0-11,0代表1月,用的时候记得加上1)

  if( month <= 9 ){
    month = "0"+month;
  }

  var date = _data.getDate();//获取日(1-31)

  if( date <= 9 ){
    date = "0"+date;
  }

  return year+"-"+month+"-"+date;
}

function templateToString(data) {
  if (data == 1) {
    return "马达京彩瑚度假村";
  }else if(data == 2) {
    return "MWB马步水上屋度假村";
  }else if(data == 3) {
    return "卡帕莱度假村";
  }else if(data == 4) {
    return "诗巴丹平台潜水度假村";
  }else if(data == 5) {
    return "邦邦岛龙珠度假村";
  }else if(data == 6) {
    return "Smart沙滩木屋度假村(马步木屋)";
  }else if(data == 7) {
    return "邦邦岛白珍珠度假村";
  }else if(data == 8) {
    return "马步岛婆罗度假村";
  }else if(data == 9) {
    return "兰卡央度假村";
  }
}
















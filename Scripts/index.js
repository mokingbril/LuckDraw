//抽奖人员名单
var allPerson = "谭**;袁**;李**;鲁**;刘*;牛*;刘**;赵*;洪**;后**;邓**;黄**;张**;范**;甘**;林**;朱**;雷*;向**;汤**;马**;金**;吴**;林**;李**;何**;廖**;谢**;兰**;陈*;戴**;周**;陈**;邹**;尹**;韩**;郭**;刘**;曾*;丁*;欧阳**;赖**;熊*;薛*;王*;候**;彭*;严**;郑**;杨*;葛*;李*洁;陈*超;何*花;莫**;唐*;杨**;杨**;左**;谢*辉;李**;王**;陈**;谢**;江*;刘**;焦**;李**;陈**;程**;盘**;杨**;陈**;黄*;何**;胡**;康*;蒋**;钱**;罗**;肖**;蔡*;齐**;张**;肖**;张**;杨**;墨尘AI;魏**";
var prize_json = [{ prize: "欢乐奖：耳机", single: 2, count: 18 }, { prize: "四等奖：手表", single: 2, count: 10 }, { prize: "三等奖：平板", single: 2, count: 8 }, { prize: "二等奖：手机", single: 1, count: 3 }, { prize: "一等奖：现金", single: 1, count: 1 }, { prize: "特等奖：现金", single: 1, count: 1 }];

//领导人员名单
var leaderArr = ["韩飞"];
//未中奖人员名单
var remainPerson = allPerson.toString().split(";");
//中奖人员名单
var luckyMan = [];
var timer;//定时器
var times = 1;//抽奖次数,如果不是第一次，不加粗显示领导姓名
$(function () {
    iconAnimation();
    //开始抽奖
    $("#btnStart").on("click", function () {
        //判断是开始还是结束
        if ($("#btnStart").text() === "开始") {
            //设置抽奖奖品
            for (var i = 0; i < prize_json.length; i++) {
                if (prize_json[i].prize == $("#txtPrize").val()) {
                    prize_json[i].count -= prize_json[i].single;
                    if (prize_json[i].count <= 0) {
                        $("#txtNum").val("0");
                        for (var j = 0; j < prize_json.length; j++) {
                            if (prize_json[j].count > 0) {
                                $("#txtPrize").val(prize_json[j].prize);
                                $("#txtNum").val(prize_json[j].single);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            if ($("#txtNum").val() == "0") { showDialog("奖池已空"); return false; }
            if ($("#txtNum").val() > remainPerson.length) {
                showDialog("当前抽奖人数大于奖池总人数<br>当前抽奖人数：<b>" + $("#txtNum").val() + "</b>人,奖池人数：<b>" + remainPerson.length + "</b>人");
                return false;
            }
            //开始音乐
            $("audio")[1].pause(); $("audio")[0].play();
            $("#result").fadeOut();
            //显示动画框，隐藏中奖框
            $("#luckyDrawing").show().next().addClass("hide");
            move();
            $("#btnStart").text("停止");
            $("#bgLuckyDrawEnd").removeClass("bg");
        }
        else {
            $("#btnStart").text("开始");//设置按钮文本为开始
            var luckyDrawNum = $("#txtNum").val();
            $("#luckyDrawing").fadeOut();
            clearInterval(timer);//停止输入框动画展示
            setTimeout(function () {
                startLuckDraw();//抽奖开始
                $("#luckyDrawing").val(luckyMan[luckyMan.length - 1]);//输入框显示最后一个中奖名字
                $("#result").fadeIn().find("div").removeClass().addClass("p" + luckyDrawNum);//隐藏输入框，显示中奖框
                $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉
            }, 300);
        }
    });

    $("#btnReset").on("click", function () {
        //确认重置对话框
        var confirmReset = false;
        showConfirm("确认重置吗？所有已中奖的人会重新回到抽奖池！", function () {
            //熏置未中奖人员名单
            remainPerson = allPerson.toString().split(";");
            //中奖人数框置空
            //$("#txtNum").val("").attr("placeholder", "请输入中奖人数");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut();//.prev().fadeIn()
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
            times++;
            console.log(times);
        });
    });
});

//抽奖主程序
function startLuckDraw() {
    //抽奖人数
    var luckyDrawNum = $("#txtNum").val();
    if (luckyDrawNum > remainPerson.length) {
        alert("抽奖人数大于奖池人数！请修改人数。或者点重置开始将新一轮抽奖！");
        return false;
    }
    //随机中奖人
    var randomPerson = getRandomArrayElements(remainPerson, luckyDrawNum);
    var tempHtml = "";
    $.each(randomPerson, function (i, person) {
        var sizeStyle = "";
        if (person.length > 3) {
            sizeStyle = " style=font-size:" + 3 / person.length + "em";
        }
//      if (leaderArr.indexOf(person) > -1 && times == 1) {
//          tempHtml += "<span><span " + sizeStyle + "><b>" + person + "</b></span></span>";
//      }
//      else {
//          tempHtml += "<span><span " + sizeStyle + ">" + person + "</span></span>";
//      }
		tempHtml += "<span><span " + sizeStyle + ">" + person + "</span></span>";
    });
    $("#result>div").html(tempHtml);
    //开始音乐
    $("audio")[0].pause(); $("audio")[1].play(); fworks.welcome_fire();
    //剩余人数剔除已中奖名单
    remainPerson = remainPerson.delete(randomPerson);
    //中奖人员
    var cur_prize = $("#txtPrize").val().split('：');
    for (var i = 0; i < randomPerson.length; i++) {
        var color_v = "";
        if (cur_prize[0] == "欢乐奖") { color_v = " ellipsis-0"; } else if (cur_prize[0] == "四等奖") { color_v = " ellipsis-1"; } else if (cur_prize[0] == "三等奖") { color_v = " ellipsis-2"; }
        $("#tb1").append("<tr><td class='ellipsis" + color_v + "'>" + randomPerson[i] + "</td><td class='ellipsis" + color_v + "'>" + cur_prize[0] + "</td><td class='ellipsis" + color_v +"'>" + cur_prize[1] + "</td></tr>");
    }
    luckyMan = luckyMan.concat(randomPerson);
    clearInterval(scrollMove); autoScroll();
}

//跳动的数字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, remainPerson.length);
        $showName.val(remainPerson[i]);//输入框赋值
    }, interTime);
}

//顶上的小图标，随机动画
function iconAnimation() {
    var interTime = 200;//设置间隔时间
    var $icon = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime);

}

var scrollMove = null;
function autoScroll() {
    var box = $("#bm_content")[0]; var l1 = $("#tb1")[0];
    if (l1.offsetHeight > box.offsetHeight) {
        try{clearInterval(scrollMove);}catch{}
        document.getElementById("tb2").innerHTML = l1.innerHTML;//克隆list1的数据，使得list2和list1的数据一样
        scrollMove = setInterval(scrollup, 30);//数值越大，滚动速度越慢
        box.onmouseover = function () { clearInterval(scrollMove); }
    }
}
function scrollup() {
    var box = $("#bm_content")[0]; var l1 = $("#tb1")[0];
    //滚动条距离顶部的值恰好等于list1的高度时，达到滚动临界点，此时将让scrollTop=0,让list1回到初始位置，实现无缝滚动
    if (box.scrollTop >= l1.offsetHeight) {
        box.scrollTop = 0;
    } else {
        box.scrollTop++;
    }
}
$(function () {
    autoScroll();    
    //鼠标离开时，滚动继续
    $("#bm_content")[0].onmouseout = function () {
        scrollMove = setInterval(scrollup, 30);
    }
});


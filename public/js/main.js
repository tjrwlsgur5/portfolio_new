var scrollEvent = false,
	count = 0,
	count2 = 0,
	cont_wrap1 = $("#cont_wrap1"),
	cont_wrap2 = $("#cont_wrap2"),
	cont_wrap3 = $("#cont_wrap3"),
	cont_wrap4 = $("#cont_wrap4"),
	cont_wrap5 = $("#cont_wrap5"),
	sliderUl = $("#slider ul"),
	titleUl = $("#cont_wrap5 article ul"),
	sliderLi = $("#slider ul li").width(),
	title_Li = $("#cont_wrap5 article li").width(),
	title_Li0 = $("#cont_wrap5 article ul>li:eq(0)").clone(),
	title_Li1 = $("#cont_wrap5 article ul>li:eq(1)").clone(),
	title_Li2 = $("#cont_wrap5 article ul>li:eq(2)").clone(),
	title_Li3 = $("#cont_wrap5 article ul>li:eq(3)").clone(),
	title_Li4 = $("#cont_wrap5 article ul>li:eq(4)").clone(),
	liImg0 = $("#slider ul>li:eq(0)").clone(),
	liImg1 = $("#slider ul>li:eq(1)").clone(),
	liImg2 = $("#slider ul>li:eq(2)").clone(),
	liImg3 = $("#slider ul>li:eq(3)").clone(), 
	liImg4 = $("#slider ul>li:eq(4)").clone(),
	i = 0,
	s = 2,
	c = 3,
	key;

//$(function(){
//	var title_Li = {};
//	for(var w = 1; w <= 5; w++){
//		cont_wrap['cont_wrap'+w]=$("cont_wrap"+w);
//		alert(Object.values(cont_wrap));
//		$('cont_wrap'+w).hide();
//	}
//})

cont_wrap1.hide();
cont_wrap2.hide();
cont_wrap3.hide();
cont_wrap4.hide();
cont_wrap5.hide();

titleUl.append(title_Li0);
titleUl.append(title_Li1);
titleUl.append(title_Li2);
titleUl.append(title_Li3);
titleUl.append(title_Li4);
sliderUl.prepend(liImg4);
sliderUl.prepend(liImg3);
sliderUl.append(liImg0);
sliderUl.append(liImg1);
sliderUl.append(liImg2);

$("#top_but").hide();

var liIndex =$("#slider ul li:last").index()+1;
var title_liIndex =$("#cont_wrap5 article li:last").index()+1;

sliderUl.css("width",(liIndex*Math.ceil(sliderLi)));
titleUl.css("width",(title_liIndex*Math.ceil(title_Li+200)));

$("#slider ul li:eq(2)>img").addClass('img_style');
$("#sandbox+ul li:eq(0)").addClass('li_style');

setInterval(function(){
	var sh = $(".screen_size").height()*5
	var scrollValue = $(document).scrollTop();
	
	if(scrollValue !== sh){
		$("#slider ul li:eq("+s+")>img").removeClass('img_style');
	}
	if(scrollValue !== sh || c >= 8 || s >= 7 || i == liIndex-5){
			c = 3;
			s = 2;
			$("#slider ul li:eq(2)>img").addClass('img_style');
			$("#slider ul li:eq(7)>img").removeClass('img_style');
			titleUl.css("margin-left","0px");	
			sliderUl.css("margin-left","0px");	
			i=0;
	}
	if(scrollValue == sh){
		$("#slider ul li:eq("+c+")>img").addClass('img_style');
		c++;
		$("#slider ul li:eq("+s+")>img").removeClass('img_style');
		s++;
		titleUl.animate({marginLeft:'-='+(title_Li+200)},"fast");
		sliderUl.animate({marginLeft:'-='+sliderLi},"fast");
		i++;
	}
},5000)

$("html,body").on('mousewheel DOMMouseScroll', function(e){
	e.preventDefault();
	var m = e.originalEvent.wheelDelta;
	var sh = $(".screen_size").height();
	
	if(m > 1 && scrollEvent == false && count >= 1){
		scrollEvent = true;
		$("#cont_wrap"+count).fadeOut(1000);
		count--;
		if(count == 0){$("#top_but").fadeOut(1000);}
		$("#cont_wrap"+count).fadeIn(1500);
		$("html,body").stop().animate({scrollTop:sh*count},{duration:300, complete: function(){
			scrollEvent = false;
		}})
		$("#sandbox+ul li:eq("+count2+")").removeClass('li_style');
		count2--;
		$("#sandbox+ul li:eq("+count+")").addClass('li_style');
	} else if(m < 1 && scrollEvent == false && count < 6){
		scrollEvent = true;
		$("#cont_wrap"+count).fadeIn(1500);
		count++;
		if(count > 0){$("#top_but").fadeIn(1500);}
		$("#cont_wrap"+count).fadeIn(1500);
		$("#sandbox+ul li:eq("+count+")").addClass('li_style');
		$("html,body").stop().animate({scrollTop:sh*count},{duration:300, complete: function(){
			scrollEvent = false;
		}})
		$("#sandbox+ul li:eq("+count2+")").removeClass('li_style');
		count2++;
	}
});

$(window).on('scroll',function(){
	var sh = $(".screen_size").height()
	var scrollValue = $(document).scrollTop();
	
	if(scrollValue >= sh){
		$("header>div").addClass('div_style');
	} else {
		$("header>div").removeClass('div_style');
	}
});

$(document).keydown(function(e) {

    key = (e) ? e.keyCode : event.keyCode;
    //alert(key);
    var t = document.activeElement;

    if (key == 8 || key == 116 || key == 17 || key == 82) {//Backspace=8 F5=116 Ctrl(17) + r(82) 키막기
        if (key == 8) {
            if (t.tagName != "INPUT") {
                if (e) {
                    e.preventDefault();
                } else {
                    event.keyCode = 0;
                    event.returnValue = false;
                }
            }
        } else {
            if (e) {
                e.preventDefault();
            } else {
                event.keyCode = 0;
                event.returnValue = false;
            }
        }
    }
});


$("#sandbox").on('click',function(){
	$("#sandbox ul").toggleClass('ul_style');
});
$(".reset_but").click(function(){
	$("#sandbox+ul li:eq("+count2+")").removeClass('li_style');
	count = 0;
	count2 = 0
	$("#sandbox+ul li:eq(0)").addClass('li_style');
	//alert(count);
})


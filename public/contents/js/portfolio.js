var on = 1,
	angle = 0;

$("li>a span:last-child").hide()
$(".img_hover").hide();
setInterval(function(){
	$(".img_hover div:first-child").rotate(0);
	if(on == 0){
		angle-=3;
		$(".on_img").rotate(angle);
	}
},50);

$("li>a").mouseenter(function(){
	on = 0;
	$(this).children().eq(3).fadeIn();
	$(this).next().show();
	$(this).next().children().eq(0).addClass("on_img");
})
$("li>a").mouseleave(function(){
	on = 1
	angle = 0
	$(this).children().eq(3).hide();
	$(this).next().hide();
	$(this).next().children().eq(0).removeClass("on_img");
})
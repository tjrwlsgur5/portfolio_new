function fnMove(seq){
    var offset = $(".page" + seq).offset();
    $('html, body').animate({scrollTop : offset.top}, 400);
}
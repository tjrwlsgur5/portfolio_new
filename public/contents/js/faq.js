$(".acc_box ol li").click(function(){
    $(".acc_box ol li").removeClass("on");
    $(this).addClass("on");
});



// $(".acc_box ol li").click(function () {
//     var submenu = $(this).next("p");
//     if (submenu.is(":visible")) {
//         $(submenu).slideUp();
//     } else {
//         $(this).addClass("on");
//     }
// });
var popUp = $("#pop-up");

popUp.hide();

$(document).ready(function(){ 
  var fileTarget = $('#file_but'); 
  fileTarget.on('change', function(){ // 값이 변경되면
      var cur=$("#question_cont input[type=file]").val();
    $("#upload-name").val(cur);
  }); 
}); 
$("#pup_on").click(function(){
	$("#pop-up").show();
	return false;
});
$("#pup_off").click(function(){
	$("#pop-up").hide();
	$("#agree").prop("checked",true);
});
$(".off").click(function(){
	return false;
});
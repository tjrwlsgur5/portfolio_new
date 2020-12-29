$("h1 a").attr("href", "../index.html");

$("#id_overlap_but").click(function(){
	$("#id_overlap").prop("checked",true);
	alert("중복확인완료");
});

function signUp(myForm){
	var user_id = myForm.user_id,
		id_overlap = myForm.id_overlap, 
		user_pw = myForm.user_pw,
		user_pwcheck = myForm.user_pwcheck,
		user_name = myForm.user_name,
		user_email = myForm.user_email,
		user_phonenum = myForm.user_phonenum,
		agree = myForm.agree,
		idRegExp = /^[a-zA-z0-9]{8,16}$/,
		passwordRegExp = /^[a-zA-z0-9]{8,16}$/,
		nameRegExp = /^[가-힣]{2,4}$/,
		emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/,
		numberRegExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/,
		id_check = idRegExp.test(user_id.value),
		pw_check = passwordRegExp.test(user_pw.value),
		pw_check2 = user_id.value == user_pw.value,
		pw_check3 = user_pw.value == user_pwcheck.value,
		name_check = nameRegExp.test(user_name.value),
		email_check = emailRegExp.test(user_email.value),
		phonenum_check = numberRegExp.test(user_phonenum.value),
		id_alert  = $("#id_alert"),
		pw_alert = $("#pw_alert"),
		pwcheck_alert = $("#pwcheck_alert"),
		name_alert = $("#name_alert"),
		email_alert = $("#email_alert"),
		number_alert = $("#number_alert"); 	
	if(user_id.value == ""){
		id_alert.css("color","red");
		id_alert.text("아이디를 입력해주세요!");
		user_id.focus();
	}else if(user_pw.value == ""){
		pw_alert.css("color","red");
		pw_alert.text("비밀번호를 입력해주세요!");
		user_pw.focus();
	}else if(user_pwcheck.value == ""){
		pwcheck_alert.css("color","red");
		pwcheck_alert.text("비밀번호확인를 입력해주세요!");
		user_pwcheck.focus();
	}else if(user_name.value == ""){
		name_alert.css("color","red");
		name_alert.text(" 이름을 입력해주세요!");
		user_name.focus();
	}else if(user_email.value == ""){
		email_alert.css("color","red");
		email_alert.text("이매일을 입력해주세요!");
		user_email.focus();
	}else if(user_phonenum.value == ""){
		number_alert.css("color","red");
		number_alert.text("전화번호를 입력해주세요!");
		user_phonenum.focus();
	}
	
	if(id_check == false && user_id.value != ""){
		id_alert.css("color","red");
        id_alert.text("아이디는 영문 대소문자와 숫자 8~16자리로 입력해야합니다!");
		user_id.value = "";
		user_id.focus();
	}
	if(id_overlap.checked == false && user_id.value != ""){
		id_alert.css("color","red");
        id_alert.text("아이디 중복확인해주세요!");
		$("#id_overlap_but").focus();
	}
	if(pw_check == false && user_pw.value != ""){
		pw_alert.css("color","red");
        pw_alert.text("비밀번호는 영문 대소문자와 숫자 8~16자리로 입력해야합니다!");
		user_pw.value = "";
		user_pw.focus();
	}
	if(pw_check2 == true && user_id.value != "" && user_pw.value != ""){
		pw_alert.css("color","red");
        pw_alert.text("아이디와 비밀번호는 같을 수 없습니다!");
		user_pw.value = "";
		user_pw.focus();
	}
	if(pw_check3 == false && user_pwcheck.value != ""){
		pwcheck_alert.css("color","red");
        pwcheck_alert.text("두 비밀번호가 일치하지 않습니다!");
		user_pwcheck.value = "";
		user_pwcheck.focus();
	}
	if(name_check == false && user_name.value != ""){
		name_alert.css("color","red");
        name_alert.text("이름이 올바르지 않습니다!");
		user_name.value = "";
		user_name.focus();
	}
	if(email_check == false && user_email.value != ""){
		email_alert.css("color","red");
        email_alert.text("이메일 형식이 올바르지 않습니다!");
		user_email.value = "";
		user_email.focus();
	}
	if(phonenum_check == false && user_phonenum.value != ""){
		number_alert.css("color","red");
        number_alert.text("전화번호가 올바르지 않습니다!");
		user_phonenum.value = "";
		user_phonenum.focus();
	}
	if(agree.checked == false && user_id.value != "" && user_pw.value != "" && user_pwcheck.value != "" && user_name.value != "" && user_email.value != "" && user_phonenum.value != ""){
		alert("약관에 동의해야 합니다");
	}
	if(id_check == true && id_overlap.checked == true && pw_check == true && pw_check2 == false && pw_check3 == true && name_check == true && email_check == true && phonenum_check == true && agree.checked == true){
		alert("회원가입 완료");
	} else {
		return false;
	}
}
function pwChange(myForm){
	var user_pw = myForm.user_pw,
		user_pwcheck = myForm.user_pwcheck,
		passwordRegExp = /^[a-zA-z0-9]{8,16}$/,
		pw_check = passwordRegExp.test(user_pw.value),
		pw_check3 = user_pw.value == user_pwcheck.value,
		pw_alert = $("#pw_alert"),
		pwcheck_alert = $("#pwcheck_alert");
	if(user_pw.value == ""){
		pw_alert.css("color","red");
		pw_alert.text("비밀번호를 입력해주세요!");
		user_pw.focus();
	}else if(user_pwcheck.value == ""){
		pwcheck_alert.css("color","red");
		pwcheck_alert.text("비밀번호확인를 입력해주세요!");
		user_pwcheck.focus();
	}
	if(pw_check == false && user_pw.value != ""){
		pw_alert.css("color","red");
        pw_alert.text("비밀번호는 영문 대소문자와 숫자 8~16자리로 입력해야합니다!");
		user_pw.value = "";
		user_pw.focus();
	}
	if(pw_check3 == false && user_pwcheck.value != ""){
		pwcheck_alert.css("color","red");
        pwcheck_alert.text("두 비밀번호가 일치하지 않습니다!");
		user_pwcheck.value = "";
		user_pwcheck.focus();
	}
	if(pw_check == true && pw_check3 == true){
		return true;
	} else {
		return false;
	}
}
function idFind(myForm){
	var user_name = myForm.user_name,
		user_email = myForm.user_email,
		user_phonenum = myForm.user_phonenum,
		nameRegExp = /^[가-힣]{2,4}$/,
		emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/,
		numberRegExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/,
		name_check = nameRegExp.test(user_name.value),
		email_check = emailRegExp.test(user_email.value),
		phonenum_check = numberRegExp.test(user_phonenum.value),
		name_alert = $("#name_alert"),
		email_alert = $("#email_alert"),
		number_alert = $("#number_alert"); 	
	if(user_name.value == ""){
		name_alert.css("color","red");
		name_alert.text(" 이름을 입력해주세요!");
		user_name.focus();
	}else if(user_email.value == ""){
		email_alert.css("color","red");
		email_alert.text("이매일을 입력해주세요!");
		user_email.focus();
	}else if(user_phonenum.value == ""){
		number_alert.css("color","red");
		number_alert.text("전화번호를 입력해주세요!");
		user_phonenum.focus();
	}
	
	if(name_check == false && user_name.value != ""){
		name_alert.css("color","red");
        name_alert.text("이름이 올바르지 않습니다!");
		user_name.value = "";
		user_name.focus();
	}
	if(email_check == false && user_email.value != ""){
		email_alert.css("color","red");
        email_alert.text("이메일 형식이 올바르지 않습니다!");
		user_email.value = "";
		user_email.focus();
	}
	if(phonenum_check == false && user_phonenum.value != ""){
		number_alert.css("color","red");
        number_alert.text("전화번호가 올바르지 않습니다!");
		user_phonenum.value = "";
		user_phonenum.focus();
	}
	if(name_check == true && email_check == true && phonenum_check == true){
		return true;
	} else {
		return false;
	}
}
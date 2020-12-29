// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler')
  , ejs = require('ejs');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
 
// mongoose 모듈 사용
var mongoose = require('mongoose');


// 익스프레스 객체 생성
var app = express();


// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
   secret:'my key',
   resave:true,
   saveUninitialized:true
}));
// ejs
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');





//===== 데이터베이스 연결 =====//

// 데이터베이스 객체를 위한 변수 선언
var database;

// 데이터베이스 모델 객체를 위한 변수 선언
var UserModel;
var BoardModel;
var CommentModel;

//데이터베이스에 연결
function connectDB() {
// 데이터베이스 연결 정보
var databaseUrl = 'mongodb://localhost:27017/local';
    
// 데이터베이스 연결
console.log('데이터베이스 연결을 시도합니다.');
mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
mongoose.connect(databaseUrl);
database = mongoose.connection;
   
database.on('error', console.error.bind(console, 'mongoose connection error.'));   
database.on('open', function () {
console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
   // UserModel 모델 정의
   // UserModel=User;
   // BoardModel=Board;
   // CommentModel=Comment;
   UserModel = require('./models/user')
   BoardModel = require('./models/board');
   CommentModel = require('./models/comment');
});
   
    // 연결 끊어졌을 때 5초 후 재연결
   database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    });
}



//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();

// 로그인(id) 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/loginid').post(function(req, res) {
   console.log('/loginid 호출됨.');
   // 요청 파라미터 확인
   var paramId = req.body.user_id || req.query.user_id;
   console.log('요청 파라미터 : ' + paramId);
   // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
   if (database) {
      loginId(database, paramId, function(err, docs) {
         if (err) {throw err;}
         // 조회된 레코드가 있으면 성공 응답 전송
         if (docs) {
            console.dir(docs);
            var userid = docs[0].id;
            console.log('user id= '+userid);
            res.render('login-pw.ejs', {"id":userid, pass:false});
         } else { // 조회된 레코드가 없는 경우 실패 응답 전송
            res.render('login-id.ejs', {title:'Avenir 아이디입력', pass:true});
         }
      });
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
      res.end();
   }
});

// 로그인(pwd) 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/loginpw').post(function(req, res) {
    console.log('/loginpw 호출됨.');
 
    // 요청 파라미터 확인
   var paramId = req.body.user_id || req.query.user_id;
   var paramPassword = req.body.user_pw || req.query.user_pw;
   console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
    
     // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
    if (database) {
       loginPw(database, paramId, paramPassword, function(err, docs) {
         if (err) {throw err;}
          
         // 조회된 레코드가 있으면 성공 응답 전송
         if (docs) {
            console.dir(docs);
            var userpk = docs[0]._id;
            console.log('user pk= '+userpk);
            res.render('index.ejs', {"id":paramId, "userpk":userpk});
         } else {  // 조회된 레코드가 없는 경우 실패 응답 전송
            res.render('login-pw.ejs', {"id":paramId, pass:true});
         }
      });
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
      res.end();
   }
});

// 아이디찾기 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/findid').post(function(req, res) {
   console.log('/findid 호출됨.');
 
   // 요청 파라미터 확인
   var paramName = req.body.user_name || req.query.user_name;
   var paramEmail = req.body.user_email || req.query.user_email;
   var paramPhonenum = req.body.user_phonenum || req.query.user_phonenum;
   console.log('요청 파라미터 : ' + paramName + ', ' + paramPhonenum +', '+paramEmail);
    
   // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
   if (database) {
      findId(database, paramName, paramPhonenum, paramEmail, function(err, docs) {
         if (err) {throw err;}
          
             // 조회된 레코드가 있으면 성공 응답 전송
         if (docs) {
             console.dir(docs);
 
                 // 조회 결과에서 사용자 이름 확인
             var userid = docs[0].user_id;
             console.log('user id= '+userid);
             res.render('login-id-clear.ejs',{"id":userid});
          
         } else {  // 조회된 레코드가 없는 경우 실패 응답 전송
             res.redirect('public/contents/login-id-fail.html')
         }
      });
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
      res.end();
   }
});
 
//비밀번호찾기 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/findpw').post((req, res) => {
   console.log('/findpw 호출됨.');

   // 요청 파라미터 확인
   var paramId = req.body.user_id || req.query.user_id;
    var paramEmail= req.body.user_email || req.query.user_email;
    var paramPhonenum = req.body.user_phonenum || req.query.user_phonenum;
   
    console.log('요청 파라미터 : ' +paramId+ ', ' + paramEmail + ', ' + paramPhonenum);
   
    // 데이터베이스 객체가 초기화된 경우, 함수 호출하여 사용자 인증
   if (database) {
      findPw(database, paramId, paramEmail, paramPhonenum,function(err, docs) {
         if (err) {throw err;}
         
            // 조회된 레코드가 있으면 성공 응답 전송
         if (docs) {
            console.dir(docs);

                // 조회 결과에서 사용자 아이디 확인
            var userid = docs[0].user_id;
            console.log('user id= '+userid);
            res.render('login-pw-change.ejs', {"id":userid});
            
         
         } else {  // 조회된 레코드가 없는 경우 실패 응답 전송
            res.redirect('public/contents/login-pw-fail.html');
         }
      });
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
      res.end();
   }
});

// 비밀번호 수정 라우팅 함수 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
router.route('/resavepw').post(function(req, res) {
   console.log('/resavepw 호출됨.');
   var paramId = req.body.user_id || req.query.user_id;
    var paramPassword = req.body.user_pw || req.query.user_pw;
    var paramPasswordCheck = req.body.user_pwcheck || req.query.user_pwcheck;

    console.log('요청 파라미터 : '+ paramId+', '+paramPassword + ', '+paramPasswordCheck);
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
   if (database) {
      savePw(database, paramId, paramPassword, paramPasswordCheck, function(err, savePwd) {
         if (err) {throw err};
            
           // 결과 객체 있으면 성공 응답 전송
         if (savePw) {
               console.dir(savePw);
               res.redirect('public/contents/login-pw-change-clear.html')
            } else {  // 결과 객체가 없으면 실패 응답 전송
               res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
               res.write('<h2>비밀번호 수정 실패</h2>');
               res.write("<br><br><a href='/public/findpwdform.html'>비밀번호 찾기</a>");
               res.end();
            }
      });

      
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
   }
   
});

// 회원가입 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
router.route('/signup').post(function(req, res) {
   console.log('/signup 호출됨.');

    var paramId = req.body.user_id || req.query.user_id;
    var paramPassword = req.body.user_pw || req.query.user_pw;
    var paramPasswordCheck = req.body.user_pwcheck || req.query.user_pwcheck;
    var paramName = req.body.user_name || req.query.user_name;
    var paramPhonenum = req.body.user_phonenum || req.query.user_phonenum;
    var paramEmail = req.body.user_email || req.query.user_email;
    var paramUsertype = req.body.usertype || req.query.usertype;
    var paramPersonalagree = req.body.agree || req.query.agree;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', '+paramPasswordCheck + ', '+paramName+', '+paramPhonenum+', '+paramEmail+', '+paramUsertype+', '+paramPersonalagree);
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
   if (database) {
      
      addUser(database, paramId, paramPassword, paramPasswordCheck, paramName, paramPhonenum, paramEmail, paramUsertype, paramPersonalagree, function(err, addedUser) {
         if (err) {throw err};
            
                  // 결과 객체 있으면 성공 응답 전송
         if (addedUser) {
               console.dir(addedUser);
               res.redirect('public/contents/login-id.html')
            } else {  // 결과 객체가 없으면 실패 응답 전송
               res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
               res.write('<h2>사용자 추가  실패</h2>');
               res.write("<br><br><a href='/public/accession.html'>회원가입</a>");
               res.end();
            }
      });
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
   }
   
});

//로그아웃 처리(디스트로이)
router.route('/logout').get(function (req, res) {
        console.log('/loginout 라우팅 함수호출 됨');
 
        if (req.session.user) {
            console.log('로그아웃 처리');
            req.session.destroy(
                function (err) {
                    if (err) {
                        console.log('세션 삭제시 에러');
                        return;
                    }
                    console.log('세션 삭제 성공');
                    //파일 지정시 제일 앞에 / 를 붙여야 root 즉 public 안에서부터 찾게 된다
                    res.redirect('public/index.html');
                }
            );          //세션정보 삭제
 
        } else {
            console.log('로긴 안되어 있음');
            res.redirect('public/index.html');
        }
      }
)

//중복 id check
router.route('/idcheck').post(function(req, res) {
   console.log('/idcheck 호출됨.');
 
   var paramId = req.body.user_id || req.query.user_id;
  
   console.log('요청 파라미터 : ' + paramId);
   
   // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
  if (database) {
     
      idCheck(database, paramId, function(err, docs) {
         if (err) {throw err;}
         
            // 조회된 레코드가 있으면 성공 응답 전송
         if (docs) {
            console.dir(docs);

               // 조회 결과에서 사용자 이름 확인
            var userid = docs[0].user_id;
            console.log('user id= '+userid);
            res.send({result:true, check:'중복된 아이디입니다.'})
         
         } else {  // 조회된 레코드가 없는 경우 실패 응답 전송
            res.send({result:true, check: '사용 가능한 아이디입니다.'})
         }
      });
   } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
      res.end();
   }
});







// 라우터 객체 등록
app.use('/', router);


// 사용자id를 인증하는 함수
var loginId = function(database, user_id, callback) {
    console.log('loginId 호출됨 : ' + user_id);
    
     // 아이디와 비밀번호를 이용해 검색
    UserModel.find({"id":user_id}, function(err, results) {
       if (err) {  // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
          callback(err, null);
          return;
       }
       
       console.log('아이디 [%s] 검색결과', user_id);
       console.dir(results);
       
        if (results.length > 0) {  // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
           console.log('아이디 [%s] 일치하는 사용자 찾음.', user_id);
           callback(null, results);
        } else {  // 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
           console.log("일치하는 사용자를 찾지 못함.");
           callback(null, null);
        }
    });
 };

 // 사용자pw를 인증하는 함수
var loginPw = function(database, user_id, user_pw, callback) {
    console.log('loginPw 호출됨 : ' + user_id + ', ' + user_pw);
    
     // 아이디와 비밀번호를 이용해 검색
    UserModel.find({"id":user_id, "password":user_pw}, function(err, results) {
       if (err) {  // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
          callback(err, null);
          return;
       }
       
       console.log('아이디 [%s], 패스워드 [%s]로 사용자 검색결과', user_id, user_pw);
       console.dir(results);
       
        if (results.length > 0) {  // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
           console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', user_id, user_pw);
           callback(null, results);
        } else {  // 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
           console.log("일치하는 사용자를 찾지 못함.");
           callback(null, null);
        }
    });
 };

// ID찾기 사용자를 인증하는 함수
var findId = function(database, user_name, user_phonenum, user_email, callback) {
    console.log('authUser 호출됨 : ' + user_name + ', ' + user_phonenum+', '+user_email);
    
     // 이름, 전화번호, 이메일을 이용해 검색
    UserModel.find({"name":user_name, "phonenum":user_phonenum, "email":user_email}, function(err, results) {
       if (err) {  // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
          callback(err, null);
          return;
       }
       
       console.log('이름 [%s], 전화번호 [%s], 이메일 [%s]로 사용자 검색결과', user_name, user_phonenum, user_email);
       console.dir(results);
       
        if (results.length > 0) {  // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
           console.log('이름 [%s], 전화번호 [%s], 이메일 [%s]이 일치하는 사용자 찾음.', user_name, user_phonenum, user_email);
           callback(null, results);
        } else {  // 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
           console.log("일치하는 사용자를 찾지 못함.");
           callback(null, null);
        }
    });
 };





// 사용자 패스워드를 인증하는 함수
var findPw= function(database, user_id, user_email, user_phonenum, callback) {
   console.log('findPw 호출됨 : ' +user_id+', ' + user_email+ ', ' + user_phonenum);
   
    // 아이디와 비밀번호를 이용해 검색
   UserModel.find({"id":user_id, "email":user_email, "phonenum":user_phonenum}, function(err, results) {
      if (err) {  // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
         callback(err, null);
         return;
      }
      
      console.log('아이디 [%s], 이메일 [%s], 전화번호 [%s]로 사용자 검색결과', user_id,  user_email, user_phonenum);
      console.dir(results);
      
       if (results.length > 0) {  // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
           console.log('아이디 [%s], 이메일 [%s], 전화번호 [%s]]로 사용자 검색결과', user_id,  user_email, user_phonenum);
           callback(null, results);
       } else {  // 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
          console.log("일치하는 사용자를 찾지 못함.");
          callback(null, null);
       }
   });
};

//비밀번호를 수정하는 함수
var savePw = function(database, user_id, user_pw, user_pwcheck, callback) {
   console.log('savePwd 호출됨 : '+ user_id + ', '+ user_pw + ', ' + user_pwcheck);
   
   var user = UserModel.update({"id":user_id},{$set:{"password":user_pw,"passwordcheck":user_pwcheck}});

   // save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
   user.update(function(err, savePw) {
      if (err) {
         callback(err, null);
         return;
      }
      
       console.log("비밀번호 수정함.");
       callback(null, savePw);
        
   });
};

//회원가입 함수
var addUser = function(database, user_id, user_pw, user_pwcheck, user_name,  user_phonenum, user_email, usertype, agree, callback) {
   console.log('addUser 호출됨 : ' + user_id + ', ' + user_pw + ', ' + user_pwcheck + ', ' + user_name +', '+user_phonenum +', '+user_email);
   
   // UserModel 인스턴스 생성
   var user = new UserModel({"id":user_id, "password":user_pw, "passwordcheck":user_pwcheck, "name":user_name, "phonenum":user_phonenum, "email":user_email, "usertype":usertype, "personalagree":agree});

   // save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
   user.save(function(err, addedUser) {
      if (err) {
         callback(err, null);
         return;
      }
      
       console.log("사용자 데이터 추가함.");
       callback(null, addedUser);
        
   });
};

//중복아이디 함수
var idCheck = function(database, user_id, callback) {
   console.log('idCheck 호출됨 : ' + user_id);
   
    // 이름, 전화번호, 이메일을 이용해 검색
   UserModel.find({"id":user_id}, function(err, results) {
      if (err) {  // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
         callback(err, null);
         return;
      }
      
      console.log('아이디[%s]로 사용자 검색결과', user_id);
      console.dir(results);
      
       if (results.length > 0) {  // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
          console.log('아이디[%s]이 일치하는 사용자 찾음.', user_id);
          callback(null, results);
       } else {  // 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
          console.log("일치하는 사용자를 찾지 못함.");
          callback(null, null);
       }
   });
};

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
   console.log("Express 서버 객체가 종료됩니다.");
   if (database) {
      database.close();
   }
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
   
});
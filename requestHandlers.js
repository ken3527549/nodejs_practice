var exec = require("child_process").exec;
var formidable = require("formidable");
var request = require('request');
var fs = require("fs");
var secretData = require('./secretData');

var start = function(req, res) {
	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    exec("ls -al", 
  	{ timeout: 5000, maxBuffer: 20000*1024 }, 
  	function (error, stdout, stderr) {
  		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
  		console.log(stdout);
  	});
	res.send(body);
	res.end();

}

var upload = (req, res) => {
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(req, function(error, fields, files) {
	console.log("parsing done");
	console.log(files.upload.path);

	fs.renameSync(files.upload.path, "E:\\cygwin\\home\\Ken-Destop\\nodejs\\expressapp\\tmp\\test.png");
	var body = 'received image:<br/>' +
		'<img src="/show" />';
	res.send(body);
	res.end();
	});
}

var show = function (req, res) {
	console.log("Request handler 'show' was called.");
	fs.readFile("E:\\cygwin\\home\\Ken-Destop\\nodejs\\expressapp\\tmp\\test.png", 'binary', function(error, file) {
	    if(error) {
	      res.send(error + "\n");
	  	  res.end();
	    } else {
	    	res.end(file, 'binary');
	    }
	});
}

// 中介軟體函數的回呼引數，依慣例，稱為 "next"
// 呼叫next()函數時，會呼叫應用程式中的下一個中介軟體函數。
var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  console.log(req.requestTime);
  next();
};

var fbLogin = function(req, res, next) {
	const appId = secretData.AppID;
	const facebook_secret_id = secretData.FBSecretID;
  console.log('secret ID: ' + facebook_secret_id);
  // const myUrl = 'http://54.82.51.60';
	const myDomain = secretData.myDomain;

    console.log('fb return: ');
    console.log(req.query);
    // 登入成功FB會傳送code參數
    var code = req.query.code;
    if (code) {
      console.log("login and code recived!");
      var token_option = {
        url:"https://graph.facebook.com/v2.10/oauth/access_token?" +
            "client_id=" + appId +
            "&client_secret=" + facebook_secret_id +
            "&code=" + code +
            "&redirect_uri=" + myDomain + "/facebook/callback",
        method:"GET"
      };
      // Using code to get access_token.
      request(token_option, function(err, resposne, body) {
        console.log(`Error: ${err}`);
        console.log(`statusCode: ${resposne}`);
        console.log(`body: ${body}`);

        if (err) {
          console.log("error: " + err);
        }else {
          console.log('To get access_token. FB return: ');
          console.log(JSON.parse(body));
          if (JSON.parse(body).error) {
            console.log('error:' + JSON.parse(body).error.message);
            res.end();
          }else {
            var access_token = JSON.parse(body).access_token;
            console.log('access_token get!')

            // input_token: token to inspect
            // access_token: app token or admin token
            var info_option = {
                url:"https://graph.facebook.com/debug_token?"+
                "input_token="+access_token +
                "&access_token="+access_token,
                method:"GET"
            };
            
            // Validing access_token
            request(info_option, function(err, response, body){
              if(err){
                console.log('error: ' + err);
                res.end();
              }else{
                console.log(JSON.parse(body));
                console.log(body);
                if (JSON.parse(body).data.is_valid) {
                  console.log('Access_token valided.');

                  //Get user info
                  request({url:"https://graph.facebook.com/me?access_token=" + access_token}, function(err, response, body){
                      if(err){
                          res.send(err);
                      }else{
                          res.cookie('id', JSON.parse(body).id, {maxAge: 7200 * 1000});
                          res.cookie('name', JSON.parse(body).name, {maxAge: 7200 * 1000});
                          res.cookie('access_token', access_token, {maxAge: 7200 * 1000});
                          res.redirect('/app');
                          // res.send(`User name: ${JSON.parse(body).name} <br> User id: ${JSON.parse(body).id}`);
                      }
                  });
                }
              }
            });
          }
        }
        
      });
    // 登入失敗會傳送error, error_code, error_description, error_reason
    }else {
      console.log(req.query.error);
      res.end();
    }
};

var fbLogout = function(req, res, next) {
  // res.clearCookie(name [, options])
  console.log(req.cookies);
  res.clearCookie("id");
  res.clearCookie("name");
  res.clearCookie("access_token");
  res.redirect('/app');
};

var mApp = function(req, res, next) {
  console.log('middle app!');
  next();
};


// use exports.someName unless you are planning to change the object type of your module from the traditional 'module instance' to someting else.
exports.start = start;
// module.exports.start = start;
exports.upload = upload;
exports.show = show;
exports.requestTime = requestTime;
exports.fbLogin = fbLogin;
exports.fbLogout = fbLogout;
exports.mApp = mApp;


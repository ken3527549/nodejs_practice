var express = require('express');
var app = express();
var dog = require('./dog');
var requestHandlers = require("./requestHandlers");
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');


app.use(cookieParser());

// ************************************
// This is the real meat of the example
// ************************************
(function() {

  // Step 1: Create & configure a webpack compiler
  var webpack = require('webpack');
  var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
  var compiler = webpack(webpackConfig);

  // Step 2: Attach the dev middleware to the compiler & the server
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }));

  // Step 3: Attach the hot middleware to the compiler & the server
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));
})();

// *******************************************
// 提供public資料夾底下的靜態檔案。
// URL路徑：localhost:3000/file
// app.use(express.static('public'));

// 建立虛擬路徑字首，即此路徑不存在於磁碟當中。
// URL路徑：localhost:3000/static/file
// app.use('/static', express.static('public'));

// 您提供給 express.static 函數的路徑，是相對於您從中啟動 node 程序的目錄。
// 如果您是從另一個目錄執行 Express 應用程式，保險作法是使用您想提供之目錄的絕對路徑：
app.use(express.static(__dirname + '/public'));

// *******************************************
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
// When require is given the path of a folder, it'll look for an index.jsx file in the folder.
// if there is one, it uses that, and if there isn't, it fails.

// It would probably make most sense (if you have control over the folder) to create an index.js file and then assign all the "modules" and then simply require that.
app.get('/react/:name', require('./routes').index);
app.get('/app', require('./routes').app);
app.get('/login', require('./routes').login);

// *******************************************
// 中介軟體的載入順序很重要：先載入的中介軟體函數也會先執行。
// requestHandlers.requestTime執行完後，呼叫 next() 函數，將要求傳遞給堆疊中的下一個中介軟體函數。
// 亦即get '/'的中介函數
// You can specify more than one middleware function at the same mount path
app.use(requestHandlers.requestTime, requestHandlers.mApp);
// Mount the middleware at “/two to serve two mini-app only when their request path is prefixed with “/two:
app.use("/two",[requestHandlers.requestTime, requestHandlers.mApp]);

// 此回呼函數會使用到req中新增的內容
app.get('/', function (req, res) {
  var responseText = 'Hello World!';
  responseText += 'Requested at: ' + req.requestTime + '';
  console.log(require('./routes'));
  res.send(responseText);
});

// *******************************************
// The basic router
app.get('/start', requestHandlers.start);
app.post('/upload', requestHandlers.upload);
app.get('/show', requestHandlers.show);
app.get('/get', function(req, res) {
	res.send('Got a get request');
});
app.delete('/', function(req, res) {
	res.send('Got a DELETE request');
});

// app.route()為路由路徑建立可鏈接的路由處理程式。
app.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });

// *******************************************
// 掛載sub app
app.use('/dog', dog);



// *******************************************
// 使用裝載路徑在裝載點載入一系列中介軟體函數。
// 其中說明中介軟體子堆疊，這個子堆疊會針對指向 /user/:id 路徑之任何類型的 HTTP 要求
app.use('/dog/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 定義兩個路由。第二個路由不會造成任何問題，卻絕不會呼叫，因為第一個路由會結束要求/回應循環。
app.get('/cat/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});
// handler for the /user/:id path, which prints the user ID
app.get('/cat/:id', function (req, res, next) {
  res.end(req.params.id);
});

// 如果要跳過路由器中介軟體堆疊中其餘的中介軟體函數，請呼叫 next('route')。
// next('route') 只適用於使用 app.METHOD() 或 router.METHOD() 函數載入的中介軟體函數。
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id == 0) next('route');
  // otherwise pass the control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  res.send('regular');
});
// handler for the /user/:id path, which renders a special page
// id=0則跳過中介軟體堆疊中的中介軟體函數，執行此函數。
app.get('/user/:id', function (req, res, next) {
  res.send('special');
});

// **************Facebook login**************************
const appId = '462848964078833';
const scope = ['public_profile', 'email', 'user_friends']
const FBRedirectUri = "/facebook/callback";

// FB的重新導向入口，處理登入驗證流程
app.get(FBRedirectUri, requestHandlers.fbLogin);
app.get("/logout", requestHandlers.fbLogout)


// *******************************************
app.get('/cookie', function (req, res) {
  // 如果请求中的 cookie 存在 isVisit, 则输出 cookie
  // 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
  if (req.cookies.isVisit) {
    console.log(req.cookies);
    res.send("again meeting!");
  } else {
    res.cookie('isVisit', 0, {maxAge: 7200 * 1000});
    res.cookie('who', 1, {maxAge: 7200 * 1000});
    res.send("fist meeting!");
  }
});


// *******************************************
var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
  console.log("Listening on %j", server.address());
});

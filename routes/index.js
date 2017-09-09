exports.index = function(req, res){
  res.render('index', { name: req.params.name });
};
exports.app = function(req, res){
	if (req.cookies.id) {
		console.log(req.cookies);
  		res.render('Application', {name: req.cookies.name});
	}else {
  		res.render('Login');
	}
};
exports.login = function(req, res){
  res.render('Login');
};
exports.index2 = require("./index2.js");
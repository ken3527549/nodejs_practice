exports.index2 = function(req, res){
  res.render('index', { name: 'John' });
};
exports.app2 = function(req, res){
  res.render('reactApp', { name: 'John' });
};
// The express.Router class can be used to create modular mountable route handlers. A Router instance is a complete middleware and routing system; for this reason it is often referred to as a “mini-app”.
// When express.Router() is called, a slightly different "mini app" is returned. The idea behind the "mini app" is that different routes in your app can become quite complicated, and you'd benefit from moving that logic into a separate file.
// express.Router()建立可掛載(mountable)的路由模組，Router實例是完整的中介軟體與路由系統，因此也被稱為迷你應用程式(mini-app)

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Dog GET!' });   
});
router.post('/', function(req, res) {
    res.json({ message: 'Dog POST!' });   
});

module.exports = router;

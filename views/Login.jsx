var React = require('react');
var ReactDOMServer = require('react-dom/server');


class Login extends React.Component {
  
   render() {
    return (
      <div>
        
        <div id="FBLogin" />
        <script src="/FBLogin.js"></script>
      </div>
    );
  }
}
module.exports = Login;

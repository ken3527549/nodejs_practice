var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var secretData = require('../secretData');

$(function() {
  console.log("jquery");
});
console.log(document.cookie);

class FBLogin extends React.Component {
  constructor(props) {
    super(props);
  }
   render() {
    return (
      <div>
        <h1>Login</h1>
        <a href={this.props.FBLoginAddress} target="_self">FB Login</a>
      </div>
    );
  }
}

const appId = secretData.AppID;
const scope = ['public_profile', 'email', 'user_friends'];
const myDomain = secretData.myDomain;
const facebook_oauth_url = "https://www.facebook.com/v2.10/dialog/oauth?" +
    "redirect_uri=" + myDomain + "/facebook/callback"+
    "&client_id=" + appId +
    "&scope="+ scope.join() +
    "&response_type=code";
    
ReactDOM.render(
  <FBLogin FBLoginAddress={facebook_oauth_url} />,
  document.getElementById('FBLogin')
)

if (module.hot) {
  module.hot.accept();
  module.hot.dispose();
}

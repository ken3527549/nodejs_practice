var React = require('react');
var ReactDOMServer = require('react-dom/server');

class Application extends React.Component {
	constructor(props) {
		super(props);
	}
  
   render() {
    return (
      <div>
        <h1>application</h1>
        <h2>Hello {this.props.name}!</h2>
        <div id="logout" />
        <a href="/logout" target="_self">Logout</a>
        <div id="Application" />
        <script src="/Application.js" />
      </div>
    );
  }
}
module.exports = Application;

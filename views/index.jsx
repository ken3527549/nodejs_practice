var React = require('react');
var ReactDOMServer = require('react-dom/server');

class HelloMessage extends React.Component {
  render() {

    return (
    	<div>
    		<h1>Hello {this.props.name}</h1>
    		<p id="time">Dateww</p>
          	<div id="tick" />
          	<script src="/main.js" />
    	</div>
    );
  }
}
module.exports = HelloMessage;

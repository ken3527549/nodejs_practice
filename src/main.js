var React = require('react');
var ReactDOM = require('react-dom');

class Clockclass2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  render() {
    
    return (
      <div>
        <h1>hello, world!!!!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

module.exports = function () {
	ReactDOM.render(
	  <Clockclass2 />,
	  document.getElementById('tick4')
	)
};
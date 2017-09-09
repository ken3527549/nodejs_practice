var React = require('react');
var ReactDOM = require('react-dom');

class Clockclass3 extends React.Component {
  render() {
    return (
        <h1>hello, world!</h1>
    );
  }
}
ReactDOM.render(
  <Clockclass3 />,
  document.getElementById('tick')
)

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {
    clearInterval(timer);
  });
}
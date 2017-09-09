var React = require('react');

function Welcome(props) {
  return <h1>hello {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Jerry" />
      <Welcome name="GG" />
      <Welcome name="PP" />
    </div>
  );
}
module.exports = App;

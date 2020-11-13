'use strict';

const Router = ReactRouterDOM.BrowserRouter;
const { Link, Route, Switch } = ReactRouterDOM;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Hello!</div>
    );
  }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<App/>, domContainer);
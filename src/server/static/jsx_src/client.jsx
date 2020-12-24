'use strict';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FileForm></FileForm>
    );
  }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<App/>, domContainer);
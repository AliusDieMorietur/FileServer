
const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${location.host}`);
class FileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      tab: 'upload',
      chosen: ['None'],
      token: '',
      dataList: [],
      input: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
  }

  handleChange(event) {
    const chosen = [];
    for (const file of  event.target.files) { chosen.push(file.name); };
    this.setState({ files: event.target.files, chosen });
  }

  inputChange(event) {
    console.log(event);
    console.log("3");
    this.input = event.nativeEvent.data;
    console.log(this.input);
    // value={props.input}
  }

  upload() {
    const data = new FormData();
    for (const file of this.state.files) {
      data.append('files', file, file.name)
    };

    fetch('/api/upload', {
      method: 'POST',
      body: data
    }).then(
      response => response.json()
    ).then(
      success => {
            console.log(success);
        if (success.ok) {
          this.setState({ token: success.token });
        }
      }
    ).catch(
      error => console.log(error)
    );
  }

  download() {
    console.log(1);
    fetch('/api/download', {
      method: 'POST',
      body: this.state.input
    })
    .then(
      response => {
        // response.blob().then(blob => {
        //   const newBlob = new Blob([blob]);
  
        //   const blobUrl = window.URL.createObjectURL(newBlob);
  
        //   const link = document.createElement('a');
        //   link.href = blobUrl;
        //   link.setAttribute('download', `1.txt`);
        //   document.body.appendChild(link);
        //   link.click();
        //   link.parentNode.removeChild(link);
  
        //   window.URL.revokeObjectURL(blob);
        // }); 
      }
    ).catch(
      error => console.log(error)
    );
  }

  render() {
    function Token(props) {
      if (props.token !== '') return <h1 className="form-title">Your token: { props.token }</h1>;
      else return '';
    }

    function Tab(props) {
      switch(props.tab) {
        case 'upload':
          return  <div className="upload tab">
                      <input id="files" type="file" value = { props.value } onChange = { props.change } multiple></input>
                      <Token token = { props.token } />
                      <h1 className="form-title">Chosen:</h1>
                      <ul id="file-list">
                        { props.chosen.map(el => <li>{ el }</li>) }
                      </ul>
                      <div className="buttons">
                        <label className="input-btn form-btn" for="files">Choose files</label>
                        <button className="form-btn" onClick = { props.upload }>Upload</button>
                      </div>
                  </div>
          break;
        case 'download':
          return  <div className="download tab">
                    <h1 className="form-title">Enter Token</h1>
                    <input id="token" type="text" onChange = {props.inputChange}/>
                    <h1 className="form-title">Available:</h1>
                      <ul id="file-list">
                        { props.dataList.map(el => <li>{ el }</li>) }
                      </ul>
                    <button className="form-btn" onClick = { props.download }>Download</button>
                  </div>
          break;
      }
    }

    return (
      <div className="form">
        <div className="tabs">
          <button
            className = { "tab-btn " + (this.state.tab === 'upload' ? 'active' : '') }
            onClick = { () => this.setState({ tab: 'upload' }) }>
            Upload
          </button>
          <button
            className = { "tab-btn " + (this.state.tab === 'download' ? 'active' : '') }
            onClick = { () => this.setState({ tab: 'download' }) }>
            Download
          </button>
        </div>
        <Tab
          tab = { this.state.tab }
          value = { this.state.value }
          change = { this.handleChange }
          chosen = { this.state.chosen }
          upload = { this.upload }
          download = { this.download }
          input = { this.state.input }
          inputChange = { this.inputChange }
          token = { this.state.token }
          dataList = { this.state.dataList }
        />
      </div>
    );
  }
}


const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${location.host}`);    

class FileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      tab: 'upload',
      chosen: ['None']
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const chosen = [];
    for (const file of  event.target.files) { chosen.push(file.name); };
    this.setState({ files: event.target.files, chosen });
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
      success => console.log(success)
    ).catch(
      error => console.log(error) 
    );
  }

  render() {
    function Tab(props) {
      switch(props.tab) {
        case 'upload':
          return  <div className="upload tab">
                      <input id="files" type="file" value={props.value} onChange={props.change} multiple></input>
                      <h1 className="form-title">Chosen:</h1>
                      <ul id="file-list">
                        {props.chosen.map(el => <li>{ el }</li>)}
                      </ul>
                      <div className="buttons">
                        <label className="input-btn form-btn" for="files">Choose files</label>
                        <button className="form-btn" onClick={props.upload}>Upload</button>
                      </div>
                  </div>
          break;
        case 'download':
          return  <div className="download tab">
                    <h1 className="form-title">Enter Token</h1>
                    <input id="token" type="text"/>
                    <button className="form-btn">Download</button>
                  </div>
          break;
      }
    }

    return (
      <div className="form"> 
        <div className="tabs">
          <button 
            className={"tab-btn " + (this.state.tab === 'upload' ? 'active' : '')} 
            onClick={() => this.setState({ tab: 'upload' })}>
            Upload
          </button>
          <button 
            className={"tab-btn " + (this.state.tab === 'download' ? 'active' : '')} 
            onClick={() => this.setState({ tab: 'download' })}>
            Download
          </button>
        </div>
        <Tab 
          tab={this.state.tab} 
          value={this.state.value} 
          change={this.handleChange}
          chosen={this.state.chosen}
          upload={this.upload}
        />
      </div>
    );
  }
}
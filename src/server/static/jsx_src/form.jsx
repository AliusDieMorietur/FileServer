function Tab(props) {
  let token = props.token !== '' ? <h1 className="form-title">Your token: { props.token }</h1> : '';

  let uploadTab = <div className="upload tab">
                    <input id="files" type="file" value = { props.value } onChange = { props.change } multiple></input>
                    { token }
                    <h1 className="form-title">Chosen:</h1>
                    <ul id="file-list">
                      { props.chosen.map(el => <li>{ el }</li>) }
                    </ul>
                    <div className="buttons">
                      <label className="input-btn form-btn" for="files">Choose files</label>
                      <button className="form-btn" onClick = { props.upload }>Upload</button>
                    </div>
                  </div>;

  let downloadTab = <div className="download tab">
                      <h1 className="form-title">Enter Token</h1>
                      <input id="token" type="text" value = { props.input } onChange = {props.tokenInputChange}/>
                      <h1 className="form-title">Available:</h1>
                        <ul id="file-list">
                          { props.fileList.map(el =>
                            <li>
                              <button classname="form-btn" onClick={props.fileSelect}>
                                { el }
                              </button>
                            </li>
                          ) }
                        </ul>
                      <button className="form-btn" onClick = { props.download }>Download</button>
                    </div>;

  switch(props.tab) {
    case 'upload':
      return uploadTab;
      break;
    case 'download':
      return downloadTab;
      break;
  }
}


class FileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      tab: 'upload',
      chosen: ['None'],
      token: '',
      fileSelected: '',
      dataList: [],
      input: '',
    };

    this.fileUploadChange = this.fileUploadChange.bind(this);
    this.tokenInputChange = this.tokenInputChange.bind(this);
    this.fileSelect = this.fileSelect.bind(this);
    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
  }

  fileUploadChange(event) {
    const chosen = [];
    for (const file of  event.target.files) { chosen.push(file.name); };
    this.setState({ files: event.target.files, chosen });
  }

  tokenInputChange(event) {
    this.setState({ input: event.target.value, fileSelected: '' });
  }

  fileSelect(event) {
    console.log("click!");
    console.log(event);
    this.setState({ fileSelected: event.target.innerText });
  }

  upload() {
    const data = new FormData();

    for (const file of this.state.files) {
      data.append('files', file, file.name);
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
    console.log(this.state.input);
    fetch('/api/download', {
      method: 'POST',
      body: JSON.stringify([this.state.input, this.state.fileSelected])
    })
    .then(
      response => {
        console.log('response: ', response);
        if (this.state.fileSelected == '') {
          response.json().then(data => {
            console.log('response json: ', data);
            this.setState({ dataList: data });
          });
        } else {
          response.blob().then(blob => {
            const newBlob = new Blob([blob]);

            const blobUrl = window.URL.createObjectURL(newBlob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', this.state.fileSelected);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            window.URL.revokeObjectURL(blob);
          });
        }
      }
    ).catch(
      error => console.log(error)
    );
  }

  render() {
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
          change = { this.fileUploadChange }
          chosen = { this.state.chosen }
          upload = { this.upload }
          download = { this.download }
          input = { this.state.input }
          tokenInputChange = { this.tokenInputChange }
          fileSelect = { this.fileSelect }
          token = { this.state.token }
          fileList = { this.state.dataList }
        />
      </div>
    );
  }
}

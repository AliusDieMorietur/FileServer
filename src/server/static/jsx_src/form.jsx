const downloadFile = (name, dataBlob) => {
  const newBlob = new Blob([dataBlob.data]);
  const blobUrl = window.URL.createObjectURL(newBlob);
  // TODO: probably possible to refactor that shit into proper links
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(newBlob);
};

class FileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      tab: 'upload',
      chosen: ['None'],
      token: '',
      filesSelected: [],
      dataList: [],
      input: '',
      error: ''
    };

    this.buffers = [];

    this.transport = new Transport(location.host, buffer => {
      console.log(buffer);
      this.buffers.push(buffer);
    });

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (!["constructor", "render"].includes(key)) {
        this[key] = this[key].bind(this);
      }
    }
  }

  showError(err) {     
    this.setState({ error: err });
    setTimeout(() => this.setState({ error: '' }), 5000);
  }

  fileUploadChange(event) {
    const chosen = [];
    for (const file of event.target.files) { chosen.push(file.name); };
    this.setState({ files: event.target.files, chosen });
  }

  tokenInputChange(event) {
    this.setState({ input: event.target.value, fileSelected: [], dataList: [] });
  }

  fileSelect(event) {
    if (event.target.checked) {
      this.state.filesSelected.push(event.target.id);
    } else {
      this.state.filesSelected.splice(this.state.filesSelected.indexOf(event.target.id), 1);
    }
  }

  upload() {
    this.setState({ token: 'loading...' });
    const list = [];
    for (const file of this.state.files) list.push(file.name);
    for (const file of this.state.files) this.transport.bufferCall(file);
    this.transport.socketCall('file-names', { list })
      .then(token => this.setState({ token }))
      .catch(this.showError);
  }

  getFilenames() {
    this.transport.socketCall('available-files', { token: this.state.input  })
      .then(list => {
        let dataList = Object.keys(list);
        this.setState({ dataList });
      })
      .catch(this.showError);
  }

  downloadFromLink(event) {
    this.transport.socketCall('download', { 
      token: this.state.input, 
      files: [event.target.innerText]  
    })
    .then(files => { 
      for (let i = 0; i < files.length; i++) 
        downloadFile(files[i], this.buffers[i]); 
      this.buffers = [];
    })
    .catch(this.showError);
  }

  download() {
    this.transport.socketCall('download', { 
      token: this.state.input, 
      files: this.state.dataList
    })
    .then(files => { 
      for (let i = 0; i < files.length; i++) 
        downloadFile(files[i], this.buffers[i]); 
      this.buffers = [];
    })
    .catch(this.showError);
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
          downloadFromLink = { this.downloadFromLink }
          input = { this.state.input }
          tokenInputChange = { this.tokenInputChange }
          fileSelect = { this.fileSelect }
          token = { this.state.token }
          getFilenames = { this.getFilenames }
          fileList = { this.state.dataList }
          error = { this.state.error }
        />
      </div>
    );
  }
}

const downloadFile = dataBlob => {
  const newBlob = new Blob([dataBlob.data]);

  const blobUrl = window.URL.createObjectURL(newBlob);

  // TODO: probably possible to refactor that shit into proper links
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', event.target.innerText);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);

  window.URL.revokeObjectURL(newBlob);
};

const showError = (mediator, error) => {     
  mediator.setState({ error });
  setTimeout(() => mediator.setState({ error: '' }), 5000);
}

const actions = {
  'token': (mediator, packet) => {
    const { token } = packet;
    mediator.setState({ token });
  },
  'transfer-error': mediator => showError(mediator, 'Transfer error. Try again.'),
  'non-existent-token': mediator => showError(mediator, 'Wrong token. Try again.'),
  'available-files': (mediator, packet) => {
    let { dataList } = packet;
    dataList = Object.keys(dataList);
    mediator.setState({ dataList });
  },
  'files': (mediator, packet) => {

  }
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
      error: '',
      currentFile: '',
      buffers: []
    };

    this.actions = Object
      .keys(actions)
      .reduce((acc, cur) => (acc[cur] = actions[cur].bind(this), acc),{});

    this.socket = new WebSocket('ws://' + location.host);
    this.socket.addEventListener('message', event => {
      try {
        const { data } = event;
        if (typeof data === 'string') {
          const packet = JSON.parse(data);
          const { msg } = packet;
          if (this.actions[msg]) this.actions[msg](this, packet)        
        } else {
          this.state.buffers.push(data);
        }
      } catch (err) {
        console.log(err);
      }
    });    

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (!["constructor", "render"].includes(key)) {
        this[key] = this[key].bind(this);
      }
    }
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
    this.socket.send(JSON.stringify({ msg: 'file-names', list }));
    for (const file of this.state.files) this.socket.send(file);
    this.socket.send(JSON.stringify({ msg: 'done' }));
  }

  getFilenames() {
    this.socket.send(JSON.stringify({ msg: 'available-files', token: this.state.input }));
  }

  downloadFromLink(event) {
    this.setState({ currentFile: event.target.innerText });
    this.socket.send(JSON.stringify({ 
      msg: 'download', 
      token: this.state.input, 
      file: event.target.innerText 
    }));
  }

  download() {
    this.socket.send(JSON.stringify({ 
      msg: 'download', 
      token: this.state.input,
    }));
    for (const file of this.state.dataList) {
      fetch('/api/download', {
        method: 'POST',
        body: JSON.stringify([this.state.input, file])
      }).then(response => {
        response.blob().then(blob => {
          const newBlob = new Blob([blob]);

          const blobUrl = window.URL.createObjectURL(newBlob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', file);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);

          window.URL.revokeObjectURL(blob);
        });
      }).catch(error => console.log(error));
    }
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

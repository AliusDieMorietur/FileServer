const socket = new WebSocket('ws://' + location.host);

function Tab(props) {
  let token = props.token !== '' ? <h1 className="form-title">Your token: {props.token}</h1> : '';
  let downloadButton = props.fileList.length === 0 ?
    <button className="form-btn" onClick={props.getFilenames}>Check Available</button>
    : <div>
        <h1 className="form-title">Available:</h1>
        <ul id="file-list">
          {props.fileList.map(el => <li>
            {/* <input type="checkbox" id={el} name={el} onChange = { props.fileSelect }/>
                                <label for={el}>{el}</label> */}
            <a download={el} onClick = {props.downloadFromLink}>{el}</a>
          </li>)}
        </ul>
        <button className="form-btn" onClick={props.download}>Download All</button>
      </div>;

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
                      {downloadButton}
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

const stringToArrayBuffer = s => {
  const buf = new ArrayBuffer(s.length);
  let bufView = new Uint8Array(buf);
  for (let i = 0, strLen = s.length; i < strLen; i++) {
    bufView[i] = s.charCodeAt(i);
  }
  return buf;
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
    };

    // for (const key of Object.keys(this)) {
    //   if (typeof key === function) {
    //     this[key] = key.bind(this) || key = key.bind(this) //хз как правильно
    //   }
    // }

    this.fileUploadChange = this.fileUploadChange.bind(this);
    this.tokenInputChange = this.tokenInputChange.bind(this);
    this.fileSelect = this.fileSelect.bind(this);
    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
    this.downloadFromLink = this.downloadFromLink.bind(this);
    this.getFilenames = this.getFilenames.bind(this);
  }

  fileUploadChange(event) {
    const chosen = [];
    for (const file of  event.target.files) { chosen.push(file.name); };
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
    const data = new FormData();

    socket.onmessage =  token => { this.setState({ token: token.data }); };
    socket.send(JSON.stringify(this.state.files.length));

    for (const file of this.state.files) {
      const reader = new FileReader();

      reader.addEventListener('load', event => {
        const fileBuffer = event.target.result;
        const fileBufferView = new Uint8Array(fileBuffer);
        const { name } = file;
        const nameBuffer = stringToArrayBuffer(name + '\0');
        const nameBufferView = new Uint8Array(nameBuffer);
        const newBufferLen = fileBuffer.byteLength + nameBuffer.byteLength;
        let newBuffer = new ArrayBuffer(newBufferLen);
        let newBufferView = new Uint8Array(newBuffer);

        for (let i = 0; i < nameBuffer.byteLength; i++) {
          newBufferView[i] =  nameBufferView[i];
        }

        for (let i = nameBuffer.byteLength; i < newBufferLen; i++) {
          newBufferView[i] = fileBufferView[i - nameBuffer.byteLength];
        }

        socket.send(newBuffer);
      });

      reader.readAsArrayBuffer(file);
    };
  }

  getFilenames() {
    socket.onmessage = data => {
      this.setState({ dataList: JSON.parse(data.data) });
    };

    socket.send(JSON.stringify([this.state.input]));
  }

  downloadFromLink(event) {
    socket.onmessage = dataBlob => {
      const newBlob = new Blob([dataBlob.data]);

      const blobUrl = window.URL.createObjectURL(newBlob);

      // TODO: probably possible to refactor that shit into proper links
      const link = document.createElement('a');
      // event.target.href = blobUrl;
      link.href = blobUrl;
      link.setAttribute('download', event.target.innerText);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(newBlob);
    };

    socket.send(JSON.stringify([this.state.input, event.target.innerText]));
  }

  download() {
    // socket.addEventListener('message', data => {
    //   data.data.arrayBuffer().then(data => {
    //     const bufferView = new Uint8Array(data);
    //     let nameBufferLen = 0;
    //     let name = '';

    //     for (let i = 0; i < bufferView.byteLength; i++) {
    //       if (bufferView[i] === 0) break;
    //       console.log(name);
    //       console.log(bufferView[i], String.fromCharCode(bufferView[i]));
    //       nameBufferLen++;
    //       name += String.fromCharCode(bufferView[i]);
    //     }
    //     const dataBuffer = new Uint8Array(bufferView.byteLength - nameBufferLen - 1);

    //     for (let i = nameBufferLen + 1; i < bufferView.byteLength; i++) {
    //       dataBuffer[i - nameBufferLen - 1] = bufferView[i];
    //     }

    //     const newBlob = new Blob([dataBuffer]);

    //     const blobUrl = window.URL.createObjectURL(newBlob);

    //     //probably possible to refactor that shit into proper links
    //     const link = document.createElement('a');
    //     link.href = blobUrl;
    //     link.setAttribute('download', name);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode.removeChild(link);

    //     window.URL.revokeObjectURL(blob);
    //   });
    // });

    // socket.addEventListener('message', dataBlob => {
    //   const newBlob = new Blob([dataBlob.data]);

    //   const blobUrl = window.URL.createObjectURL(newBlob);

    //   // TODO: probably possible to refactor that shit into proper links
    //   const link = document.createElement('a');
    //   // event.target.href = blobUrl;
    //   link.href = blobUrl;
    //   link.setAttribute('download', file);
    //   document.body.appendChild(link);
    //   link.click();
    //   link.parentNode.removeChild(link);

    //   window.URL.revokeObjectURL(newBlob);
    // });
    // for (const file of this.state.dataList) {
      // socket.send(JSON.stringify([this.state.input, file]));

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
        />
      </div>
    );
  }
}

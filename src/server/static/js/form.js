var _jsxFileName = 'src/server/static/jsx_src/form.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
};

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
  'files': (mediator, packet) => {}
};

let FileForm = function (_React$Component) {
  _inherits(FileForm, _React$Component);

  function FileForm(props) {
    _classCallCheck(this, FileForm);

    var _this = _possibleConstructorReturn(this, (FileForm.__proto__ || Object.getPrototypeOf(FileForm)).call(this, props));

    _this.state = {
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

    _this.actions = Object.keys(actions).reduce((acc, cur) => (acc[cur] = actions[cur].bind(_this), acc), {});

    _this.socket = new WebSocket('ws://' + location.host);
    _this.socket.addEventListener('message', event => {
      try {
        const { data } = event;
        if (typeof data === 'string') {
          const packet = JSON.parse(data);
          const { msg } = packet;
          if (_this.actions[msg]) _this.actions[msg](_this, packet);
        } else {
          _this.state.buffers.push(data);
        }
      } catch (err) {
        console.log(err);
      }
    });

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(_this))) {
      if (!["constructor", "render"].includes(key)) {
        _this[key] = _this[key].bind(_this);
      }
    }
    return _this;
  }

  _createClass(FileForm, [{
    key: 'fileUploadChange',
    value: function fileUploadChange(event) {
      const chosen = [];
      for (const file of event.target.files) {
        chosen.push(file.name);
      };
      this.setState({ files: event.target.files, chosen });
    }
  }, {
    key: 'tokenInputChange',
    value: function tokenInputChange(event) {
      this.setState({ input: event.target.value, fileSelected: [], dataList: [] });
    }
  }, {
    key: 'fileSelect',
    value: function fileSelect(event) {
      if (event.target.checked) {
        this.state.filesSelected.push(event.target.id);
      } else {
        this.state.filesSelected.splice(this.state.filesSelected.indexOf(event.target.id), 1);
      }
    }
  }, {
    key: 'upload',
    value: function upload() {
      this.setState({ token: 'loading...' });
      const list = [];
      for (const file of this.state.files) list.push(file.name);
      this.socket.send(JSON.stringify({ msg: 'file-names', list }));
      for (const file of this.state.files) this.socket.send(file);
      this.socket.send(JSON.stringify({ msg: 'done' }));
    }
  }, {
    key: 'getFilenames',
    value: function getFilenames() {
      this.socket.send(JSON.stringify({ msg: 'available-files', token: this.state.input }));
    }
  }, {
    key: 'downloadFromLink',
    value: function downloadFromLink(event) {
      this.setState({ currentFile: event.target.innerText });
      this.socket.send(JSON.stringify({
        msg: 'download',
        token: this.state.input,
        file: event.target.innerText
      }));
    }
  }, {
    key: 'download',
    value: function download() {
      this.socket.send(JSON.stringify({
        msg: 'download',
        token: this.state.input
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
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'form', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 152
          }
        },
        React.createElement(
          'div',
          { className: 'tabs', __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 153
            }
          },
          React.createElement(
            'button',
            {
              className: "tab-btn " + (this.state.tab === 'upload' ? 'active' : ''),
              onClick: () => this.setState({ tab: 'upload' }), __self: this,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 154
              }
            },
            'Upload'
          ),
          React.createElement(
            'button',
            {
              className: "tab-btn " + (this.state.tab === 'download' ? 'active' : ''),
              onClick: () => this.setState({ tab: 'download' }), __self: this,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 159
              }
            },
            'Download'
          )
        ),
        React.createElement(Tab, {
          tab: this.state.tab,
          value: this.state.value,
          change: this.fileUploadChange,
          chosen: this.state.chosen,
          upload: this.upload,
          download: this.download,
          downloadFromLink: this.downloadFromLink,
          input: this.state.input,
          tokenInputChange: this.tokenInputChange,
          fileSelect: this.fileSelect,
          token: this.state.token,
          getFilenames: this.getFilenames,
          fileList: this.state.dataList,
          error: this.state.error,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 165
          }
        })
      );
    }
  }]);

  return FileForm;
}(React.Component);
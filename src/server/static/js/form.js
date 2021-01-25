var _jsxFileName = 'src/server/static/jsx_src/form.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      error: ''
    };

    _this.timer = null;
    _this.buffers = [];

    _this.transport = new Transport(location.host, buffer => {
      _this.buffers.push(buffer);
    });

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(_this))) {
      if (!["constructor", "render"].includes(key)) {
        _this[key] = _this[key].bind(_this);
      }
    }
    return _this;
  }

  _createClass(FileForm, [{
    key: 'showError',
    value: function showError(err) {
      this.setState({ error: err.message });
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.setState({ error: '' }), 5000);
    }
  }, {
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
      if (this.state.chosen.length === 1 && this.state.chosen[0] === 'None') {
        this.showError(new Error('Nothing selected. Select, then upload'));
        return;
      };
      this.setState({ token: 'loading...' });
      const list = [];
      for (const file of this.state.files) list.push(file.name);
      for (const file of this.state.files) this.transport.bufferCall(file);
      this.transport.socketCall('upload', { list }).then(token => this.setState({ token })).catch(this.showError);
    }
  }, {
    key: 'getFilenames',
    value: function getFilenames() {
      if (this.state.input.length === 0) {
        this.showError(new Error('Enter valid token please'));
        return;
      };
      this.transport.socketCall('available-files', { token: this.state.input }).then(dataList => this.setState({ dataList })).catch(this.showError);
    }
  }, {
    key: 'download',
    value: function download(event) {
      const files = event.target.innerText === 'Download All' ? this.state.dataList : [event.target.innerText];
      this.transport.socketCall('download', {
        token: this.state.input.trim(),
        files
      }).then(files => {
        for (let i = 0; i < files.length; i++) downloadFile(files[i], this.buffers[i]);
        this.buffers = [];
      }).catch(this.showError);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'form', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 108
          }
        },
        React.createElement(
          'div',
          { className: 'tabs', __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 109
            }
          },
          React.createElement(
            'button',
            {
              className: "tab-btn " + (this.state.tab === 'upload' ? 'active' : ''),
              onClick: () => this.setState({ tab: 'upload' }), __self: this,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 110
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
                lineNumber: 115
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
            lineNumber: 121
          }
        }),
        React.createElement(
          'h1',
          { className: 'error-box', __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 136
            }
          },
          this.state.error
        )
      );
    }
  }]);

  return FileForm;
}(React.Component);
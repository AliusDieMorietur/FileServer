var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsxFileName = 'src\\server\\static\\jsx_src\\form.jsx';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const socket = new WebSocket('ws://' + location.host);

function Tab(props) {
  let token = props.token !== '' ? React.createElement(
    'h1',
    { className: 'form-title', __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 4
      }
    },
    'Your token: ',
    props.token
  ) : '';
  let downloadButton = props.fileList.length === 0 ? React.createElement(
    'button',
    { className: 'form-btn', onClick: props.getFilenames, __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 6
      }
    },
    'Check Available'
  ) : React.createElement(
    'div',
    { className: 'available', __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    },
    React.createElement(
      'h1',
      { className: 'form-title', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      },
      'Available:'
    ),
    React.createElement(
      'ul',
      { id: 'file-list', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      },
      props.fileList.map(el => React.createElement(
        'li',
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 11
          }
        },
        React.createElement(
          'a',
          { download: el, onClick: props.downloadFromLink, __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 12
            }
          },
          el
        )
      ))
    ),
    React.createElement(
      'button',
      { className: 'form-btn', onClick: props.download, __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 16
        }
      },
      'Download All'
    )
  );

  let uploadTab = React.createElement(
    'div',
    { className: 'upload tab', __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19
      }
    },
    React.createElement('input', { id: 'files', type: 'file', value: props.value, onChange: props.change, multiple: true, __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      }
    }),
    token,
    React.createElement(
      'h1',
      { className: 'form-title', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 22
        }
      },
      'Chosen:'
    ),
    React.createElement(
      'ul',
      { id: 'file-list', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 23
        }
      },
      props.chosen.map(el => React.createElement(
        'li',
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          }
        },
        el
      ))
    ),
    React.createElement(
      'div',
      { className: 'buttons', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 26
        }
      },
      React.createElement(
        'label',
        { className: 'input-btn form-btn', 'for': 'files', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          }
        },
        'Choose files'
      ),
      React.createElement(
        'button',
        { className: 'form-btn', onClick: props.upload, __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 28
          }
        },
        'Upload'
      )
    )
  );

  let downloadTab = React.createElement(
    'div',
    { className: 'download tab', __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 32
      }
    },
    React.createElement(
      'h1',
      { className: 'form-title', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        }
      },
      'Enter Token'
    ),
    React.createElement('input', { id: 'token', type: 'text', value: props.input, onChange: props.tokenInputChange, __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      }
    }),
    downloadButton
  );

  switch (props.tab) {
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
      input: ''
    };

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
      socket.onmessage = token => {
        this.setState({ token: token.data });
      };
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
            newBufferView[i] = nameBufferView[i];
          }

          for (let i = nameBuffer.byteLength; i < newBufferLen; i++) {
            newBufferView[i] = fileBufferView[i - nameBuffer.byteLength];
          }

          socket.send(newBuffer);
        });

        reader.readAsArrayBuffer(file);
      };
    }
  }, {
    key: 'getFilenames',
    value: function getFilenames() {
      socket.onmessage = data => {
        this.setState({ dataList: JSON.parse(data.data) });
      };

      socket.send(JSON.stringify([this.state.input]));
    }
  }, {
    key: 'downloadFromLink',
    value: function downloadFromLink(event) {
      socket.onmessage = dataBlob => {
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

      socket.send(JSON.stringify([this.state.input, event.target.innerText]));
    }
  }, {
    key: 'download',
    value: function download() {

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
            lineNumber: 183
          }
        },
        React.createElement(
          'div',
          { className: 'tabs', __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 184
            }
          },
          React.createElement(
            'button',
            {
              className: "tab-btn " + (this.state.tab === 'upload' ? 'active' : ''),
              onClick: () => this.setState({ tab: 'upload' }), __self: this,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 185
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
                lineNumber: 190
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
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 196
          }
        })
      );
    }
  }]);

  return FileForm;
}(React.Component);
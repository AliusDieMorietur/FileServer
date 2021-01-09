var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsxFileName = 'src\\server\\static\\jsx_src\\form.jsx';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Tab(props) {
  let token = props.token !== '' ? React.createElement(
    'h1',
    { className: 'form-title', __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 2
      }
    },
    'Your token: ',
    props.token
  ) : '';

  let uploadTab = React.createElement(
    'div',
    { className: 'upload tab', __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 4
      }
    },
    React.createElement('input', { id: 'files', type: 'file', value: props.value, onChange: props.change, multiple: true, __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      }
    }),
    token,
    React.createElement(
      'h1',
      { className: 'form-title', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        }
      },
      'Chosen:'
    ),
    React.createElement(
      'ul',
      { id: 'file-list', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      },
      props.chosen.map(el => React.createElement(
        'li',
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 9
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
          lineNumber: 11
        }
      },
      React.createElement(
        'label',
        { className: 'input-btn form-btn', 'for': 'files', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 12
          }
        },
        'Choose files'
      ),
      React.createElement(
        'button',
        { className: 'form-btn', onClick: props.upload, __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 13
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
        lineNumber: 17
      }
    },
    React.createElement(
      'h1',
      { className: 'form-title', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      },
      'Enter Token'
    ),
    React.createElement('input', { id: 'token', type: 'text', value: props.input, onChange: props.tokenInputChange, __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19
      }
    }),
    React.createElement(
      'h1',
      { className: 'form-title', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 20
        }
      },
      'Available:'
    ),
    React.createElement(
      'ul',
      { id: 'file-list', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        }
      },
      props.fileList.map(el => React.createElement(
        'li',
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        },
        React.createElement('input', { type: 'checkbox', id: el, name: el, onChange: props.fileSelect, __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 25
          }
        }),
        React.createElement(
          'label',
          { 'for': el, __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 26
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
          lineNumber: 30
        }
      },
      'Download'
    )
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

    _this.fileUploadChange = _this.fileUploadChange.bind(_this);
    _this.tokenInputChange = _this.tokenInputChange.bind(_this);
    _this.fileSelect = _this.fileSelect.bind(_this);
    _this.upload = _this.upload.bind(_this);
    _this.download = _this.download.bind(_this);
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
      this.setState({ input: event.target.value, fileSelected: [] });
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
      const data = new FormData();

      const socket = new WebSocket('ws://' + location.host);
      socket.addEventListener('open', () => {
        for (const file of this.state.files) {
          const reader = new FileReader();

          reader.onload = event => {
            console.log(1, event.target.result);
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

            console.log(2, newBuffer);

            socket.send(newBuffer);
          };

          reader.readAsArrayBuffer(file);
          // console.log(file);
          // data.append('files', file, file.name);
        };
      });

      // fetch('/api/upload', {
      //   method: 'POST',
      //   body: data
      // }).then(
      //   response => response.json()
      // ).then(
      //   success => {
      //     console.log(success);
      //     if (success.ok) {
      //       this.setState({ token: success.token });
      //     }
      //   }
      // ).catch(
      //   error => console.log(error)
      // );
    }
  }, {
    key: 'download',
    value: function download() {
      if (this.state.filesSelected.length === 0) {
        fetch('/api/download', {
          method: 'POST',
          body: JSON.stringify([this.state.input, ''])
        }).then(response => {
          console.log('response: ', response);
          response.json().then(data => {
            console.log('response json: ', data);
            this.setState({ dataList: data });
          });
        }).catch(error => console.log(error));
      } else {
        for (const file of this.state.filesSelected) {
          fetch('/api/download', {
            method: 'POST',
            body: JSON.stringify([this.state.input, file])
          }).then(response => {
            console.log('response: ', response);

            response.blob().then(blob => {
              const newBlob = new Blob([blob]);

              const blobUrl = window.URL.createObjectURL(newBlob);

              //probably possible to refactor that shit into proper links
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
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'form', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 198
          }
        },
        React.createElement(
          'div',
          { className: 'tabs', __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 199
            }
          },
          React.createElement(
            'button',
            {
              className: "tab-btn " + (this.state.tab === 'upload' ? 'active' : ''),
              onClick: () => this.setState({ tab: 'upload' }), __self: this,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 200
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
                lineNumber: 205
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
          fileList: this.state.dataList,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 211
          }
        })
      );
    }
  }]);

  return FileForm;
}(React.Component);
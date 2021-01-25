var _jsxFileName = 'src/server/static/jsx_src/tabulator.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let Tab = function (_React$Component) {
	_inherits(Tab, _React$Component);

	function Tab(props) {
		_classCallCheck(this, Tab);

		var _this = _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(Tab, [{
		key: 'render',
		value: function render() {
			let token = this.props.token !== '' ? React.createElement(
				'h1',
				{ className: 'form-title', __self: this,
					__source: {
						fileName: _jsxFileName,
						lineNumber: 8
					}
				},
				'Your token: ',
				this.props.token
			) : '';
			let downloadButton = this.props.fileList.length === 0 ? React.createElement(
				'button',
				{ className: 'form-btn', onClick: this.props.getFilenames, __self: this,
					__source: {
						fileName: _jsxFileName,
						lineNumber: 10
					}
				},
				'Check Available'
			) : React.createElement(
				'div',
				{ className: 'available', __self: this,
					__source: {
						fileName: _jsxFileName,
						lineNumber: 11
					}
				},
				React.createElement(
					'h1',
					{ className: 'form-title', __self: this,
						__source: {
							fileName: _jsxFileName,
							lineNumber: 12
						}
					},
					'Available:'
				),
				React.createElement(
					'ul',
					{ id: 'file-list', __self: this,
						__source: {
							fileName: _jsxFileName,
							lineNumber: 13
						}
					},
					this.props.fileList.map(el => React.createElement(
						'li',
						{
							__self: this,
							__source: {
								fileName: _jsxFileName,
								lineNumber: 15
							}
						},
						React.createElement(
							'a',
							{ download: el, onClick: this.props.download, __self: this,
								__source: {
									fileName: _jsxFileName,
									lineNumber: 16
								}
							},
							el
						)
					))
				),
				React.createElement(
					'button',
					{ className: 'form-btn', onClick: this.props.download, __self: this,
						__source: {
							fileName: _jsxFileName,
							lineNumber: 20
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
						lineNumber: 23
					}
				},
				React.createElement('input', { id: 'files', type: 'file', value: this.props.value, onChange: this.props.change, multiple: true, __self: this,
					__source: {
						fileName: _jsxFileName,
						lineNumber: 24
					}
				}),
				token,
				React.createElement(
					'h1',
					{ className: 'form-title', __self: this,
						__source: {
							fileName: _jsxFileName,
							lineNumber: 26
						}
					},
					'Chosen:'
				),
				React.createElement(
					'ul',
					{ id: 'file-list', __self: this,
						__source: {
							fileName: _jsxFileName,
							lineNumber: 27
						}
					},
					this.props.chosen.map(el => React.createElement(
						'li',
						{
							__self: this,
							__source: {
								fileName: _jsxFileName,
								lineNumber: 28
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
							lineNumber: 30
						}
					},
					React.createElement(
						'label',
						{ className: 'input-btn form-btn', 'for': 'files', __self: this,
							__source: {
								fileName: _jsxFileName,
								lineNumber: 31
							}
						},
						'Choose files'
					),
					React.createElement(
						'button',
						{ className: 'form-btn', onClick: this.props.upload, __self: this,
							__source: {
								fileName: _jsxFileName,
								lineNumber: 32
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
						lineNumber: 36
					}
				},
				React.createElement(
					'h1',
					{ className: 'form-title', __self: this,
						__source: {
							fileName: _jsxFileName,
							lineNumber: 37
						}
					},
					'Enter Token'
				),
				React.createElement('input', { id: 'token', type: 'text', value: this.props.input, onChange: this.props.tokenInputChange, __self: this,
					__source: {
						fileName: _jsxFileName,
						lineNumber: 38
					}
				}),
				downloadButton
			);

			return React.createElement(
				'div',
				{ className: 'tabulator', __self: this,
					__source: {
						fileName: _jsxFileName,
						lineNumber: 42
					}
				},
				this.props.tab === 'upload' ? uploadTab : downloadTab
			);
		}
	}]);

	return Tab;
}(React.Component);
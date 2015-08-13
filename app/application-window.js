'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Menu = require('menu'),
    app = require('app'),
    fs = require('fs'),
    ipc = require('ipc'),
    path = require('path'),
    os = require('os'),
    net = require('net'),
    url = require('url'),
    EventEmitter = require('events').EventEmitter,
    BrowserWindow = require('browser-window'),
    _ = require('underscore-plus');

var AppWindow = (function (_EventEmitter) {
    _inherits(AppWindow, _EventEmitter);

    function AppWindow(options) {
        _classCallCheck(this, AppWindow);

        _get(Object.getPrototypeOf(AppWindow.prototype), 'constructor', this).call(this);

        var ref, windowOpts;

        this.loadSettings = {
            bootstrapScript: require.resolve('../renderer/main')
        };

        this.loadSettings = _.extend(this.loadSettings, options);

        windowOpts = {
            width: 800,
            height: 600,
            title: (ref = options.title) != null ? ref : "You Should Set options.title",
            'web-preferences': {
                'subpixel-font-scaling': true,
                'direct-write': true
            }
        };
        windowOpts = _.extend(windowOpts, this.loadSettings);

        this.window = new BrowserWindow(windowOpts);

        this.window.on('closed', (function (_this) {
            return function (e) {
                return _this.emit('closed', e);
            };
        })(this));

        this.window.on('devtools-opened', (function (_this) {
            return function (e) {
                return _this.window.webContents.send('window:toggle-dev-tools', true);
            };
        })(this));

        this.window.on('devtools-closed', (function (_this) {

            return function (e) {
                return _this.window.webContents.send('window:toggle-dev-tools', false);
            };
        })(this));
    }

    _createClass(AppWindow, [{
        key: 'show',
        value: function show() {
            console.log("Show func : " + __dirname);
            //var targetPath = path.resolve(__dirname, '..', '..', 'static', 'index.html');
            var targetPath = path.resolve(__dirname, '..', 'src', 'browser', 'index.html');
            var targetUrl = url.format({
                protocol: 'file',
                pathname: targetPath,
                slashes: true,
                query: {
                    loadSettings: JSON.stringify(this.loadSettings)
                }
            });

            this.window.loadUrl(targetUrl);

            this.window.show();
        }
    }, {
        key: 'reload',
        value: function reload() {
            this.window.webContents.reload();
        }
    }, {
        key: 'toggleFullScreen',
        value: function toggleFullScreen() {
            this.window.setFullScreen(!this.window.isFullScreen());
        }
    }, {
        key: 'toggleDevTools',
        value: function toggleDevTools() {
            this.window.toggleDevTools();
        }
    }, {
        key: 'close',
        value: function close() {
            this.window.close();
            this.window = null;
        }
    }]);

    return AppWindow;
})(EventEmitter);

module.exports = AppWindow;
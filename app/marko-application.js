'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Menu = require('menu'),
    BrowserWindow = require('browser-window'),
    Dialog = require('dialog'),
    app = require('app'),
    fs = require('fs-plus'),
    ipc = require('ipc'),
    path = require('path'),
    os = require('os'),
    net = require('net'),
    url = require('url'),
    spawn = require('child_process'),
    events = require('events'),
    _ = require('underscore-plus');

var ApplicationMenu = require('./application-menu'),
    AppWindow = require('./application-window');

var Application = (function (_events$EventEmitter) {
    _inherits(Application, _events$EventEmitter);

    function Application(options) {
        _classCallCheck(this, Application);

        _get(Object.getPrototypeOf(Application.prototype), 'constructor', this).call(this);

        this.resourcePath = options.resourcePath;
        this.devMode = options.devMode;
        this.pkgJson = require('../package.json');
        this.windows = [];

        app.on('window-all-closed', function () {
            // Todo : Add Darwin stuff
        });

        var ref;
        if ((ref = process.platform) === 'win32' || ref === 'linux') {
            return app.quit();
        }

        //return this.openWithOptions(options);
        this.openWithOptions(options);
    }

    _createClass(Application, [{
        key: 'openWithOptions',
        value: function openWithOptions(options) {

            var newWindow, test;

            test = options.test;

            if (test) {
                newWindow = this.openSpecsWindow(options);
                console.log("specWindow");
            } else {
                newWindow = this.openWindow(options);
                console.log("normalWindow");
            }

            newWindow.show();
            this.windows.push(newWindow);
            console.log("Push window to windows array " + this.windows.length);

            var _this = this;
            newWindow.on('closed', function () {
                _this.removeAppWindow(newWindow);
            });

            return newWindow;
        }
    }, {
        key: 'openSpecsWindow',
        value: function openSpecsWindow(arg) {
            var bootstrapScript, devMode, error, exitWhenDone, isSpec, logFile, resourcePath;

            exitWhenDone = arg.exitWhenDone;
            resourcePath = arg.resourcePath;
            logFile = arg.logFile;

            if (resourcePath !== this.resourcePath && !fs.existsSync(resourcePath)) {
                resourcePath = this.resourcePath;
            }
            try {
                bootstrapScript = require.resolve(path.resolve(resourcePath, 'spec', 'spec-bootstrap'));
            } catch (_error) {
                error = _error;
                bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'spec-bootstrap'));
            }
            isSpec = true;
            devMode = true;

            return new AppWindow({
                bootstrapScript: bootstrapScript,
                exitWhenDone: exitWhenDone,
                resourcePath: resourcePath,
                isSpec: isSpec,
                devMode: devMode,
                logFile: logFile
            });
        }
    }, {
        key: 'openWindow',
        value: function openWindow(options) {

            var appWindow = new AppWindow(options);

            this.menu = new ApplicationMenu({
                pkg: this.pkgJson
            });

            this.menu.attachToWindow(appWindow);

            this.menu.on('application:quit', function () {
                return app.quit();
            });

            this.menu.on('window:reload', function () {
                return BrowserWindow.getFocusedWindow().reload();
            });

            this.menu.on('window:toggle-full-screen', function () {

                var focusedWindow = BrowserWindow.getFocusedWindow();
                var fullScreen = true;

                if (focusedWindow.isFullScreen()) {
                    fullScreen = false;
                }

                return focusedWindow.setFullScreen(fullScreen);
            });

            this.menu.on('window:toggle-dev-tools', function () {
                return BrowserWindow.getFocusedWindow().toggleDevTools();
            });

            this.menu.on('application:run-specs', (function (_this) {
                return function () {
                    return _this.openWithOptions({
                        test: true
                    });
                };
            })(this));

            var _this = this;
            this.menu.on('application:new-file', function () {
                _this.openWithOptions(options);
            });

            this.menu.on('application:open-file', function () {
                _this.openFile(options);
            });

            return appWindow;
        }
    }, {
        key: 'removeAppWindow',
        value: function removeAppWindow(appWindow) {
            var i, idx, len, ref, results, w;
            ref = this.windows;
            results = [];
            for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
                w = ref[idx];
                if (w === appWindow) {
                    results.push(this.windows.splice(idx, 1));
                }
            }
            console.log("Remove window from windows array " + this.windows.length);
            return results;
        }
    }, {
        key: 'openFile',
        value: function openFile(options) {

            var dialogOptions = {
                title: 'OpenFileTitle',
                properties: ['openFile', 'openDirectory', 'multiSelections']
            };
            var _this = this;
            Dialog.showOpenDialog(dialogOptions, function (files) {
                fs.readFile(files[0], 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    } else {

                        options.mddoc = {
                            path: files[0],
                            content: data
                        };

                        // Open new window with options.mddoc
                        _this.openWithOptions(options);
                        // Clear mddoc so new windows don't load with mmdoc
                        options.mddoc = null;
                    }
                });
            });
        }

        // End Class
    }]);

    return Application;
})(events.EventEmitter);

module.exports = Application;
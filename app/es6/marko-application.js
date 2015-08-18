'use strict';

let
    Menu = require('menu'),
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

let
    ApplicationMenu = require('./application-menu'),
    AppWindow = require('./application-window');


class Application extends events.EventEmitter {

    constructor(options) {
        super();

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

    openWithOptions(options) {

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


    openSpecsWindow(arg) {
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

    openWindow(options) {

        var appWindow = new AppWindow(options);

        this.menu = new ApplicationMenu({
            pkg: this.pkgJson
        });

        this.menu.attachToWindow(appWindow);

        this.menu.on('application:quit', function() {
            return app.quit();
        });

        this.menu.on('window:reload', function() {
            return BrowserWindow.getFocusedWindow().reload();
        });

        this.menu.on('window:toggle-full-screen', function() {

            var focusedWindow = BrowserWindow.getFocusedWindow();
            var fullScreen = true;

            if (focusedWindow.isFullScreen()) {
                fullScreen = false;
            }

            return focusedWindow.setFullScreen(fullScreen);
        });

        this.menu.on('window:toggle-dev-tools', function() {
            return BrowserWindow.getFocusedWindow().toggleDevTools();
        });


        this.menu.on('application:run-specs', (function(_this) {
            return function() {
                return _this.openWithOptions({
                    test: true
                });
            };
        })(this));

        /** Menu events **/
        var _this = this;
        this.menu.on('application:new-file', function() {
            _this.openWithOptions(options)
        });

        this.menu.on('application:open-file', function() {
            _this.openFile(options)
        });
        this.menu.on('application:save-file', function() {
            _this.saveFile(options)
        });

        return appWindow;
    }

    removeAppWindow(appWindow) {
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

    openFile(options) {

        var dialogOptions = {
            title: 'OpenFileDialog',
            properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
        };
        var _this = this;
        Dialog.showOpenDialog(dialogOptions, function(files){
            fs.readFile(files[0], 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                } else {

                    options.bufferdoc = {
                        path: files[0],
                        content: data
                    };

                    // Open new window with options.mddoc
                    _this.openWithOptions(options);

                    // Clear buffer doc so new windows don't load with previously opened doc
                    options.bufferdoc = null;
                }

            });
        });
    }

    saveFile(options) {

        var focusedWindow = BrowserWindow.getFocusedWindow();

        console.log("-----------------------");
        console.log(focusedWindow.bufferdoc);
        console.log("-----------------------");

        var dialogOptions = {
            title: 'SaveFileDialog'
        };
        var _this = this;
        Dialog.showSaveDialog(dialogOptions, function(files){
            console.log('---- Save ----');

        });
    }


// End Class
}

module.exports = Application;
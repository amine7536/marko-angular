'use strict';

let
    Menu = require('menu'),
    BrowserWindow = require('browser-window'),
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

        this.handleEvents(options);


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
        console.log("Push window to window array " + this.windows.length);


        /*var _this = this;*/
        newWindow.on('closed', (function (_this) {
            _this.removeAppWindow(newWindow);
            console.log("remove window from window array " + _this.windows.length);
        })(this));


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
        var appWindow;

        appWindow = new AppWindow(options);

        this.menu = new ApplicationMenu({
            pkg: this.pkgJson
        });


        console.log(appWindow.constructor.name);
        console.log("this.menu : " + this.menu.constructor.name);


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

        /*this.menu.on('application:new-file', function(){
            console.log("TTTTTTTTTTTTTT ------ application:new-file trapped");
            this.openWithOptions(options);
        });*/

        /*this.menu.on('application:new-file', (function(_this) {
            console.log("TTTTTTTTTTTTTT ------ application:new-file trapped");
            console.log(_this.windows.constructor.name);

            return function() {
                return _this.openWithOptions({
                    test: false
                });
            };
        })(this));*/

        this.menu.on('application:run-specs', (function(_this) {
            return function() {
                return _this.openWithOptions({
                    test: true
                });
            };
        })(this));

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
        return results;
    }

    handleEvents(options) {
/*        var _this = this;
        console.log("handleEvents: " + this.constructor.name);
        this.on('application:new-file', function() {
            console.log("TTTTTTTTTTTTTTTTTTTTTTT");
            _this.openWindow(options);
        });*/

        console.log("handleEvents: " + this.constructor.name);

        this.on('application:new-file', (function(_this) {
            console.log("TTTTTTTTTTTTTT ------ application:new-file trapped");
            console.log(_this.windows.constructor.name);

            return function() {
                return _this.openWithOptions({
                    test: false
                });
            };
        })(this));



    }


// End Class
}

module.exports = Application;
'use strict';

let
    Menu = require('menu'),
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

class AppWindow extends EventEmitter {

    constructor(options) {
        super();

        var ref, windowOpts;

        this.loadSettings = {
            bootstrapScript: require.resolve('../renderer/main')
        };

        this.loadSettings = _.extend(this.loadSettings, options);

        windowOpts = {
            width: 800,
            height: 600,
            title: 'Marko',
            'web-preferences': {
                'subpixel-font-scaling': true,
                'direct-write': true
            }
        };
        windowOpts = _.extend(windowOpts, this.loadSettings);

        this.window = new BrowserWindow(windowOpts);

        // Attached Markdonw Document to BrowserWindow
        this.window.mddoc = options.mddoc;

        this.window.on('closed', (function(_this) {
            return function(e) {
                return _this.emit('closed', e);
            };
        })(this));

        this.window.on('devtools-opened', (function(_this) {
            return function(e) {
                return _this.window.webContents.send('window:toggle-dev-tools', true);
            };
        })(this));

        this.window.on('devtools-closed', (function(_this) {

            return function(e) {
                return _this.window.webContents.send('window:toggle-dev-tools', false);
            };
        })(this));
    }

    show(){
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

    reload() {
        this.window.webContents.reload();
    }

    toggleFullScreen() {
        this.window.setFullScreen(!this.window.isFullScreen());
    }

    toggleDevTools() {
        this.window.toggleDevTools();
    }

    close() {
        this.window.close();
        this.window = null;
    }
}

module.exports = AppWindow;
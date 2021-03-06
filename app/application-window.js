'use strict';

let Menu = require('menu'),
    app = require('app'),

//fs = require('fs'),
//ipc = require('ipc'),
path = require('path'),

//os = require('os'),
//net = require('net'),
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
            },
            preload: require.resolve('../renderer/preload')
        };
        windowOpts = _.extend(windowOpts, this.loadSettings);

        /** Init BrowserWindow with provided options **/
        this.window = new BrowserWindow(windowOpts);

        // Open the DevTools.
        // this.window.openDevTools();

        /**
         *  Attached Markdown Buffer Document to BrowserWindow
         *  If options.bufferdoc exists from openfile add it to currentWindow
         *  or initialize empty buffer vars
         * **/
        if (options.bufferdoc != null) {
            this.window.bufferdoc = options.bufferdoc;
        } else {
            this.window.bufferdoc = {
                path: '',
                content: ''
            };
        }

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

    show() {
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
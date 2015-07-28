'use strict';

var ApplicationMenu = undefined,
    markoApplication = undefined,
    MarkoWindow = undefined,
    BrowserWindow = undefined,
    Menu = undefined,
    app = undefined;

//MarkoWindow = require('./marko-window');
ApplicationMenu = require('./application-menu.es6');
BrowserWindow = require('browser-window');
Menu = require('menu');
app = require('app');

var MarkoApplication = {

    init: function () {

        this.options = {};
        this.windows = [];

        global.markoApplication = this;
        this.applicationsMenu = ApplicationMenu.createMenu();
    },

    open: function(options) {
        var mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        });

        mainWindow.loadUrl('file://' + __dirname + '/../src/browser/index.html');

            // Open the devtools.
        mainWindow.openDevTools();

        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    }

};

module.exports = MarkoApplication;
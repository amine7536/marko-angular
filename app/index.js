'use strict';

var app, crashReporter, fs, nslog, parseCommandLine, path, ref, setupCrashReporter, start, url, yargs;

global.shellStartTime = Date.now();

crashReporter = require('crash-reporter');
app           = require('app');
fs            = require('fs-plus');
path          = require('path');
yargs         = require('yargs');
url           = require('url');
nslog         = require('nslog');
console.log   = nslog;

process.on('uncaughtException', function(error) {
    if (error == null) {
        error = {};
    }
    if (error.message != null) {
        nslog(error.message);
    }
    if (error.stack != null) {
        return nslog(error.stack);
    }
});


var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

start = function() {

    app.on('will-finish-launching', function() {
        return setupCrashReporter();
    });

    return app.on('ready', function() {

        var MarkoApplication;
        MarkoApplication = require('./marko-application.es6');
        MarkoApplication.init();
        MarkoApplication.open();
    });
};


setupCrashReporter = function() {
    return crashReporter.start({
        productName: 'Marko',
        companyName: 'in.Spirr.me'
    });
};


start();


/*
 app.on('window-all-closed', () => {
 if (process.platform != 'darwin') {
 app.quit();
 }
 });

 app.on('ready', () => {
 mainWindow = new BrowserWindow({
 width: 800,
 height: 600
 });
 mainWindow.loadUrl('file://' + __dirname + '/../src/browser/index.html');

 // Open the devtools.
 mainWindow.openDevTools();

 mainWindow.on('closed', () => {
 mainWindow = null;
 });
 });*/

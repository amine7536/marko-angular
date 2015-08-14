'use strict';


/*
angular.module("myModule", [])
    .factory("Canvas", ["$q", function(q) {
        Canvas.prototype.q = q;
        return Canvas;
    }]);

var Canvas = function(element, options) {
    console.log(this instanceof Canvas, typeof this.q !== "undefined");
};
*/

/**

 Wrap BrowserWindow into an angular service

 **/
class CoreService {
    constructor() {

        /** Get Reference to current BrowserWindow **/
        var remote = require('remote');
        this.browserWindow = remote.getCurrentWindow();

    }

    getBrowserWindow() {
        return this.browserWindow;
    }
}

CoreService.$inject = [];

export { CoreService };
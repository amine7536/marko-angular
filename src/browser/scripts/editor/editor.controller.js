'use strict';

class EditorCtrl {
    constructor($scope, $window, coreService) {
        this.electronVersion = process.versions['electron'];
        console.log(this.electronVersion);

        var browserWindow = coreService.browserWindow;

        $scope.editorOptions = {
            theme: 'cobalt',
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            lineNumbers: true,
            lineWrapping: true,
            viewportMargin: 10,
            mode: 'markdown'
        };


        this.codemirrorLoaded = function (_editor) {
            // Editor part
            var _doc = _editor.getDoc();
            _editor.focus();

            /** Load Markdown Document if attached to window **/
            if(browserWindow.mddoc) {
                _doc.setValue(browserWindow.mddoc.content);
            }


            /* Handle sizing */
            _editor.setSize('100%', $window.innerHeight);
            $scope.$on('resize::resize', function() {
                _editor.setSize('100%', $window.innerHeight);
            });

            // requestAnim shim layer by Paul Irish
            // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
            $window.requestAnimFrame = (function () {
                return $window.requestAnimationFrame ||
                    $window.webkitRequestAnimationFrame ||
                    $window.mozRequestAnimationFrame ||
                    $window.oRequestAnimationFrame ||
                    $window.msRequestAnimationFrame ||
                    function (/* function */ callback, /* DOMElement */ element) {
                        $window.setTimeout(callback, 1000 / 60);
                    };
            })();

            var scroll = function (scrollTop) {
                angular.element("#out").scrollTop(scrollTop);
            };

            var animate = function(){};
            var smoothScroll = function () {
                window.requestAnimationFrame(animate);
                scroll(angular.element(".CodeMirror-vscrollbar").scrollTop())
            };

            _editor.on('scroll', function () {
                smoothScroll();
            });


            // Options
            //_editor.setOption('theme', 'cobalt');
            _doc.markClean()

        };


    }
}

EditorCtrl.$inject = ['$scope','$window', 'coreService'];

export { EditorCtrl };
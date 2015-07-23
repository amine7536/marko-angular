'use strict';
import template from './editor.template.html!text'

var EditorRoute = ['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/editor', {
            template: template,
            controller: 'editorCtrl as vm'
        });
}];

export { EditorRoute };
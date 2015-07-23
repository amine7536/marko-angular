'use strict';
import angular from 'angular';
import 'angular-route';
import $ from 'jquery';

/** Import Application Modules **/
import { editorModule } from './editor/editor.module';


export var mainModule = angular.module("markoApp", [
        'ngRoute',
        editorModule.name
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/editor'});
    }])
    .directive('resize', ['$window', function($window) {
        return {
            link: function(scope) {
                angular.element($window).on('resize', function(e) {
                    scope.$broadcast('resize::resize');
                });
            }
        }
    }]);

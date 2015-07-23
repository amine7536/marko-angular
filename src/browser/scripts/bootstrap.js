import angular from 'angular';
import {mainModule} from './main';

angular.element(document).ready(function() {
    angular.bootstrap(document.querySelector('[markoApp]'), [
        mainModule.name
    ], {
        strictDi: true
    });
});
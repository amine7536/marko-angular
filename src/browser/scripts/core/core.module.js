/** Core Module **/
//import { CoreCtrl } from './core.controller';
import { CoreService } from './core.service';


var coreModule = angular.module("markoApp.Core", []);

var core = new CoreService();


//coreModule.controller('coreCtrl', CoreCtrl);
coreModule.service('coreService', CoreService);

export { coreModule };
'use strict';

describe('Controller: MainctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('sdcApp'));

  var MainctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainctrlCtrl = $controller('MainctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

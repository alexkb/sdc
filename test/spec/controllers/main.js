'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('Sdc'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('there should be a certain number of state options in the scope', function () {
    expect(scope.stateOptions.length).toEqual(8);
  });
});

'use strict';

describe('Directive: emailTemplate', function () {

  // load the directive's module
  beforeEach(module('sdcApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<email-template></email-template>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the emailTemplate directive');
  }));
});

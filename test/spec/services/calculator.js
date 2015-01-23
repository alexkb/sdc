'use strict';

describe('Service: calculator', function () {

  // load the service's module
  beforeEach(module('sdcApp'));

  // instantiate service
  var calculator;
  beforeEach(inject(function (_calculator_) {
    calculator = _calculator_;
  }));

  it('should do something', function () {
    expect(!!calculator).toBe(true);
  });

});

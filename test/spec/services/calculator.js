'use strict';

describe('Service: calculator', function () {

  // load the service's module
  beforeEach(module('Sdc'));

  // instantiate service
  var calculator;
  beforeEach(inject(function (_Calculator_) {
    calculator = _Calculator_;
  }));

  it('should calculate WA duty accurately', function () {
    expect(calculator.processWa(600000, 'established', 'residential', false, 'south').propertyDuty).toEqual(22515);
    expect(calculator.processWa(1000000, 'established', 'residential', false, 'south').propertyDuty).toEqual(42615);
  });

});

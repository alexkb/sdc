'use strict';

describe('Service: calculator', function () {

  // load the service's module
  beforeEach(module('Sdc'));

  // instantiate service
  var calculator;
  beforeEach(inject(function (_Calculator_) {
    calculator = _Calculator_;
  }));

  // processAct: function(propertyValue, propertyStatus, purpose, firstHome, pensioner, income, propertyDependents)
  it('should calculate ACT duty accurately', function () {
    expect(calculator.processAct(300000, 'established', 'residential', true, false, 0, 0).propertyDuty).toEqual(7500);
    expect(calculator.processAct(300000, 'established', 'residential', false, false, 0, 0).propertyDuty).toEqual(7500);
    expect(calculator.processAct(600000, 'established', 'residential', false, false, 0, 0).propertyDuty).toEqual(20800);
    expect(calculator.processAct(1000000, 'established', 'residential', false, false, 0, 0).propertyDuty).toEqual(44550);
  });

  // processNsw: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate NSW duty accurately', function () {
    expect(calculator.processNsw(300000, 'established', 'residential', true).propertyDuty).toEqual(8990);
    expect(calculator.processNsw(300000, 'established', 'residential', false).propertyDuty).toEqual(8990);
    expect(calculator.processNsw(600000, 'established', 'residential', false).propertyDuty).toEqual(22490);
    expect(calculator.processNsw(1000000, 'established', 'residential', false).propertyDuty).toEqual(40490);
  });

  // processNt: function(propertyValue, propertyStatus, purpose, firstHome, pensioner)
  it('should calculate NT duty accurately', function () {
    expect(calculator.processNt(300000, 'established', 'residential', true, false).propertyDuty).toEqual(10414);
    expect(calculator.processNt(300000, 'established', 'residential', false, false).propertyDuty).toEqual(10414);
    expect(calculator.processNt(600000, 'established', 'residential', false, false).propertyDuty).toEqual(29700);
    expect(calculator.processNt(1000000, 'established', 'residential', false, false).propertyDuty).toEqual(49500);
    expect(calculator.processNt(3005000, 'established', 'residential', false, false).propertyDuty).toEqual(163772);
  });

  // processQld: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate QLD duty accurately', function () {
    expect(calculator.processQld(300000, 'established', 'residential', true, false).propertyDuty).toEqual(0);
    expect(calculator.processQld(300000, 'established', 'residential', false, false).propertyDuty).toEqual(3000);
    expect(calculator.processQld(600000, 'established', 'residential', false, false).propertyDuty).toEqual(12850);
    expect(calculator.processQld(1000000, 'established', 'residential', false, false).propertyDuty).toEqual(30850);
  });

  // processSa: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate SA duty accurately', function () {
    expect(calculator.processSa(300000, 'established', 'residential', true).propertyDuty).toEqual(11330);
    expect(calculator.processSa(300000, 'established', 'residential', false).propertyDuty).toEqual(11330);
    expect(calculator.processSa(600000, 'established', 'residential', false).propertyDuty).toEqual(26830);
    expect(calculator.processSa(1000000, 'established', 'residential', false).propertyDuty).toEqual(48830);
  });

  // processTas: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate TAS duty accurately', function () {
    expect(calculator.processTas(300000, 'established', 'residential', true).propertyDuty).toEqual(9935);
    expect(calculator.processTas(300000, 'established', 'residential', false).propertyDuty).toEqual(9935);
    expect(calculator.processTas(600000, 'established', 'residential', false).propertyDuty).toEqual(22497); // Rounded up 22498
    expect(calculator.processTas(1000000, 'established', 'residential', false).propertyDuty).toEqual(40185);
  });

  // processVic: function(propertyValue, propertyStatus, purpose, firstHome, paymentMethod)
  it('should calculate VIC duty accurately', function () {
    expect(calculator.processVic(300000, 'established', 'residential', true, 'electronic').propertyDuty).toEqual(5685);
    expect(calculator.processVic(300000, 'established', 'residential', false, 'electronic').propertyDuty).toEqual(11370);
    expect(calculator.processVic(600000, 'established', 'residential', true, 'electronic').propertyDuty).toEqual(15535);
    expect(calculator.processVic(600000, 'established', 'residential', false, 'electronic').propertyDuty).toEqual(31070);
    expect(calculator.processVic(1000000, 'established', 'residential', false, 'electronic').propertyDuty).toEqual(55000);
  });

  // processWa: function(propertyValue, propertyStatus, purpose, firstHome, propertyLocation)
  it('should calculate WA duty accurately', function () {
    expect(calculator.processWa(300000, 'established', 'residential', true, 'south').propertyDuty).toEqual(0);
    expect(calculator.processWa(300000, 'established', 'residential', false, 'south').propertyDuty).toEqual(8835);
    expect(calculator.processWa(600000, 'established', 'residential', false, 'south').propertyDuty).toEqual(22515);
    expect(calculator.processWa(1000000, 'established', 'residential', false, 'south').propertyDuty).toEqual(42615);
  });

});

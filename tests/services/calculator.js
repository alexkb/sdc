'use strict';

describe('Service: calculator', function () {

  // load the service's module
  beforeEach(module('Sdc'));

  // instantiate service
  var calculator;
  var PropertyModel;
  beforeEach(inject(function (_Calculator_, _PropertyModel_) {
    calculator = _Calculator_;
    PropertyModel = _PropertyModel_;
  }));

  // processAct: function(propertyValue, propertyStatus, purpose, firstHome, pensioner, income, propertyDependents)
  it('should calculate ACT duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      pensionor: false,
      income: 0,
      propertyDependents: 0
    };
    expect(calculator.processAct().propertyDuty).toEqual(7500);

    PropertyModel.data.firstHome = true;
    expect(calculator.processAct().propertyDuty).toEqual(7500);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processAct().propertyDuty).toEqual(20800);

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processAct().propertyDuty).toEqual(44550);
  });



  // processNsw: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate NSW duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true
    };
    expect(calculator.processNsw().propertyDuty).toEqual(8990);

    PropertyModel.data.firstHome = false;
    expect(calculator.processNsw().propertyDuty).toEqual(8990);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processNsw().propertyDuty).toEqual(22490);

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processNsw().propertyDuty).toEqual(40490);
  });



  // processNt: function(propertyValue, propertyStatus, purpose, firstHome, pensioner)
  it('should calculate NT duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      pensionor: false
    };
    expect(calculator.processNt().propertyDuty).toEqual(10414);

    PropertyModel.data.firstHome = false;
    expect(calculator.processNt().propertyDuty).toEqual(10414);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processNt().propertyDuty).toEqual(29700);

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processNt().propertyDuty).toEqual(49500);

    PropertyModel.data.propertyValue = 3005000;
    expect(calculator.processNt().propertyDuty).toEqual(163772);
  });


  // processQld: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate QLD duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      pensionor: false
    };
    expect(calculator.processQld().propertyDuty).toEqual(0);

    PropertyModel.data.firstHome = false;
    expect(calculator.processQld().propertyDuty).toEqual(3000);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processQld().propertyDuty).toEqual(12850);

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processQld().propertyDuty).toEqual(30850);
  });


  // processSa: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate SA duty accurately', function () {

    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true
    };
    expect(calculator.processSa().propertyDuty).toEqual(11330);

    PropertyModel.data.firstHome = false;
    expect(calculator.processSa().propertyDuty).toEqual(11330);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processSa().propertyDuty).toEqual(26830);

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processSa().propertyDuty).toEqual(48830);
  });


  // processTas: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate TAS duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true
    };
    expect(calculator.processTas().propertyDuty).toEqual(9935);

    PropertyModel.data.firstHome = false;
    expect(calculator.processTas().propertyDuty).toEqual(9935);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processTas().propertyDuty).toEqual(22497); // Rounded up 22498

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processTas().propertyDuty).toEqual(40185);
  });


  // processVic: function(propertyValue, propertyStatus, purpose, firstHome, paymentMethod)
  it('should calculate VIC duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      paymentMethod: 'electronic'
    };
    expect(calculator.processVic().propertyDuty).toEqual(5685);

    PropertyModel.data.firstHome = false;
    expect(calculator.processVic().propertyDuty).toEqual(11370);

    PropertyModel.data.propertyValue = 500000;
    PropertyModel.data.firstHome = true;
    expect(calculator.processVic().propertyDuty).toEqual(10985);

    PropertyModel.data.firstHome = false;
    expect(calculator.processVic().propertyDuty).toEqual(21970);

    PropertyModel.data.propertyValue = 600000;
    PropertyModel.data.firstHome = true;
    expect(calculator.processVic().propertyDuty).toEqual(15535);

    PropertyModel.data.firstHome = false;
    expect(calculator.processVic().propertyDuty).toEqual(31070);

    PropertyModel.data.firstHome = true;
    PropertyModel.data.propertyStatus = 'newhome';
    expect(calculator.processVic().grants.fhog).toEqual(10000);

    PropertyModel.data.propertyValue = 1000000;
    PropertyModel.data.firstHome = false;
    PropertyModel.data.propertyStatus = 'established';
    expect(calculator.processVic().propertyDuty).toEqual(55000);
  });


  // processWa: function(propertyValue, propertyStatus, purpose, firstHome, propertyLocation)
  it('should calculate WA duty accurately', function () {
    PropertyModel.data = {
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      propertyLocation: 'south'
    };
    expect(calculator.processWa().propertyDuty).toEqual(0);

    PropertyModel.data.firstHome = false;
    expect(calculator.processWa().propertyDuty).toEqual(8835);

    PropertyModel.data.propertyValue = 600000;
    expect(calculator.processWa().propertyDuty).toEqual(22515);

    PropertyModel.data.propertyValue = 1000000;
    expect(calculator.processWa().propertyDuty).toEqual(42615);
  });

});

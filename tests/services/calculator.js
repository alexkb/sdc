'use strict';

describe('Service: calculator', function () {

  // load the service's module
  beforeEach(module('Sdc'));

  // instantiate service
  var calculator;
  var PropertyModel;
  var ResultsModel;
  beforeEach(inject(function (_Calculator_, _PropertyModel_, _ResultsModel_) {
    calculator = _Calculator_;
    PropertyModel = _PropertyModel_;
    ResultsModel = _ResultsModel_;
  }));

  // processAct: function(propertyValue, propertyStatus, purpose, firstHome, pensioner, income, propertyDependents)
  it('should calculate ACT duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'ACT',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      pensionor: false,
      income: 0,
      propertyDependents: 0
    };

    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(7500);

    PropertyModel.data.firstHome = true;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(7500);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(20800);

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(44550);
  });



  // processNsw: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate NSW duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'NSW',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true
    };

    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(8990);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(8990);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(22490);

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(40490);
  });



  // processNt: function(propertyValue, propertyStatus, purpose, firstHome, pensioner)
  it('should calculate NT duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'NT',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      pensionor: false
    };

    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(10414);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(10414);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(29700);

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(49500);

    PropertyModel.data.propertyValue = 3005000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(163772);
  });


  // processQld: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate QLD duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'QLD',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      pensionor: false
    };
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(0);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(3000);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(12850);

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(30850);
  });


  // processSa: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate SA duty accurately', function () {

    PropertyModel.data = {
      propertyState: 'SA',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true
    };
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(11330);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(11330);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(26830);

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(48830);
  });


  // processTas: function(propertyValue, propertyStatus, purpose, firstHome)
  it('should calculate TAS duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'TAS',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true
    };
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(9935);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(9935);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(22497); // Rounded up 22498

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(40185);
  });


  // processVic: function(propertyValue, propertyStatus, purpose, firstHome, paymentMethod)
  it('should calculate VIC duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'VIC',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      paymentMethod: 'electronic'
    };

    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(5685);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(11370);

    PropertyModel.data.propertyValue = 500000;
    PropertyModel.data.firstHome = true;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(10985);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(21970);

    PropertyModel.data.propertyValue = 600000;
    PropertyModel.data.firstHome = true;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(15535);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(31070);

    PropertyModel.data.firstHome = true;
    PropertyModel.data.propertyStatus = 'newhome';
    calculator.go();
    expect(ResultsModel.results.grants.fhog).toEqual(10000);

    PropertyModel.data.propertyValue = 1000000;
    PropertyModel.data.firstHome = false;
    PropertyModel.data.propertyStatus = 'established';
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(55000);
  });


  // processWa: function(propertyValue, propertyStatus, purpose, firstHome, propertyLocation)
  it('should calculate WA duty accurately', function () {
    PropertyModel.data = {
      propertyState: 'WA',
      propertyValue: 300000,
      purpose: 'residential',
      propertyStatus: 'established',
      firstHome: true,
      propertyLocation: 'south'
    };

    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(0);

    PropertyModel.data.firstHome = false;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(8835);

    PropertyModel.data.propertyValue = 600000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(22515);

    PropertyModel.data.propertyValue = 1000000;
    calculator.go();
    expect(ResultsModel.results.propertyDuty).toEqual(42615);
  });

});

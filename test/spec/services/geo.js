'use strict';

describe('Service: Geo', function () {

  // load the service's module
  beforeEach(module('sdcApp'));

  // instantiate service
  var Geo;
  beforeEach(inject(function (_Geo_) {
    Geo = _Geo_;
  }));

  it('should do something', function () {
    expect(!!Geo).toBe(true);
  });

});

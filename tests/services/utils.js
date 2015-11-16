'use strict';

describe('Service: Utils', function () {

  // load the service's module
  beforeEach(module('Sdc'));

  // instantiate service
  var Utils;
  beforeEach(inject(function (_Utils_) {
    Utils = _Utils_;
  }));

  it('isUndefinedOrNull should return results as expected', function () {
    expect(Utils.isUndefinedOrNull('')).toEqual(false);
    expect(Utils.isUndefinedOrNull(undefined)).toEqual(true);
    expect(Utils.isUndefinedOrNull(null)).toEqual(true);
  });

});

'use strict';

describe('Directive: wordCloudViz', function () {

  // load the directive's module
  beforeEach(module('wordCloudApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<word-cloud-viz></word-cloud-viz>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the wordCloudViz directive');
  }));
});

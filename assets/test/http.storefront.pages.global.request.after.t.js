/**
 * This is a scaffold for unit tests for the custom function for
 * `http.storefront.pages.global.request.after`.
 * Modify the test conditions below. You may:
 *  - add special assertions for code actions from Simulator.assert
 *  - create a mock context with Simulator.context() and modify it
 *  - use and modify mock Mozu business objects from Simulator.fixtures
 *  - use Express to simulate request/response pairs
 */

'use strict';

var Simulator = require('mozu-action-simulator');
var assert = Simulator.assert;

var actionName = 'http.storefront.pages.global.request.after';

describe('http.storefront.pages.global.request.after implementing http.storefront.pages.global.request.after', function () {

  var action;

  before(function () {
    action = require('../src/domains/storefront/http.storefront.pages.global.request.after');
  });

  it('does not redirect if you are logged in', function(done) {

    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      done();
    };

    var context = Simulator.context(actionName, callback);

    context.apiContext = { userIsAnonymous: false };
    context.request.query = {};
    context.request.path = '/';

    context.response.redirect = function() {
      assert.fail('Redirect should not have been called!')
    }

    Simulator.simulate(actionName, action, context, callback);
  });

  it('does not redirect if you are in edit mode', function(done) {

    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      done();
    };

    var context = Simulator.context(actionName, callback);

    context.apiContext = { userIsAnonymous: true };
    context.request.query = { isEditMode: true };
    context.request.path = '/';

    context.response.redirect = function() {
      assert.fail('Redirect should not have been called!')
    }

    Simulator.simulate(actionName, action, context, callback);
  });
  it('does not redirect if you are already on the login page', function(done) {

    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      done();
    };

    var context = Simulator.context(actionName, callback);

    context.apiContext = { userIsAnonymous: true };
    context.request.query = {};
    context.request.path = '/user/login';

    context.response.redirect = function() {
      assert.fail('Redirect should not have been called!')
    }

    Simulator.simulate(actionName, action, context, callback);
  });
  it('redirects in all other cases', function(done) {

    var redirectCalled = false;
    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      assert.ok(redirectCalled, 'Redirect was never called!');
      done();
    };

    var context = Simulator.context(actionName, callback);

    context.apiContext = { userIsAnonymous: true };
    context.request.query = {};
    context.request.path = '/';

    context.response.redirect = function() {
      redirectCalled = true;
    }

    Simulator.simulate(actionName, action, context, callback);
  });
  describe('filters on a set of regexes given by the `excludePaths` config',
  function() {
    var excludes = [
      '^\/$',
      '^\/promo\\-\\d+\/?$'
    ];
    function tryPath(path, shouldRedirect) {
      return function(done) {

        var redirectCalled = false;
        var callback = function(err) {
          assert.ok(!err, "Callback was called with an error: " + err);
          if (shouldRedirect) {
            assert.ok(
              redirectCalled,
              'Redirect was never called for ' + path);
          } else {
            assert.ok(
              !redirectCalled,
              'Redirect was called for ' + path);
          }
          done();
        };

        var context = Simulator.context(actionName, callback);

        context.apiContext = { userIsAnonymous: true };
        context.configuration = {
          excludePaths: excludes
        };
        context.request.query = {};
        context.request.path = path;

        context.response.redirect = function() {
          redirectCalled = true;
        }

        Simulator.simulate(actionName, action, context, callback);
      }
    }
    it('does not redirect homepage', tryPath('/',false));
    it('does not redirect a promo page', tryPath('/promo-112',false));
    it('redirects a product page', tryPath('/p/5678',true));
    it('redirects a page that matches promo', tryPath('/p/promo-1',true));
  });
  describe('filters on a set of regexes given by the `includePaths` config',
  function() {
    var includes = [
      '^\/$',
      '^\/promo\\-\\d+\/?$'
    ];
    function tryPath(path, shouldRedirect) {
      return function(done) {

        var redirectCalled = false;
        var callback = function(err) {
          assert.ok(!err, "Callback was called with an error: " + err);
          if (shouldRedirect) {
            assert.ok(
              redirectCalled,
              'Redirect was never called for ' + path);
          } else {
            assert.ok(
              !redirectCalled,
              'Redirect was called for ' + path);
          }
          done();
        };

        var context = Simulator.context(actionName, callback);

        context.apiContext = { userIsAnonymous: true };
        context.configuration = {
          includePaths: includes
        };
        context.request.query = {};
        context.request.path = path;

        context.response.redirect = function() {
          redirectCalled = true;
        }

        Simulator.simulate(actionName, action, context, callback);
      }
    }
    it('redirects homepage', tryPath('/',true));
    it('redirects a promo page', tryPath('/promo-112',true));
    it('does not redirect a product page', tryPath('/p/5678',false));
    it('does not redirect a page matchin promo', tryPath('/p/promo-1',false));
  })

});

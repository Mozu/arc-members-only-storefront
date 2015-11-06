(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Implementation for http.storefront.pages.global.request.after

 * If the user is not logged in,
 * the site is not currently being displayed in a SiteBuilder frame,
 * and we are not already on the login page,
 * then redirect to the login page.

 */

module.exports = function(context, callback) {
  console.log('members-only', context.apiContext);

  function toREs(collection) {
    return collection.map(function(txt) {
      return new RegExp(txt,'i');
    });
  }

  function hasMatch(REs) {
    return REs.some(function(pathRE) {
      return pathRE.test(context.request.path);
    });
  }

  var configuration = context.configuration || {};

  var includePaths = toREs(configuration.includePaths || []);
  var excludePaths = toREs(configuration.excludePaths || []);
  // never redirect logins
  excludePaths.push(/^\/user\/login/i);

  if (context.request && context.request.url && context.request.url.indexOf && context.request.url.indexOf('_gosite') !== -1) {
    console.log('shouting into the ether!');
    callback();
  }

  if (!context.apiContext.userIsAnonymous) {
    console.log('members-only user is authenticated');
    return callback();
  }
  console.log('members-only user is anon');

  if (context.request.query && 
      Object.keys(context.request.query).map(function(k) {
        return k.toLowerCase();
      }).indexOf('iseditmode') !== -1) {
    console.log('editmode is true');
    return callback();
  }
  console.log('members-only editmode is untrue. query: ',
              context.request.query);

  if (includePaths.length > 0 && !hasMatch(includePaths)) {
    console.log('include paths present but none matched, do not redirect');
    return callback();
  }
  console.log('no include paths, or include paths matched');

  if (hasMatch(excludePaths)) {
    console.log('exclude paths matched');
    return callback();
  }
  console.log('exclude paths unmatched.');

  console.log('redirecting..');
  context.response.redirect(
    '/user/login?returnUrl=' + encodeURIComponent(context.request.url)
  );

  return callback();

};

},{}],2:[function(require,module,exports){
module.exports = {
  'http.storefront.pages.global.request.after': {
      actionName: 'http.storefront.pages.global.request.after',
      customFunction: require('./domains/storefront/http.storefront.pages.global.request.after')
  }
};

},{"./domains/storefront/http.storefront.pages.global.request.after":1}]},{},[2])(2)
});
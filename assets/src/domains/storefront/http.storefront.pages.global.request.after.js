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

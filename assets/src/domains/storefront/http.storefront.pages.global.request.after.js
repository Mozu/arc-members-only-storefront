/**
 * Implementation for http.storefront.pages.global.request.after

 * If the user is not logged in,
 * the site is not currently being displayed in a SiteBuilder frame,
 * and we are not already on the login page,
 * then redirect to the login page.

 */

module.exports = function(context, callback) {
  if (context.apiContext.userIsAnonymous &&
      !context.request.query.isEditMode &&
      context.request.path.indexOf('/user/login') !== 0) {
        context.response.redirect(
          '/user/login?returnUrl=' + encodeURIComponent(context.request.url)
        );
      }
  callback();
};

/*
 * pub pager.js generator-plugin
 *
 * client-side router (visionmedia/page) plugin for pub-generator
 * translates window.click events for intra-site links to generator.nav events
 * generator.nav events are then handled by jqueryview
 *
 * initialize by calling generator.initPager();
 *
 * NOTE: uses history.pushState, which doesn't work in older browers
 * copyright 2015, Jurgen Leschner - github.com/jldec - MIT license
 *
*/
var debug = require('debug')('pub:pager');
var qs = require('querystring');

module.exports = function(generator) {

  // mixin
  generator.initPager = function initPager() {

    var u = generator.util;
    var opts = generator.opts;
    var log = opts.log;
    var oldPage;

    // bind jqueryview
    var jqv = require('./jqueryview')(generator);
    jqv.start();

    // https://github.com/visionmedia/page.js
    window.pager = require('page');

    window.pager('*', function(ctx, next) {
      var path = ctx.path;
      var querystring = ctx.querystring;

      // strip origin from fq urls
      path = u.unPrefix(path, opts.appUrl);

      // strip static root (see /server/client/init-opts.js)
      path = u.unPrefix(path, opts.staticRoot);

      // strip querystring
      path = path.split('?')[0];

      var page = generator.findPage(path);

      if (!page) {
        log('pager miss', path);
        return next();
      }

      if (page !== oldPage) {
        oldPage = page;

        // set global pubRef.ctx
        pubRef.ctx = ctx;

        // simulate server-side request
        generator.req = { query: querystring ? qs.parse(querystring) : {} };

        // update view in DOM
        debug('nav ' + path);
        generator.emit('nav', page);
      }
    });

    // start pager
    window.pager( {dispatch:false} ); // auto-dispatch loses hash.
  };
}

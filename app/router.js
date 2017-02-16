'use strict';

module.exports = app => {
  // scope package without version
  app.get(/^\/package\/((?:@[\w\-\.]+\/)?[\w\-\.]+)$/, 'package.show');
  // scope package with version
  app.get(/\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/([\w\d\.]+)$/, 'package.show');
  // app.get('/package/:name', showPackage);
  // app.get('/package/:name/:version', showPackage);

  // // privates package
  // app.get('/privates', 'package.private');
  //
  // // search
  // app.get(/\/browse\/keyword\/(@[\w\-\.]+\/[\w\-\.]+)$/, 'package.search');
  // app.get('/browse/keyword/:word', 'package.search');
  //
  // // user
  // app.get('/~:name', 'user.show');
  //
  // // sync
  // app.get(/\/sync\/(@[\w\-\.]+\/[\w\-\.]+)$/, 'sync.show');
  // app.get('/sync/:name', 'sync.show');
  // app.get('/sync', 'sync.show');
  // app.put(/\/sync\/(@[\w\-\.]+\/[\w\-\.]+)$/, 'sync.create');
  // app.put('/sync/:name', 'sync.create');
  //
  // app.get(/\/sync\/(@[\w\-\.]+\/[\w\-\.]+)\/log\/(\d+)$/, 'sync.getLog');
  // app.get('/sync/:name/log/:id', 'sync.getLog');
  //
  // // badge
  // app.get(/^\/badge\/v\/([@\w\-\.\/]+)\.svg$/, 'badge.version');
  // app.get(/^\/badge\/d\/([@\w\-\.\/]+)\.svg$/, 'badge.downloads');
};

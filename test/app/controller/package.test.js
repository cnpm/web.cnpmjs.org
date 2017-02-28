'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/controllers/web/package/show.test.js', () => {

  afterEach(mm.restore);

  describe('GET /package/:name', () => {

    it('should get 200', async () => {
      await request(app.callback())
        .get('/package/urllib')
        .expect(200)
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/urllib/)
        .expect(/Maintainers/)
        .expect(/Dependencies/)
        .expect(/Downloads/);
    });

    it('should get scoped package', async () => {
      await request(app.callback())
        .get('/package/@typed/core')
        .expect(200)
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/@typed\/core/)
        .expect(/Maintainers/)
        .expect(/Dependencies/)
        .expect(/Downloads/);
    });

    it('should get 404', async () => {
      await request(app.callback())
        .get('/package/noexist')
        .expect('Location', '/404')
        .expect(302);
    });
  });

  describe('GET /package/:name/:version', () => {
    it('should 200 when get by version', async () => {
      await request(app.callback())
        .get('/package/urllib/0.0.1')
        .expect(200)
        .expect(/urllib/)
        .expect(/Maintainers/)
        .expect(/Dependencies/)
        .expect(/Downloads/);
    });

    it('should 200 when get by tag', async () => {
      await request(app.callback())
        .get('/package/@typed/core/latest')
        .expect(200)
        .expect(/@typed\/core/)
        .expect(/Maintainers/)
        .expect(/Dependencies/)
        .expect(/Downloads/);
    });

    it('should 404 when get by version not exist', async () => {
      await request(app.callback())
        .get('/package/urllib/0.0.2')
        .expect('Location', '/404')
        .expect(302);
    });

    it('should 404 when get by tag', async () => {
      await request(app.callback())
        .get('/package/@typed/core/0.0.0')
        .expect('Location', '/404')
        .expect(302);
    });
  });

  // describe('xss filter', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/xss-test-ut', '0.0.1', utils.admin,
  //       null, '[xss link](javascript:alert(2)) \n\nfoo<script>alert(1)</script>/xss\'"&#');
  //     request(registry.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .end(done);
  //   });
  //
  //   it('should filter xss content', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/xss-test-ut')
  //     .expect(200, (err, res) => {
  //       assert.ifError(err);
  //       res.text.should.not.containEql('<script>alert(1)</script>');
  //       res.text.should.not.containEql('alert(2)"');
  //       done();
  //     });
  //   });
  // });

  // describe('show npm package', async () => {
  //   before(done => {
  //     mm(config, 'syncModel', 'exists');
  //     utils.sync('pedding', done);
  //   });
  //
  //   it('should show pedding package info and contributors', async () => {
  //     mm(config, 'syncModel', 'exists');
  //     return request(app)
  //       .get('/package/pedding')
  //       .expect(200)
  //       // https://github.com/cnpm/cnpmjs.org/issues/497
  //       .expect(/by <a href="\/\~fengmk2">fengmk2<\/a>/)
  //       // snyk link
  //       .expect(/<a class="badge-link" href="https:\/\/snyk\.io\/test\/npm\/pedding" target="_blank"><img title="Known Vulnerabilities" src="https:\/\/snyk\.io\/test\/npm\/pedding\/badge\.svg\?style=flat-square"><\/a>/)
  //       .expect(/pedding/);
  //   });
  // });
  //
  // describe('show repository url in git syntax', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/testmodule-repo-git', '0.0.1', utils.admin);
  //     pkg.versions['0.0.1'].repository = {
  //       type: 'git',
  //       url: 'git://github.com/cnpm/cnpmjs.org.git',
  //     };
  //     request(app.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .expect(201, done);
  //   });
  //
  //   it('should get 200', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/testmodule-repo-git')
  //     .expect(200)
  //     .expect('content-type', 'text/html; charset=utf-8')
  //     .expect(/testmodule-repo-git/)
  //     .expect(/Maintainers/)
  //     .expect(/Dependencies/)
  //     .expect(/https:\/\/github\.com\/cnpm\/cnpmjs\.org/)
  //     .expect(/Downloads/, (err, res) => {
  //       assert.ifError(err);
  //       res.should.have.header('etag');
  //       res.text.should.containEql('<meta charset="utf-8">');
  //       done();
  //     });
  //   });
  // });
  //
  // describe('show repository url in ssh syntax', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/testmodule-repo-ssh', '0.0.1', utils.admin);
  //     pkg.versions['0.0.1'].repository = {
  //       type: 'git',
  //       url: 'git@github.com:cnpm/cnpmjs.org.git',
  //     };
  //     request(registry.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .expect(201, done);
  //   });
  //
  //   it('should get 200', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/testmodule-repo-ssh')
  //     .expect(200)
  //     .expect('content-type', 'text/html; charset=utf-8')
  //     .expect(/testmodule-repo-ssh/)
  //     .expect(/Maintainers/)
  //     .expect(/Dependencies/)
  //     .expect(/https:\/\/github\.com\/cnpm\/cnpmjs\.org/)
  //     .expect(/Downloads/, (err, res) => {
  //       assert.ifError(err);
  //       res.should.have.header('etag');
  //       res.text.should.containEql('<meta charset="utf-8">');
  //       done();
  //     });
  //   });
  // });
  //
  // describe('show repository url in raw ssh syntax', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/testmodule-repo-raw-ssh', '0.0.1', utils.admin);
  //     pkg.versions['0.0.1'].repository = {
  //       type: 'git',
  //       url: 'ssh://git@github.com/cnpm/cnpmjs.org.git',
  //     };
  //     request(registry.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .expect(201, done);
  //   });
  //
  //   it('should get 200', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/testmodule-repo-raw-ssh')
  //     .expect(200)
  //     .expect('content-type', 'text/html; charset=utf-8')
  //     .expect(/testmodule-repo-raw-ssh/)
  //     .expect(/Maintainers/)
  //     .expect(/Dependencies/)
  //     .expect(/https:\/\/github\.com\/cnpm\/cnpmjs\.org/)
  //     .expect(/Downloads/, (err, res) => {
  //       assert.ifError(err);
  //       res.should.have.header('etag');
  //       res.text.should.containEql('<meta charset="utf-8">');
  //       done();
  //     });
  //   });
  // });
  //
  // describe('show repository url in https syntax', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/testmodule-repo-https', '0.0.1', utils.admin);
  //     pkg.versions['0.0.1'].repository = {
  //       type: 'git',
  //       url: 'https://github.com/cnpm/cnpmjs.org.git',
  //     };
  //     request(registry.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .expect(201, done);
  //   });
  //
  //   it('should get 200', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/testmodule-repo-https')
  //     .expect(200)
  //     .expect('content-type', 'text/html; charset=utf-8')
  //     .expect(/testmodule-repo-https/)
  //     .expect(/Maintainers/)
  //     .expect(/Dependencies/)
  //     .expect(/https:\/\/github\.com\/cnpm\/cnpmjs\.org\.git/)
  //     .expect(/Downloads/, (err, res) => {
  //       assert.ifError(err);
  //       res.should.have.header('etag');
  //       res.text.should.containEql('<meta charset="utf-8">');
  //       done();
  //     });
  //   });
  // });
  //
  // describe('show repository url in short https syntax', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/testmodule-repo-short-https', '0.0.1', utils.admin);
  //     pkg.versions['0.0.1'].repository = {
  //       type: 'git',
  //       url: 'https://github.com/cnpm/cnpmjs.org',
  //     };
  //     request(registry.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .expect(201, done);
  //   });
  //
  //   it('should get 200', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/testmodule-repo-short-https')
  //     .expect(200)
  //     .expect('content-type', 'text/html; charset=utf-8')
  //     .expect(/testmodule-repo-short-https/)
  //     .expect(/Maintainers/)
  //     .expect(/Dependencies/)
  //     .expect(/https:\/\/github\.com\/cnpm\/cnpmjs\.org/)
  //     .expect(/Downloads/, (err, res) => {
  //       assert.ifError(err);
  //       res.should.have.header('etag');
  //       res.text.should.containEql('<meta charset="utf-8">');
  //       done();
  //     });
  //   });
  // });
  //
  // describe('show repository url in short http syntax', async () => {
  //   before(done => {
  //     const pkg = utils.getPackage('@cnpmtest/testmodule-repo-short-http', '0.0.1', utils.admin);
  //     pkg.versions['0.0.1'].repository = {
  //       type: 'git',
  //       url: 'http://github.com/cnpm/cnpmjs.org.git',
  //     };
  //     request(registry.callback())
  //     .put('/' + pkg.name)
  //     .set('authorization', utils.adminAuth)
  //     .send(pkg)
  //     .expect(201, done);
  //   });
  //
  //   it('should get 200', done => {
  //     request(app.callback())
  //     .get('/package/@cnpmtest/testmodule-repo-short-http')
  //     .expect(200)
  //     .expect('content-type', 'text/html; charset=utf-8')
  //     .expect(/testmodule-repo-short-http/)
  //     .expect(/Maintainers/)
  //     .expect(/Dependencies/)
  //     .expect(/http:\/\/github\.com\/cnpm\/cnpmjs\.org/)
  //     .expect(/Downloads/, (err, res) => {
  //       assert.ifError(err);
  //       res.should.have.header('etag');
  //       res.text.should.containEql('<meta charset="utf-8">');
  //       done();
  //     });
  //   });
  // });
});

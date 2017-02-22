'use strict';

const debug = require('debug')('web.cnpmjs.org');
const moment = require('moment');
const gravatar = require('gravatar');
const giturl = require('giturl');
const bytes = require('bytes');


module.exports = app => class PackageController extends app.Controller {
  * show() {
    const { ctx, service } = this;
    const params = ctx.params;
    // normal: {name: $name, version: $version}
    // scope: [$name, $version]
    const name = params[0];
    let tag = params[1];
    debug('display %s with %j', name, params);

    if (!tag) {
      tag = 'latest';
    }

    const pkg = yield service.package.getModule(name, tag);
    console.log(pkg);
    if (!pkg) {
      ctx.status = 404;
      return;
    }
    this.resolvePackage(pkg);
    // if (!pkg || !pkg.package) {
    //   // check if unpublished
    //   const unpublishedInfo = yield* packageService.getUnpublishedModule(name);
    //   debug('show unpublished %j', unpublishedInfo);
    //   if (unpublishedInfo) {
    //     const data = {
    //       name,
    //       unpublished: unpublishedInfo.package,
    //     };
    //     data.unpublished.time = new Date(data.unpublished.time);
    //     if (data.unpublished.maintainers) {
    //       for (const i = 0; i < data.unpublished.maintainers.length; i++) {
    //         const maintainer = data.unpublished.maintainers[i];
    //         if (maintainer.email) {
    //           maintainer.gravatar = gravatar.url(maintainer.email, { s: '50', d: 'retro' }, true);
    //         }
    //       }
    //     }
    //     yield this.render('package_unpublished', {
    //       package: data,
    //       title: 'Package - ' + name,
    //     });
    //     return;
    //   }
    //
    //   return yield* next;
    // }


    // const r = yield [
    //   utils.getDownloadTotal(name),
    //   packageService.listDependents(name),
    //   packageService.listStarUserNames(name),
    //   packageService.listMaintainers(name),
    // ];
    // const download = r[0];
    // const dependents = r[1];
    // const users = r[2];
    // const maintainers = r[3];
    // pkg.dependents = dependents;
    // pkg.users = users;
    // if (maintainers.length > 0) {
    //   pkg.maintainers = maintainers;
    // }
    // if (pkg.maintainers) {
    //   for (const i = 0; i < pkg.maintainers.length; i++) {
    //     const maintainer = pkg.maintainers[i];
    //     if (maintainer.email) {
    //       maintainer.gravatar = gravatar.url(maintainer.email, { s: '50', d: 'retro' }, true);
    //     }
    //   }
    // }
    // for (const k in download) {
    //   download[k] = humanize(download[k]);
    // }
    // setDownloadURL(pkg, this, config.registryHost);


    //
    //
    // yield this.render('package', {
    //   title: 'Package - ' + pkg.name,
    //   package: pkg,
    //   download,
    // });
    pkg.dependents = [];
    yield ctx.render('package.ejs', {
      package: pkg,
      download: {},
    });
  }

  resolvePackage(pkg) {
    const { renderMarkdown } = this.ctx.helper;
    const { registry, badgeURL, snykURL } = this.config.cnpmjs;

    pkg.fromNow = moment(pkg.publish_time).fromNow();

    if (pkg.readme && typeof pkg.readme !== 'string') {
      pkg.readme = 'readme is not string: ' + JSON.stringify(pkg.readme);
    } else {
      pkg.readme = renderMarkdown(pkg.readme || '');
    }
    if (!pkg.readme) {
      pkg.readme = pkg.description || '';
    }

    if (pkg._npmUser) {
      pkg.lastPublishedUser = pkg._npmUser;
      if (pkg.lastPublishedUser.email) {
        pkg.lastPublishedUser.gravatar = gravatar.url(pkg.lastPublishedUser.email, { s: '50', d: 'retro' }, true);
      }
    }

    if (pkg.repository === 'undefined') {
      pkg.repository = null;
    }
    if (pkg.repository && pkg.repository.url) {
      pkg.repository.weburl = /^https?:\/\//.test(pkg.repository.url) ? pkg.repository.url : (giturl.parse(pkg.repository.url) || pkg.repository.url);
    }
    if (!pkg.bugs) {
      pkg.bugs = {};
    }

    setLicense(pkg);

    if (pkg.dist) {
      pkg.dist.size = bytes(pkg.dist.size || 0);
    }

    // if (pkg.name !== orginalName) {
    //   pkg.name = orginalName;
    // }

    const registryHost = registry.replace(/^https?:/, '');
    pkg.registryUrl = registryHost + '/' + pkg.name;

    // pkg.engines = {
    //   "python": ">= 0.11.9",
    //   "node": ">= 0.11.9",
    //   "node1": ">= 0.8.9",
    //   "node2": ">= 0.10.9",
    //   "node3": ">= 0.6.9",
    // };
    if (pkg.engines) {
      for (const k in pkg.engines) {
        const engine = String(pkg.engines[k] || '').trim();
        let color = 'blue';
        if (k.indexOf('node') === 0) {
          color = 'yellowgreen';
          let version = /(\d+\.\d+\.\d+)/.exec(engine);
          if (version) {
            version = version[0];
            if (/^0\.11\.\d+/.test(version)) {
              color = 'red';
            } else if (/^0\.10\./.test(version) ||
                /^0\.12\./.test(version) ||
                /^0\.14\./.test(version) ||
                /^[^0]+\./.test(version)) {
              color = 'brightgreen';
            }
          }
        }
        pkg.engines[k] = {
          version: engine,
          title: k + ': ' + engine,
          badgeURL: badgeURL + '/' + encodeURIComponent(k) +
            '-' + encodeURIComponent(engine) + '-' + color + '.svg?style=flat-square',
        };
      }
    }

    if (pkg._publish_on_cnpm) {
      pkg.isPrivate = true;
    } else {
      pkg.isPrivate = false;
      // add security check badge
      pkg.snyk = {
        badge: `${snykURL}/test/npm/${pkg.name}/badge.svg?style=flat-square`,
        url: `${snykURL}/test/npm/${pkg.name}`,
      };
    }
  }
};

function setLicense(pkg) {
  let license;
  license = pkg.license || pkg.licenses || pkg.licence || pkg.licences;
  if (!license) {
    return;
  }

  if (Array.isArray(license)) {
    license = license[0];
  }

  if (typeof license === 'object') {
    pkg.license = {
      name: license.name || license.type,
      url: license.url,
    };
  }

  if (typeof license === 'string') {
    if (license.match(/(http|https)(:\/\/)/ig)) {
      pkg.license = {
        name: license,
        url: license,
      };
    } else {
      pkg.license = {
        url: getOssLicenseUrlFromName(license),
        name: license,
      };
    }
  }
}

function getOssLicenseUrlFromName(name) {
  const base = 'http://opensource.org/licenses/';

  const licenseMap = {
    bsd: 'BSD-2-Clause',
    mit: 'MIT',
    x11: 'MIT',
    'mit/x11': 'MIT',
    'apache 2.0': 'Apache-2.0',
    apache2: 'Apache-2.0',
    'apache 2': 'Apache-2.0',
    'apache-2': 'Apache-2.0',
    apache: 'Apache-2.0',
    gpl: 'GPL-3.0',
    gplv3: 'GPL-3.0',
    gplv2: 'GPL-2.0',
    gpl3: 'GPL-3.0',
    gpl2: 'GPL-2.0',
    lgpl: 'LGPL-2.1',
    'lgplv2.1': 'LGPL-2.1',
    lgplv2: 'LGPL-2.1',
  };

  return licenseMap[name.toLowerCase()] ?
    base + licenseMap[name.toLowerCase()] : base + name;
}

'use strict';

const assert = require('assert');


module.exports = app => class PackageService extends app.Service {
  * getModule(name, tag) {
    assert(name, 'name is required');
    assert(tag, 'tag is required');
    const res = yield this.request(`/${name}/${tag}`);
    if (res.status === 404) {
      return null;
    }
    return res.data;
  }

  * request(url) {
    const { ctx, config } = this;
    const registry = config.cnpmjs.registry;
    console.log(registry, url);
    return yield ctx.curl(`${registry}${url}`, {
      dataType: 'json',
    });
  }

};

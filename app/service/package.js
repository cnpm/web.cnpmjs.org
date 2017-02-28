'use strict';

const assert = require('assert');


module.exports = app => class PackageService extends app.Service {
  async getModule(name, tag) {
    assert(name, 'name is required');
    assert(tag, 'tag is required');
    const res = await this.request(`/${name}/${tag}`);
    if (res.status === 404) {
      return null;
    }
    return res.data;
  }

  async request(url) {
    const { ctx, config } = this;
    const registry = config.cnpmjs.registry;
    console.log(registry, url);
    return await ctx.curl(`${registry}${url}`, {
      dataType: 'json',
    });
  }

};

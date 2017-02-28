'use strict';

const CNPM_REGISTRY = process.env.CNPM_REGISTRY;

module.exports = {
  cnpmjs: {
    registry: CNPM_REGISTRY || 'https://r.cnpmjs.org',
    badgeURL: 'https://img.shields.io/badge',
    snykURL: 'https://snyk.io',
    logoURL: 'https://os.alipayobjects.com/rmsportal/oygxuIUkkrRccUz.jpg', // cnpm logo image url
    adBanner: '',
  },

  notfound: {
    pageUrl: '/404',
  },

  view: {
    defaultViewEngine: 'ejs',
  },
};

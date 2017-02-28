'use strict';

module.exports = app => {
  app.locals = {
    config: app.config.cnpmjs,
  };
};

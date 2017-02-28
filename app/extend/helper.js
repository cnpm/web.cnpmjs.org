'use strict';

const xss = require('xss');
const MarkdownIt = require('markdown-it');

// allow class attr on code
xss.whiteList.code = [ 'class' ];

const md = new MarkdownIt({
  html: true,
  linkify: true,
});

module.exports = {
  renderMarkdown(content, filterXss) {
    let html = md.render(content);
    if (filterXss !== false) {
      html = xss(html);
    }
    return html;
  },
};

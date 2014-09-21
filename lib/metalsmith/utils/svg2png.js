/* global phantom */
var page = require('webpage').create();

page.viewportSize = {width: phantom.args[1], height: phantom.args[2]};
page.open(phantom.args[0], function (s) {
    console.log(page.renderBase64('PNG'));
    phantom.exit(0);
});

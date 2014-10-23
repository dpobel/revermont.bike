var casper = require('casper').create(),
    args = casper.cli.args,
    width = args[1],
    height = args[2],
    url = args[0],
    readyClass = args[4],
    wait = args[6],
    format = args[5],
    element = args[3];

casper.options.viewportSize = {width: width, height: height};

casper.start(url, function () {
    this.waitForSelector('.' + readyClass, function () {
        this.wait(wait, function () {
            this.echo(this.captureBase64(format, element));
            this.exit(0);
        });
    });
});
casper.run();

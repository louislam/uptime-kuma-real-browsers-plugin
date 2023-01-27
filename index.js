const path = require("path");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, "browsers");
const { chromium, firefox } = require("playwright");
const { log } = require("../../../src/util");
const childProcess = require("child_process");
const { Plugin } = require("../../../server/plugin");
const { BrowserMonitorType } = require("./browser-monitor-type");

class RealBrowserPlugin extends Plugin {

    /**
     *
     * @type {BrowserMonitorType}
     */
    browserMonitorType = null;

    /**
     *
     * @type {UptimeKumaServer}
     */
    server = null;

    /**
     *
     * @param {UptimeKumaServer} server
     */
    constructor(server) {
        super();
        this.server = server;
        log.debug("RBM", "Current plugin folder: " + __dirname);
        this.browserMonitorType = new BrowserMonitorType();
        server.addMonitorType(this.browserMonitorType);
    }

    async unload() {
        if (this.browserMonitorType) {
            await this.browserMonitorType.close();
            this.server.removeMonitorType(this.browserMonitorType);
        }
    }

    async test() {
        const browser = await firefox.launch({
            headless: false,
            //channel: "chrome",
        });
        let page = await browser.newPage();
        let response = await page.goto("https://google.com");
        log.debug("RBM", response.statusCode + " " + response.statusMessage);
    }
}

module.exports = RealBrowserPlugin;

const path = require("path");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, "browsers");
const { chromium, firefox } = require("playwright");
const { log } = require("../../../src/util");
const childProcess = require("child_process");
const MonitorType = require("../../../server/monitor-types/monitor-type");

class RealBrowserPlugin {
    /**
     *
     * @param {UptimeKumaServer} server
     */
    constructor(server) {
        log.debug("RBM", "Current plugin folder: " + __dirname);
        this.downloadBrowsers();
        server.addMonitorType(new RealBrowserMonitorType());
        this.test();
    }

    async test() {
        const browser = await firefox.launch({
            headless: false,
            //channel: "chrome",
        });
        let page = await browser.newPage();
        await page.goto("https://google.com");
    }

    downloadBrowsers() {
        log.info("RBM", "Check and download browsers if not exist");
        childProcess.execSync("npm install", {
            cwd: __dirname,
        });
        log.info("RBM", "Browsers ready");
    }
}

class RealBrowserMonitorType extends MonitorType {
}

module.exports = RealBrowserPlugin;

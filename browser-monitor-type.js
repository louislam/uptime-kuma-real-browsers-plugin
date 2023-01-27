const { MonitorType } = require("../../../server/monitor-types/monitor-type");
const { firefox } = require("playwright");
const { UP, log } = require("../../../src/util");
const dayjs = require("dayjs");

class BrowserMonitorType extends MonitorType {

    name = "browser";

    /**
     *
     * @type {Browser}
     */
    firefoxBrowser = null;

    async check(monitor, heartbeat) {
        const browser = await this.getBrowser();
        let page = await browser.newPage();

        let startTime = dayjs().valueOf();
        const response = await page.goto(monitor.url);
        let ping = dayjs().valueOf() - startTime;

        //await page.screenshot({ path: "screenshot.png" });
        await page.close();

        log.debug("RBM", response);

        if (response.status() === 200) {
            heartbeat.status = UP;
            heartbeat.msg = response.statusText();
            heartbeat.ping = ping;
        } else {
            throw new Error(response.statusText());
        }
    }

    async getBrowser() {
        return await this.getFirefox();
    }

    async getFirefox() {
        if (!this.firefoxBrowser) {
            this.firefoxBrowser = await firefox.launch({
                //headless: false,
                //channel: "chrome",
            });
        }
        return this.firefoxBrowser;
    }

    async close() {
        if (this.firefoxBrowser) {
            await this.firefoxBrowser.close();
        }
    }
}

module.exports = {
    BrowserMonitorType,
};

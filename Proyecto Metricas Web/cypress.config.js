const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const fs = require("fs");

module.exports = {
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        lighthouse: lighthouse(),

        ensureFile(filepath) {
          if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, JSON.stringify([]), "utf8");
          }
          return null;
        },
      });
    },
  },
  env: {
    urlPagina: 'https://practicesoftwaretesting.com/',
    devices: [
      { name: 'Moto G', width: 412, height: 823, deviceScaleFactor: 2, formFactor: 'mobile' },
      { name: 'Escritorio 1350x940', width: 1350, height: 940, deviceScaleFactor: 1, formFactor: 'desktop' },
      { name: 'iPhone 14 Pro Max', width: 430, height: 932, deviceScaleFactor: 3, formFactor: 'mobile' },
      { name: 'Escritorio 1920x1080', width: 1920, height: 1080, deviceScaleFactor: 1, formFactor: 'desktop' }
    ],
  },
};

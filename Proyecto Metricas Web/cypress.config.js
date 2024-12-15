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

        // Nueva tarea para garantizar que el archivo exista
        ensureFile(filepath) {
          if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, JSON.stringify([]), "utf8");
          }
          return null;
        },
      });
    },
  },
};

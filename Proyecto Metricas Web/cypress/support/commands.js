// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "@cypress-audit/lighthouse/commands";

// Comando para asegurarse de que el archivo JSON existe o se crea vacío
Cypress.Commands.add('ensureFileExists', (filepath) => {
    cy.task('ensureFile', filepath);
});

// Comando para ejecutar Lighthouse en un dispositivo y devolver los resultados
Cypress.Commands.add('runLighthouseOnDevice', (device, urlPagina) => {
    const command = `lighthouse ${urlPagina} ` +
        `--output json ` +
        `--output-path cypress/fixtures/reports/lighthouse-report-${device.name.replace(/\s+/g, '_')}.json ` +
        `--emulated-form-factor ${device.formFactor} ` +
        `--throttling-method=devtools ` +
        `--chrome-flags='--headless --disable-gpu' ` +
        `--screenEmulation.width=${device.width} ` +
        `--screenEmulation.height=${device.height} ` +
        `--screenEmulation.deviceScaleFactor=${device.deviceScaleFactor}`;

    return cy.exec(command).then((result) => {
        expect(result.code).to.equal(0);

        const reportPath = `cypress/fixtures/reports/lighthouse-report-${device.name.replace(/\s+/g, '_')}.json`;

        return cy.readFile(reportPath);
    });
});

// Comando para guardar métricas Lighthouse en un archivo
Cypress.Commands.add('saveLighthouseMetrics', (metrics, filepath) => {
    cy.readFile(filepath, { log: false }).then((existingData) => {
        const updatedData = Array.isArray(existingData)
            ? existingData.concat(metrics)
            : [metrics];

        cy.writeFile(filepath, updatedData);
    });
});

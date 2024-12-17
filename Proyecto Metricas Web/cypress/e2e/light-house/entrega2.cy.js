/// <reference types="cypress" />

const urlPagina = Cypress.env('urlPagina');
const devices = Cypress.env('devices');
const metricsFile = 'cypress/fixtures/lighthouse-metrics.json';

describe("Lighthouse tests for multiple devices", () => {
  before(() => {
    // Asegurarse de que el archivo existe
    cy.ensureFileExists(metricsFile);
  });

  devices.forEach(device => {
    it(`Debe ejecutar Lighthouse para ${device.name}`, () => {
      // Ejecutar Lighthouse en el dispositivo
      cy.runLighthouseOnDevice(device, urlPagina).then((json) => {
        // Extraer métricas necesarias
        const metrics = {
          screenEmulation: `${device.name} (${device.width}x${device.height})`,
          timestamp: new Date().toISOString(),
          firstContentfulPaint: json.audits['first-contentful-paint'].displayValue,
          largestContentfulPaint: json.audits['largest-contentful-paint'].displayValue,
          speedIndex: json.audits['speed-index'].displayValue,
          performance: json.categories.performance.score * 100,
        };

        // Guardar las métricas en el archivo
        cy.saveLighthouseMetrics(metrics, metricsFile);
      });
    });
  });
});


//definimos un array con los dispositivos que vamos a evaluar el performance
const devices = [
    { name: 'Moto G', width: 412, height: 823, deviceScaleFactor: 2, formFactor: 'mobile' },
    { name: 'Escritorio 1350x940', width: 1350, height: 940, deviceScaleFactor: 1, formFactor: 'desktop' },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, deviceScaleFactor: 3, formFactor: 'mobile' },
    { name: 'Escritorio 1920x1080', width: 1920, height: 1080, deviceScaleFactor: 1, formFactor: 'desktop' }
];

describe("Lighthouse tests for multiple dispositivos", () => {
    // Verificar si el archivo existe, y crearlo si no existe
    before(() => {
        cy.task('ensureFile', 'cypress/fixtures/lighthouse-metrics.json');
    });

    devices.forEach(device => {
        it(`Debe ejecutar Lighthouse para ${device.name}`, () => {

            //comando donde se ejecuta y modifica los tipos y dimensiones de los dispositivos con lighthouse
            const command = `lighthouse https://practicesoftwaretesting.com/ ` +
                `--output json ` +
                `--output-path ./lighthouse-report-${device.name.replace(/\s+/g, '_')}.json ` +
                `--emulated-form-factor ${device.formFactor} ` +
                `--throttling-method=devtools ` +
                `--chrome-flags='--headless --disable-gpu' ` +
                `--screenEmulation.width=${device.width} ` +
                `--screenEmulation.height=${device.height} ` +
                `--screenEmulation.deviceScaleFactor=${device.deviceScaleFactor}`;

            //se eejecuta el comando para hacer seguimeinto a las metricas web    
            cy.exec(command)
                .then((result) => {
                    expect(result.code).to.equal(0);

                    const reportPath = `./lighthouse-report-${device.name.replace(/\s+/g, '_')}.json`;
                    cy.readFile(reportPath).then((json) => {


                        //se obtienen del report solo las metricas necesarias
                        const firstContentfulPaint = json.audits['first-contentful-paint'].numericValue;
                        const largestContentfulPaint = json.audits['largest-contentful-paint'].numericValue;
                        const speedIndex = json.audits['speed-index'].numericValue;
                        const performance = json.categories.performance.score * 100;

                        //se arma el array que se va guardar ene l archivo .json
                        const lighthouseMetrics = {
                            "screenEmulation": `${device.name} (${device.width}x${device.height})`,
                            "timestamp": new Date().toISOString(),
                            "first-contentful-paint": firstContentfulPaint,
                            "largest-contentful-paint": largestContentfulPaint,
                            "speed-index": speedIndex,
                            "performance": performance
                        };
                        

                        //se valida si el archivo existe para concatenar mas información
                        cy.readFile('cypress/fixtures/lighthouse-metrics.json', { log: false })
                            .then((existingData) => {
                                const updatedData = Array.isArray(existingData)
                                    ? existingData.concat(lighthouseMetrics)
                                    : [lighthouseMetrics];

                                cy.writeFile('cypress/fixtures/lighthouse-metrics.json', updatedData);
                            });
                    });
                });
        });
    });
});

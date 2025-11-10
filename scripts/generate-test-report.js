#!/usr/bin/env node

/**
 * generate-test-report.js
 * Script para generar reporte con estadísticas básicas de los tests
 * Versión 1.0 - Reporte compacto
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const reportsDir = join(projectRoot, 'tests', 'reports');

mkdirSync(reportsDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('-').slice(0, 3).join('-') + 
                 '_' + new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const reportFile = join(reportsDir, `test-results_${timestamp}.txt`);

let report = '';
const now = new Date();

report += '═════════════════════════════════════════════════════════════════════\n';
report += 'AURORA CHATBOT - TEST RESULTS\n';
report += '═════════════════════════════════════════════════════════════════════\n\n';

report += `Fecha: ${now.toLocaleDateString('es-ES')}\n`;
report += `Hora: ${now.toLocaleTimeString('es-ES')}\n`;
report += `Node.js: ${process.version}\n`;
report += `OS: ${process.platform}\n\n`;

const testSuites = [
  { name: 'AuroraSanitizer', file: 'tests/modules/aurora-sanitizer.test.ts' },
  { name: 'AuroraMessageManager', file: 'tests/modules/aurora-message-manager.test.ts' },
  { name: 'AuroraChatFrame', file: 'tests/modules/aurora-chat-frame.test.ts' }
];

let totalTests = 0, totalPassed = 0, totalFailed = 0;
const startTime = Date.now();

testSuites.forEach((suite) => {
  report += `\nTest Suite: ${suite.name}\n`;
  report += '─'.repeat(65) + '\n';

  try {
    let output = '';
    try {
      output = execSync(`npm test -- ${suite.file} 2>&1`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 200 * 1024 * 1024
      });
    } catch (e) {
      output = e.stdout || e.stderr || e.toString();
    }

    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);

    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;

    totalTests += passed + failed;
    totalPassed += passed;
    totalFailed += failed;

    report += `Pasados: ${passed}\n`;
    report += `Fallidos: ${failed}\n`;
    report += `Total: ${passed + failed}\n`;

  } catch (error) {
    report += `Error al ejecutar suite\n`;
  }
});

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

report += '\n' + '═'.repeat(65) + '\n';
report += 'ESTADISTICAS TOTALES\n';
report += '═'.repeat(65) + '\n\n';

report += `Total de tests: ${totalTests}\n`;
report += `Pasados: ${totalPassed}\n`;
report += `Fallidos: ${totalFailed}\n`;
report += `Tiempo total: ${totalDuration}s\n\n`;

const globalRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0;
report += `Tasa de exito: ${globalRate}%\n\n`;

if (totalFailed === 0 && totalTests > 0) {
  report += '[SUCCESS] TODOS LOS TESTS PASARON CORRECTAMENTE\n';
} else {
  report += `[WARNING] Se encontraron ${totalFailed} test(s) fallido(s)\n`;
}

report += '\n' + '═'.repeat(65) + '\n';

writeFileSync(reportFile, report, 'utf-8');

console.log(report);
console.log(`\nReporte guardado en: ${reportFile}\n`);

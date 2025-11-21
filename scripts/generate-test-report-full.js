#!/usr/bin/env node

/**
 * generate-test-report-full.js
 * Purpose: Exhaustive test-report generator that runs the full test
 * suite with verbose output and writes a detailed breakdown file
 * including per-suite timings and pass/fail statistics. Useful for
 * deeper CI reports or manual debugging when failures occur.
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
const reportFile = join(reportsDir, `test-results-detailed_${timestamp}.txt`);

let report = '';
const now = new Date();

// HEADER
report += '╔═══════════════════════════════════════════════════════════════════════╗\n';
report += '║       AURORA CHATBOT - TEST RESULTS REPORT (COMPLETE BREAKDOWN)      ║\n';
report += '╚═══════════════════════════════════════════════════════════════════════╝\n\n';

report += `Fecha: ${now.toLocaleDateString('es-ES')}\n`;
report += `Hora: ${now.toLocaleTimeString('es-ES')}\n`;
report += `Proyecto: Aurora Frontend - Chatbot Testing Suite\n`;
report += `Version: 4.0 (DESGLOSE EXHAUSTIVO)\n\n`;

report += '───────────────────────────────────────────────────────────────────────\n';
report += 'INFORMACION DEL SISTEMA\n';
report += '───────────────────────────────────────────────────────────────────────\n';
report += `Node.js: ${process.version}\n`;
report += `OS: ${process.platform}\n`;
report += `Directorio: ${projectRoot}\n\n`;

// TEST SUITES
const testSuites = [
  { name: 'AuroraSanitizer', file: 'tests/modules/aurora-sanitizer.test.ts', cases: 20 },
  { name: 'AuroraMessageManager', file: 'tests/modules/aurora-message-manager.test.ts', cases: 25 },
  { name: 'AuroraChatFrame', file: 'tests/modules/aurora-chat-frame.test.ts', cases: 25 }
];

report += '═══════════════════════════════════════════════════════════════════════\n';
report += 'EJECUCION DE TESTS - DESGLOSE COMPLETO POR CADA TEST\n';
report += '═══════════════════════════════════════════════════════════════════════\n\n';

let totalTests = 0, totalPassed = 0, totalFailed = 0;
const startTime = Date.now();

testSuites.forEach((suite, idx) => {
  const suiteStart = Date.now();
  
  report += `\n${'═'.repeat(75)}\n`;
  report += `[SUITE ${idx + 1}/3]: ${suite.name}\n`;
  report += `${'═'.repeat(75)}\n\n`;

  try {
    let output = '';
    try {
      output = execSync(`npm test -- ${suite.file} --verbose --no-colors 2>&1`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 200 * 1024 * 1024
      });
    } catch (e) {
      output = e.stdout || e.stderr || e.toString();
    }

    const duration = ((Date.now() - suiteStart) / 1000).toFixed(2);
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);
    
    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;
    const total = passed + failed > 0 ? passed + failed : suite.cases;

    totalTests += total;
    totalPassed += passed;
    totalFailed += failed;

    // RESUMEN DE SUITE
    report += `RESUMEN RAPIDO:\n`;
    report += `  Total: ${total} tests\n`;
    report += `  Pasados: ${passed}\n`;
    report += `  Fallidos: ${failed}\n`;
    report += `  Duracion: ${duration}s\n\n`;

    if (total > 0) {
      report += `Tasa de exito: ${((passed/total)*100).toFixed(1)}%\n\n`;
    }

    // DESGLOSE DE TESTS
    report += `${'─'.repeat(75)}\n`;
    report += `DESGLOSE DETALLADO DE CADA TEST:\n`;
    report += `${'─'.repeat(75)}\n\n`;

    // Limpiar códigos ANSI de la salida (escape sequences)
    let cleanOutput = output;
    // Eliminar emojis y caracteres especiales problemáticos de forma simple
    cleanOutput = cleanOutput
      // Limpiar línea por línea
      .split('\n')
      .map(line => {
        // Remover caracteres especiales que causan problemas
        return line
          .replace(/[^\x20-\x7E\n\t]/g, '') // Reemplazar caracteres no-ASCII
          .trimEnd();
      })
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n'); // Normalizar espacios en blanco
    
    // Extraer lista de tests
    const testLines = cleanOutput.split('\n');
    let passCount = 1;
    let failCount = 1;

    for (let i = 0; i < testLines.length; i++) {
      const line = testLines[i];
      
      // Detectar test pasado (✓ o ✔)
      if ((line.includes('✓') || line.includes('✔')) && !line.includes('●')) {
        const testName = line.replace(/✓|✔/g, '').trim();
        if (testName && !testName.includes('ms)')) {
          report += `${passCount}. [OK] ${testName}\n`;
          report += `   Estado: PASADO\n\n`;
          passCount++;
        }
      }
      
      // Detectar test fallido (●)
      if (line.includes('●') || line.includes('ÔùÅ')) {
        const testName = line.replace(/●|ÔùÅ/g, '').trim();
        if (testName) {
          report += `${failCount}. [FAIL] ${testName}\n`;
          report += `   Estado: FALLIDO\n`;
          
          // Buscar detalles del error
          let errorFound = false;
          for (let j = i + 1; j < Math.min(i + 20, testLines.length); j++) {
            const errorLine = testLines[j].trim();
            
            if (errorLine.includes('Expected:')) {
              const expected = errorLine.replace('Expected:', '').trim();
              report += `   Expected: ${expected}\n`;
              errorFound = true;
            }
            
            if (errorLine.includes('Received:')) {
              const received = errorLine.replace('Received:', '').trim();
              report += `   Received: ${received}\n`;
              errorFound = true;
            }
            
            if (errorLine.includes('expect(') && !errorLine.includes('Expected') && !errorLine.includes('Received')) {
              const cleanLine = errorLine.replace(/\s+/g, ' ').substring(0, 120);
              report += `   Assertion: ${cleanLine}\n`;
            }
            
            if (errorLine.includes('at ') && errorLine.includes('.test.ts')) {
              const locationMatch = errorLine.match(/at .*?\.test\.ts:\d+:\d+/);
              if (locationMatch) {
                report += `   Location: ${locationMatch[0]}\n`;
              }
            }
            
            if (errorLine.includes('●') || errorLine.includes('ÔùÅ') || 
                (errorFound && errorLine === '')) {
              break;
            }
          }
          
          report += `\n`;
          failCount++;
        }
      }
    }

    // ESTADÍSTICAS DE SUITE
    report += `\n${'─'.repeat(75)}\n`;
    report += `ESTADISTICAS DE SUITE:\n`;
    report += `${'─'.repeat(75)}\n`;
    report += `Archivo: ${suite.file}\n`;
    report += `Total de tests: ${total}\n`;
    report += `Pasados: ${passed} (${passed > 0 ? ((passed/total)*100).toFixed(1) : 0}%)\n`;
    report += `Fallidos: ${failed} (${failed > 0 ? ((failed/total)*100).toFixed(1) : 0}%)\n`;
    report += `Tiempo: ${duration}s\n`;
    report += `Estado General: ${failed === 0 ? '[OK] EXITOSO' : '[FAIL] CON FALLOS'}\n\n`;

  } catch (error) {
    report += `[ERROR] ERROR CRITICO: ${error.toString().substring(0, 150)}\n\n`;
    totalFailed += suite.cases;
    totalTests += suite.cases;
  }
});

// RESUMEN GLOBAL
const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

report += `\n${'═'.repeat(75)}\n`;
report += `RESUMEN GLOBAL FINAL\n`;
report += `${'═'.repeat(75)}\n\n`;

report += `ESTADISTICAS TOTALES:\n`;
report += `  Total de tests: ${totalTests}\n`;
report += `  Pasados: ${totalPassed}\n`;
report += `  Fallidos: ${totalFailed}\n`;
report += `  Tiempo total: ${totalDuration}s\n\n`;

const globalRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0;
report += `TASA GLOBAL DE EXITO: ${globalRate}%\n\n`;

if (totalFailed === 0 && totalTests > 0) {
  report += '[SUCCESS] TODOS LOS TESTS PASARON CORRECTAMENTE\n';
  report += '   La suite esta lista para produccion.\n';
} else {
  report += `[WARNING] Se encontraron ${totalFailed} test(s) fallido(s) de ${totalTests} totales\n`;
  report += '   Revisar la seccion "DESGLOSE DETALLADO" arriba para cada caso\n';
}

// RECOMENDACIONES
report += `\n${'═'.repeat(75)}\n`;
report += `RECOMENDACIONES\n`;
report += `${'═'.repeat(75)}\n\n`;

if (totalFailed > 0) {
  report += `Hay ${totalFailed} error(s) que necesitan atencion:\n\n`;
  report += '1. Revisar cada test fallido en el desglose anterior\n';
  report += '2. Analizar Expected vs Received en cada caso\n';
  report += '3. Identificar el patron comun en los errores\n';
  report += '4. Corregir el codigo fuente correspondiente\n';
  report += '5. Ejecutar nuevamente: npm run test:full-report\n\n';
  report += 'Documentacion:\n';
  report += '  * tests/TEST_CASES_SANITIZER.md\n';
  report += '  * tests/TEST_CASES_MESSAGE_MANAGER.md\n';
  report += '  * tests/TEST_CASES_CHAT_FRAME.md\n';
}

report += `\n${'═'.repeat(75)}\n`;
report += `Reporte guardado: ${reportFile}\n`;
report += `Finalizado: ${now.toLocaleString('es-ES')}\n`;
report += `${'═'.repeat(75)}\n`;

// Guardar
writeFileSync(reportFile, report, 'utf-8');

console.log(report);
console.log(`\nReporte detallado guardado en: ${reportFile}\n`);

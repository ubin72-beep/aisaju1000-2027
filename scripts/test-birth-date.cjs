// Run with: npm run test:birth
// Uses the project's existing TypeScript dependency; no additional runtime packages.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const file = path.join(__dirname, '..', 'src', 'lib', 'birth-date-validation.ts');
const source = fs.readFileSync(file, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
  reportDiagnostics: true,
});
if (compiled.diagnostics?.some(d => d.category === ts.DiagnosticCategory.Error)) {
  throw new Error('TypeScript transpilation failed');
}
const exportsObject = {};
vm.runInNewContext(compiled.outputText, {exports: exportsObject, Date, Intl}, {filename: file});
const {validateBirthDate} = exportsObject;
const now = new Date('2026-11-10T12:00:00.000Z'); // 2026-11-10 21:00 KST

function check(date, calendar, valid, verified) {
  const actual = validateBirthDate(date, calendar, now);
  assert.equal(actual.valid, valid, date + ' ' + calendar);
  if (valid) assert.equal(actual.verified, verified, date + ' verification');
}
check('2000-02-29', 'solar', true, true);
check('1900-02-29', 'solar', false);
check('2025-02-29', 'solar', false);
check('2024-04-31', 'solar', false);
check('2026-11-11', 'solar', false);
check('2026-11-10', 'solar', true, true);
check('1899-12-31', 'solar', false);
check('1990-02-30', 'lunar', true, false); // notation only, NOT a confirmed lunar date
check('1990-02-31', 'lunar', false);
check('1990-13-01', 'lunar', false);
check('2027-01-01', 'lunar', false);
check('1990/02/01', 'lunar', false);
console.log('Birth date validation: 12 cases passed (lunar cases are notation checks only).');

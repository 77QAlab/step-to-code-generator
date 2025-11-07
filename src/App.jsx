import React, { useState, useEffect } from 'react';
import { Download, Upload, Play, Settings, Plus, Trash2, Copy, FileText, Github, Target, Database } from 'lucide-react';
import { trackDownload, trackCSVImport, trackCSVExport, trackFrameworkChange, trackCodeCopy, trackCustomTemplate } from './utils/analytics';
import StepAutocomplete from './components/StepAutocomplete';
import SelectorHelper from './components/SelectorHelper';
import TestDataManager from './components/TestDataManager';

// Predefined step templates for common actions
const DEFAULT_TEMPLATES = {
  playwright: {
    navigate: { pattern: "navigate to {url}", code: "await page.goto('{url}');" },
    click: { pattern: "click {selector}", code: "await page.click('{selector}');" },
    doubleClick: { pattern: "double click {selector}", code: "await page.dblclick('{selector}');" },
    rightClick: { pattern: "right click {selector}", code: "await page.click('{selector}', { button: 'right' });" },
    hover: { pattern: "hover over {selector}", code: "await page.hover('{selector}');" },
    type: { pattern: "type {text} into {selector}", code: "await page.fill('{selector}', '{text}');" },
    clear: { pattern: "clear {selector}", code: "await page.fill('{selector}', '');" },
    select: { pattern: "select {option} from {selector}", code: "await page.selectOption('{selector}', '{option}');" },
    check: { pattern: "check {selector}", code: "await page.check('{selector}');" },
    uncheck: { pattern: "uncheck {selector}", code: "await page.uncheck('{selector}');" },
    press: { pattern: "press {key} on {selector}", code: "await page.press('{selector}', '{key}');" },
    pressKey: { pattern: "press {key}", code: "await page.keyboard.press('{key}');" },
    scroll: { pattern: "scroll to {selector}", code: "await page.locator('{selector}').scrollIntoViewIfNeeded();" },
    goBack: { pattern: "go back", code: "await page.goBack();" },
    goForward: { pattern: "go forward", code: "await page.goForward();" },
    refresh: { pattern: "refresh page", code: "await page.reload();" },
    see: { pattern: "see text {text}", code: "await expect(page.locator('body')).toContainText('{text}');" },
    seeElement: { pattern: "see element {selector}", code: "await expect(page.locator('{selector}')).toBeVisible();" },
    notSeeElement: { pattern: "not see element {selector}", code: "await expect(page.locator('{selector}')).not.toBeVisible();" },
    verifyText: { pattern: "verify {selector} contains {text}", code: "await expect(page.locator('{selector}')).toContainText('{text}');" },
    verifyValue: { pattern: "verify {selector} has value {value}", code: "await expect(page.locator('{selector}')).toHaveValue('{value}');" },
    verifyCount: { pattern: "verify {selector} has {count} items", code: "await expect(page.locator('{selector}')).toHaveCount({count});" },
    wait: { pattern: "wait for {selector}", code: "await page.waitForSelector('{selector}');" },
    waitForText: { pattern: "wait for text {text}", code: "await page.waitForSelector('text={text}');" },
    screenshot: { pattern: "take screenshot", code: "await page.screenshot({ path: 'screenshot.png' });" },
    screenshotElement: { pattern: "take screenshot of {selector}", code: "await page.locator('{selector}').screenshot({ path: 'screenshot.png' });" },
  },
  cypress: {
    navigate: { pattern: "navigate to {url}", code: "cy.visit('{url}');" },
    click: { pattern: "click {selector}", code: "cy.get('{selector}').click();" },
    doubleClick: { pattern: "double click {selector}", code: "cy.get('{selector}').dblclick();" },
    rightClick: { pattern: "right click {selector}", code: "cy.get('{selector}').rightclick();" },
    hover: { pattern: "hover over {selector}", code: "cy.get('{selector}').trigger('mouseover');" },
    type: { pattern: "type {text} into {selector}", code: "cy.get('{selector}').type('{text}');" },
    clear: { pattern: "clear {selector}", code: "cy.get('{selector}').clear();" },
    select: { pattern: "select {option} from {selector}", code: "cy.get('{selector}').select('{option}');" },
    check: { pattern: "check {selector}", code: "cy.get('{selector}').check();" },
    uncheck: { pattern: "uncheck {selector}", code: "cy.get('{selector}').uncheck();" },
    press: { pattern: "press {key} on {selector}", code: "cy.get('{selector}').type('{key}');" },
    pressKey: { pattern: "press {key}", code: "cy.get('body').type('{key}');" },
    scroll: { pattern: "scroll to {selector}", code: "cy.get('{selector}').scrollIntoView();" },
    goBack: { pattern: "go back", code: "cy.go('back');" },
    goForward: { pattern: "go forward", code: "cy.go('forward');" },
    refresh: { pattern: "refresh page", code: "cy.reload();" },
    see: { pattern: "see text {text}", code: "cy.contains('{text}').should('be.visible');" },
    seeElement: { pattern: "see element {selector}", code: "cy.get('{selector}').should('be.visible');" },
    notSeeElement: { pattern: "not see element {selector}", code: "cy.get('{selector}').should('not.exist');" },
    verifyText: { pattern: "verify {selector} contains {text}", code: "cy.get('{selector}').should('contain', '{text}');" },
    verifyValue: { pattern: "verify {selector} has value {value}", code: "cy.get('{selector}').should('have.value', '{value}');" },
    verifyCount: { pattern: "verify {selector} has {count} items", code: "cy.get('{selector}').should('have.length', {count});" },
    wait: { pattern: "wait for {selector}", code: "cy.get('{selector}').should('exist');" },
    waitForText: { pattern: "wait for text {text}", code: "cy.contains('{text}').should('be.visible');" },
    screenshot: { pattern: "take screenshot", code: "cy.screenshot('screenshot');" },
    screenshotElement: { pattern: "take screenshot of {selector}", code: "cy.get('{selector}').screenshot('screenshot');" },
  },
  testcafe: {
    navigate: { pattern: "navigate to {url}", code: "await t.navigateTo('{url}');" },
    click: { pattern: "click {selector}", code: "await t.click(Selector('{selector}'));" },
    doubleClick: { pattern: "double click {selector}", code: "await t.doubleClick(Selector('{selector}'));" },
    rightClick: { pattern: "right click {selector}", code: "await t.rightClick(Selector('{selector}'));" },
    hover: { pattern: "hover over {selector}", code: "await t.hover(Selector('{selector}'));" },
    type: { pattern: "type {text} into {selector}", code: "await t.typeText(Selector('{selector}'), '{text}');" },
    clear: { pattern: "clear {selector}", code: "await t.selectText(Selector('{selector}')).pressKey('delete');" },
    select: { pattern: "select {option} from {selector}", code: "await t.click(Selector('{selector}')).click(Selector('{selector} option').withText('{option}'));" },
    check: { pattern: "check {selector}", code: "await t.click(Selector('{selector}'));" },
    uncheck: { pattern: "uncheck {selector}", code: "await t.click(Selector('{selector}'));" },
    press: { pattern: "press {key} on {selector}", code: "await t.pressKey(Selector('{selector}'), '{key}');" },
    pressKey: { pattern: "press {key}", code: "await t.pressKey('{key}');" },
    scroll: { pattern: "scroll to {selector}", code: "await t.scroll(Selector('{selector}'), 'top');" },
    goBack: { pattern: "go back", code: "await t.eval(() => window.history.back());" },
    goForward: { pattern: "go forward", code: "await t.eval(() => window.history.forward());" },
    refresh: { pattern: "refresh page", code: "await t.eval(() => location.reload());" },
    see: { pattern: "see text {text}", code: "await t.expect(Selector('body').innerText).contains('{text}');" },
    seeElement: { pattern: "see element {selector}", code: "await t.expect(Selector('{selector}').exists).ok();" },
    notSeeElement: { pattern: "not see element {selector}", code: "await t.expect(Selector('{selector}').exists).notOk();" },
    verifyText: { pattern: "verify {selector} contains {text}", code: "await t.expect(Selector('{selector}').innerText).contains('{text}');" },
    verifyValue: { pattern: "verify {selector} has value {value}", code: "await t.expect(Selector('{selector}').value).eql('{value}');" },
    verifyCount: { pattern: "verify {selector} has {count} items", code: "await t.expect(Selector('{selector}').count).eql({count});" },
    wait: { pattern: "wait for {selector}", code: "await t.expect(Selector('{selector}').exists).ok();" },
    waitForText: { pattern: "wait for text {text}", code: "await t.expect(Selector('body').innerText).contains('{text}');" },
    screenshot: { pattern: "take screenshot", code: "await t.takeScreenshot('screenshot.png');" },
    screenshotElement: { pattern: "take screenshot of {selector}", code: "await t.takeElementScreenshot(Selector('{selector}'), 'screenshot.png');" },
  }
};

const FRAMEWORKS = {
  playwright: {
    name: 'Playwright',
    imports: "// Playwright Test - Add this import in your test file:\n// import { test, expect } from '@playwright/test';",
    generate: ({ testName, stepsCode, hasDatasets, datasetDeclaration, datasetArrayName, datasetVarName }) => {
      if (!hasDatasets) {
        return `test('${testName}', async ({ page }) => {\n${stepsCode}\n});`;
      }

      return `${datasetDeclaration}\n\ntest.describe('${testName}', () => {\n  for (const [index, ${datasetVarName}] of ${datasetArrayName}.entries()) {\n    const label = ${datasetVarName}.name ?? ${datasetVarName}.username ?? ${datasetVarName}.email ?? \`row \${index + 1}\`;\n    test(\`Dataset \${label}\`, async ({ page }) => {\n${stepsCode}\n    });\n  }\n});`;
    }
  },
  cypress: {
    name: 'Cypress',
    imports: "// Cypress Test",
    generate: ({ testName, stepsCode, hasDatasets, datasetDeclaration, datasetArrayName, datasetVarName }) => {
      if (!hasDatasets) {
        return `describe('${testName}', () => {\n  it('should complete test', () => {\n${stepsCode}\n  });\n});`;
      }

      return `${datasetDeclaration}\n\ndescribe('${testName}', () => {\n  ${datasetArrayName}.forEach((${datasetVarName}, index) => {\n    const label = ${datasetVarName}.name ?? ${datasetVarName}.username ?? ${datasetVarName}.email ?? \`row \${index + 1}\`;\n    it(\`Dataset \${label}\`, () => {\n${stepsCode}\n    });\n  });\n});`;
    }
  },
  testcafe: {
    name: 'TestCafe',
    imports: "// TestCafe Test - Add this import in your test file:\n// import { Selector } from 'testcafe';",
    generate: ({ testName, stepsCode, hasDatasets, datasetDeclaration, datasetArrayName, datasetVarName }) => {
      if (!hasDatasets) {
        return `fixture('${testName}')\n  .page('http://localhost:3000');\n\ntest('should complete test', async t => {\n${stepsCode}\n});`;
      }

      return `${datasetDeclaration}\n\nfixture('${testName}')\n  .page('http://localhost:3000');\n\nfor (const [index, ${datasetVarName}] of ${datasetArrayName}.entries()) {\n  const label = ${datasetVarName}.name ?? ${datasetVarName}.username ?? ${datasetVarName}.email ?? \`row \${index + 1}\`;\n  test(\`Dataset \${label}\`, async t => {\n${stepsCode}\n  });\n}`;
    }
  }
};

const indentCode = (code, spaces) => {
  if (!code) return '';
  const padding = ' '.repeat(spaces);
  return code
    .split('\n')
    .map(line => (line ? padding + line : line))
    .join('\n');
};

export default function TestGenerator() {
  // STATE: All the data your app needs to remember
  const [framework, setFramework] = useState('playwright');
  const [testName, setTestName] = useState('My Test');
  const [steps, setSteps] = useState(['navigate to https://example.com', 'click #submit-button']);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showSelectorHelper, setShowSelectorHelper] = useState(false);
  const [showTestDataManager, setShowTestDataManager] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ pattern: '', code: '' });
  const [unmappedSteps, setUnmappedSteps] = useState([]);
  const [focusedStepIndex, setFocusedStepIndex] = useState(null);
  const [testData, setTestData] = useState({
    variables: [],
    datasets: []
  });

  // EFFECT: Regenerate code whenever something changes
  useEffect(() => {
    generateCode();
  }, [framework, testName, steps, customTemplates, testData]);

  // EFFECT: Track framework changes (skip initial render)
  const isInitialMount = React.useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (framework) {
      trackFrameworkChange(framework);
    }
  }, [framework]);

  // FUNCTION: Parse a step and extract parameters
  const parseStep = (step, template) => {
    const pattern = template.pattern.toLowerCase();
    const stepLower = step.toLowerCase();
    
    // Extract parameter names from pattern (e.g., {url}, {selector})
    const paramNames = (pattern.match(/\{(\w+)\}/g) || []).map(p => p.slice(1, -1));
    
    // Convert pattern to regex
    let regexPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    paramNames.forEach(param => {
      regexPattern = regexPattern.replace(`\\{${param}\\}`, '(.+?)');
    });
    
    const regex = new RegExp('^' + regexPattern + '$');
    const match = stepLower.match(regex);
    
    if (!match) return null;
    
    const params = {};
    paramNames.forEach((name, i) => {
      params[name] = match[i + 1].trim();
    });
    
    return params;
  };

  // FUNCTION: Generate code for a single step
  const generateStepCode = (step) => {
    const allTemplates = { ...DEFAULT_TEMPLATES[framework] };
    customTemplates.forEach((t, i) => {
      allTemplates[`custom_${i}`] = t;
    });

    for (const template of Object.values(allTemplates)) {
      const params = parseStep(step, template);
      if (params) {
        let code = template.code;
        Object.entries(params).forEach(([key, value]) => {
          code = code.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        });
        return { code, matched: true };
      }
    }
    
    return { code: `// TODO: Unmapped step - "${step}"`, matched: false };
  };

  // FUNCTION: Generate complete test code
  const generateCode = () => {
    const variableMap = {};
    (testData.variables || []).forEach(variable => {
      if (variable.name) {
        variableMap[variable.name] = variable.value ?? '';
      }
    });

    const datasets = Array.isArray(testData.datasets) ? testData.datasets : [];
    const hasDatasets = datasets.length > 0;
    const datasetArrayName = 'testDataSets';
    const datasetVarName = 'data';
    const datasetFields = new Set();
    datasets.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key) datasetFields.add(key);
      });
    });

    const escapeSingleQuotes = (value) => String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapeDoubleQuotes = (value) => String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    const resolvePlaceholder = (varName) => {
      const trimmed = varName.trim();
      if (hasDatasets && datasetFields.has(trimmed)) {
        return { type: 'dataset', expression: `${datasetVarName}.${trimmed}` };
      }
      if (Object.prototype.hasOwnProperty.call(variableMap, trimmed)) {
        return { type: 'variable', value: variableMap[trimmed] };
      }
      return null;
    };

    const processPlaceholders = (code) => {
      if (!code) return code;
      let result = code;
      result = result.replace(/'{{\s*(\w+)\s*}}'/g, (match, varName) => {
        const resolved = resolvePlaceholder(varName);
        if (!resolved) return match;
        if (resolved.type === 'dataset') {
          return resolved.expression;
        }
        return `'${escapeSingleQuotes(resolved.value)}'`;
      });
      result = result.replace(/"{{\s*(\w+)\s*}}"/g, (match, varName) => {
        const resolved = resolvePlaceholder(varName);
        if (!resolved) return match;
        if (resolved.type === 'dataset') {
          return resolved.expression;
        }
        return `"${escapeDoubleQuotes(resolved.value)}"`;
      });
      result = result.replace(/{{\s*(\w+)\s*}}/g, (match, varName) => {
        const resolved = resolvePlaceholder(varName);
        if (!resolved) return match;
        if (resolved.type === 'dataset') {
          return resolved.expression;
        }
        return JSON.stringify(resolved.value ?? '');
      });
      return result;
    };

    const unmapped = [];
    const codeLines = steps.map((step) => {
      if (!step.trim()) return '';
      const { code, matched } = generateStepCode(step);
      if (!matched) unmapped.push(step);
      const processed = processPlaceholders(code);
      return processed;
    }).filter(Boolean);

    const stepsCodeBase = codeLines.join('\n');
    const stepsCode = indentCode(stepsCodeBase, 2);
    const datasetStepsCode = indentCode(stepsCodeBase, 6);

    const fw = FRAMEWORKS[framework];

    const datasetDeclaration = hasDatasets
      ? `const ${datasetArrayName} = ${JSON.stringify(datasets, null, 2)};`
      : '';

    const body = fw.generate({
      testName,
      stepsCode: hasDatasets ? datasetStepsCode : stepsCode,
      hasDatasets,
      datasetDeclaration,
      datasetArrayName,
      datasetVarName
    });

    const fullCode = `${fw.imports}\n\n${body}`;

    setGeneratedCode(fullCode.trim());
    setUnmappedSteps(unmapped);
  };

  // FUNCTION: Add a new empty step
  const addStep = () => {
    setSteps([...steps, '']);
  };

  // FUNCTION: Update a step at specific index
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // FUNCTION: Delete a step
  const deleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // FUNCTION: Add custom template
  const addCustomTemplate = () => {
    if (newTemplate.pattern && newTemplate.code) {
      setCustomTemplates([...customTemplates, newTemplate]);
      setNewTemplate({ pattern: '', code: '' });
      setShowTemplateEditor(false);
      trackCustomTemplate();
    }
  };

  // FUNCTION: Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
    trackCodeCopy(framework);
  };

  // FUNCTION: Download code as file
  const downloadCode = () => {
    const extensions = {
      playwright: 'spec.js',
      cypress: 'cy.js',
      testcafe: 'test.js'
    };
    const ext = extensions[framework];
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testName.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
    a.click();
    trackDownload(framework, testName);
  };

  // FUNCTION: Import steps from CSV file
  const importFromCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim() && !line.toLowerCase().startsWith('step'));
        const importedSteps = lines.map(l => l.trim());
        setSteps(importedSteps);
        trackCSVImport(importedSteps.length);
      };
      reader.readAsText(file);
    }
  };

  // FUNCTION: Export steps as CSV
  const exportToCSV = () => {
    const csv = 'Step\n' + steps.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-steps.csv';
    a.click();
    trackCSVExport(steps.length);
  };

  // RENDER: The actual UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Play className="text-indigo-600" />
                Test Generator
              </h1>
              <p className="text-gray-600 mt-1">Convert plain English steps into test code</p>
            </div>
            <a 
              href="https://github.com/77QAlab/step-to-code-generator" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>

          {/* INPUT CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="My Test"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="playwright">Playwright</option>
                <option value="cypress">Cypress</option>
                <option value="testcafe">TestCafe</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700 mb-2">Import CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={importFromCSV}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT PANEL - STEPS INPUT */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Test Steps</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <Download size={16} />
                  Export CSV
                </button>
                <button
                  onClick={() => setShowTestDataManager(!showTestDataManager)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition ${
                    showTestDataManager
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Database size={16} />
                  Test Data
                </button>
                <button
                  onClick={() => setShowSelectorHelper(!showSelectorHelper)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition ${
                    showSelectorHelper
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <Target size={16} />
                  Selector Helper
                </button>
                <button
                  onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                >
                  <Settings size={16} />
                  Custom Steps
                </button>
              </div>
            </div>

            {/* CUSTOM TEMPLATE EDITOR */}
            {showTemplateEditor && (
              <div className="mb-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">Add Custom Step Template</h3>
                <input
                  type="text"
                  value={newTemplate.pattern}
                  onChange={(e) => setNewTemplate({ ...newTemplate, pattern: e.target.value })}
                  placeholder="Pattern: e.g., login as {username}"
                  className="w-full px-3 py-2 border border-indigo-300 rounded mb-2"
                />
                <input
                  type="text"
                  value={newTemplate.code}
                  onChange={(e) => setNewTemplate({ ...newTemplate, code: e.target.value })}
                  placeholder="Code: e.g., await loginAs('{username}');"
                  className="w-full px-3 py-2 border border-indigo-300 rounded mb-2"
                />
                <button
                  onClick={addCustomTemplate}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add Template
                </button>
              </div>
            )}

            {/* TEST DATA MANAGER */}
            {showTestDataManager && (
              <TestDataManager
                testData={testData}
                onUpdate={setTestData}
              />
            )}

            {/* SELECTOR HELPER */}
            {showSelectorHelper && (
              <SelectorHelper
                onSelectSelector={(selector) => {
                  // Insert selector into focused step or last step
                  const targetIndex = (focusedStepIndex !== null && focusedStepIndex < steps.length)
                    ? focusedStepIndex
                    : steps.length - 1;
                  if (targetIndex >= 0) {
                    const currentStep = steps[targetIndex] || '';
                    const updatedStep = currentStep + (currentStep ? ' ' : '') + selector;
                    updateStep(targetIndex, updatedStep);
                  }
                }}
              />
            )}

            {/* STEP INPUT FIELDS */}
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded font-semibold">
                    {index + 1}
                  </span>
                  <StepAutocomplete
                    value={step}
                    onChange={(value) => updateStep(index, value)}
                    onSelect={(value) => updateStep(index, value)}
                    onFocus={() => setFocusedStepIndex(index)}
                    placeholder="Enter step in plain English..."
                    className="flex-1"
                  />
                  <button
                    onClick={() => deleteStep(index)}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* ADD STEP BUTTON */}
            <button
              onClick={addStep}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus size={20} />
              Add Step
            </button>

            {/* UNMAPPED STEPS WARNING */}
            {unmappedSteps.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Unmapped Steps:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {unmappedSteps.map((step, i) => (
                    <li key={i}>• {step}</li>
                  ))}
                </ul>
                <p className="text-xs text-yellow-600 mt-2">
                  Add custom templates for these steps or adjust the wording to match existing patterns.
                </p>
              </div>
            )}

            {/* AVAILABLE PATTERNS REFERENCE */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Available Step Patterns:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {Object.values(DEFAULT_TEMPLATES[framework]).map((t, i) => (
                  <li key={i} className="font-mono">• {t.pattern}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT PANEL - GENERATED CODE */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Generated Code</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={downloadCode}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            {/* CODE PREVIEW */}
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono h-[600px] overflow-y-auto">
              {generatedCode}
            </pre>
          </div>
        </div>

        {/* QUICK START GUIDE */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText />
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">1. Write Steps</h3>
              <p className="text-gray-600">Write your test steps in plain English. Use the available patterns or add custom ones.</p>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">2. Generate Code</h3>
              <p className="text-gray-600">Code is automatically generated. Copy it or download the file to use in your project.</p>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">3. Run Tests</h3>
              <p className="text-gray-600">Add the generated code to your test suite and run it with your chosen framework.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
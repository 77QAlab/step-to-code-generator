import React, { useMemo, useRef, useState } from 'react';
import { Plus, Trash2, Upload, Database, Info, Download, FileSpreadsheet, ClipboardList } from 'lucide-react';

const SAMPLE_DATASETS = {
  login: [
    {
      username: 'user1@test.com',
      password: 'Pass123!',
      expectedResult: 'Success'
    },
    {
      username: 'locked@test.com',
      password: 'LockedPass!',
      expectedResult: 'Account Locked'
    },
    {
      username: 'user2@test.com',
      password: 'WrongPass',
      expectedResult: 'Invalid Credentials'
    }
  ]
};

const createVariable = () => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `var-${Date.now()}-${Math.random()}`,
  name: '',
  value: ''
});

const sanitizeVariableName = (name) => name.replace(/[^a-zA-Z0-9_]/g, '');

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => sanitizeVariableName(h.trim())).filter(Boolean);
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',');
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] !== undefined ? values[index].trim() : '';
    });
    return entry;
  }).filter(row => Object.values(row).some(value => value !== ''));

  return { headers, rows };
};

const downloadSampleCSV = (headers, rows) => {
  const csvHeader = headers.join(',');
  const csvRows = rows.map(row => headers.map(h => row[h] ?? '').join(',')).join('\n');
  const csvContent = `${csvHeader}\n${csvRows}`;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'test-data-sample.csv';
  a.click();
};

export default function TestDataManager({ testData, onUpdate }) {
  const fileInputRef = useRef(null);
  const [validationMessage, setValidationMessage] = useState('');

  const variables = testData.variables ?? [];
  const datasets = testData.datasets ?? [];

  const variableNames = useMemo(() => variables.map(v => v.name).filter(Boolean), [variables]);

  const duplicateVariables = useMemo(() => {
    const seen = new Set();
    const duplicates = new Set();
    variableNames.forEach((name) => {
      const lower = name.toLowerCase();
      if (seen.has(lower)) duplicates.add(name);
      seen.add(lower);
    });
    return duplicates;
  }, [variableNames]);

  const datasetHeaders = useMemo(() => {
    const headers = new Set();
    datasets.forEach(row => {
      Object.keys(row).forEach(key => headers.add(key));
    });
    return Array.from(headers);
  }, [datasets]);

  const updateVariables = (newVariables) => {
    onUpdate({
      ...testData,
      variables: newVariables
    });
  };

  const handleAddVariable = () => {
    updateVariables([
      ...variables,
      createVariable()
    ]);
  };

  const handleUpdateVariable = (id, field, value) => {
    updateVariables(
      variables.map(variable =>
        variable.id === id
          ? { ...variable, [field]: field === 'name' ? sanitizeVariableName(value) : value }
          : variable
      )
    );
  };

  const handleRemoveVariable = (id) => {
    updateVariables(variables.filter(variable => variable.id !== id));
  };

  const handleCSVImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const text = String(loadEvent.target?.result ?? '');
        const { headers, rows } = parseCSV(text);

        if (headers.length === 0 || rows.length === 0) {
          setValidationMessage('CSV did not contain any headers or data rows.');
          return;
        }

        onUpdate({
          ...testData,
          datasets: rows
        });
        setValidationMessage('Successfully imported CSV test data.');
      } catch (error) {
        console.error(error);
        setValidationMessage('Failed to import CSV file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleLoadSampleDataset = () => {
    onUpdate({
      ...testData,
      datasets: SAMPLE_DATASETS.login
    });
    setValidationMessage('Loaded sample login datasets.');
  };

  const handleClearDatasets = () => {
    onUpdate({
      ...testData,
      datasets: []
    });
    setValidationMessage('Cleared all datasets.');
  };

  const handleDownloadSample = () => {
    const headers = ['username', 'password', 'expectedResult'];
    downloadSampleCSV(headers, SAMPLE_DATASETS.login);
  };

  return (
    <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-green-900 flex items-center gap-2">
          <Database className="text-green-600" size={20} />
          Test Data Management
        </h3>
        <div className="text-xs text-green-700 flex items-center gap-2">
          <Info size={14} />
          Manage reusable test variables and datasets for data-driven testing
        </div>
      </div>

      {/* Variables Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-green-800 flex items-center gap-2">
            <ClipboardList size={16} />
            Test Data Variables
          </h4>
          <button
            onClick={handleAddVariable}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <Plus size={14} />
            Add Variable
          </button>
        </div>

        {variables.length === 0 ? (
          <div className="text-sm text-green-700 bg-white border border-green-200 rounded p-3 mb-3">
            No variables yet. Click "Add Variable" to define reusable values like usernames, API keys, or URLs.
          </div>
        ) : (
          <div className="space-y-2 mb-3">
            {variables.map((variable) => (
              <div key={variable.id} className="flex gap-2 items-center bg-white border border-green-200 rounded p-2">
                <input
                  value={variable.name}
                  onChange={(e) => handleUpdateVariable(variable.id, 'name', e.target.value)}
                  placeholder="Variable Name"
                  className="flex-1 px-3 py-2 border border-green-200 rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <input
                  value={variable.value}
                  onChange={(e) => handleUpdateVariable(variable.id, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border border-green-200 rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <button
                  onClick={() => handleRemoveVariable(variable.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="Remove variable"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-700 bg-white border border-green-200 rounded p-3">
          <p className="mb-1"><strong>Usage:</strong> Refer to variables in steps using <code className="bg-gray-100 px-1 rounded">{'{{variableName}}'}</code></p>
          <p className="text-xs text-gray-600">Example: <code className="bg-gray-100 px-1 rounded">type {'{{username}}'} into #email</code></p>
          {duplicateVariables.size > 0 && (
            <p className="text-xs text-red-600 mt-2">Duplicate variable names detected: {[...duplicateVariables].join(', ')}. Variable names must be unique.</p>
          )}
        </div>
      </div>

      {/* Dataset Section */}
      <div className="border-t border-green-200 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-green-800 flex items-center gap-2">
            <FileSpreadsheet size={16} />
            Data Sets (Multiple Test Runs)
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-green-300 text-green-700 rounded hover:bg-green-50"
            >
              <Upload size={14} />
              Import CSV
            </button>
            <button
              onClick={handleLoadSampleDataset}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Load Sample
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-green-300 text-green-700 rounded hover:bg-green-50"
            >
              <Download size={14} />
              Sample CSV
            </button>
            {datasets.length > 0 && (
              <button
                onClick={handleClearDatasets}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleCSVImport}
        />

        {validationMessage && (
          <div className="text-xs text-green-700 bg-green-100 border border-green-200 rounded p-2 mb-2">
            {validationMessage}
          </div>
        )}

        {datasets.length === 0 ? (
          <div className="text-sm text-green-700 bg-white border border-green-200 rounded p-3">
            <p className="mb-1">No datasets yet. Import a CSV file or load the sample login scenarios.</p>
            <p className="text-xs text-gray-600">Each row in the CSV becomes a separate test run. Headers become variable names that you can reference with <code className="bg-gray-100 px-1 rounded">{'{{column}}'}</code>.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-green-200 rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  {datasetHeaders.map(header => (
                    <th key={header} className="px-3 py-2 text-left font-semibold capitalize">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasets.map((row, index) => (
                  <tr key={index} className="border-t border-green-100">
                    {datasetHeaders.map(header => (
                      <td key={header} className="px-3 py-2">
                        {row[header] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 text-sm text-gray-700 bg-white border border-green-200 rounded p-3">
          <p className="font-semibold text-green-800 mb-1">How it works:</p>
          <ol className="list-decimal list-inside text-xs space-y-1">
            <li>Each dataset row runs the test once with those values.</li>
            <li>Use placeholders like <code className="bg-gray-100 px-1 rounded">{'{{username}}'}</code> in your steps.</li>
            <li>Playwright tests are generated with data-driven loops (similar to <code>test.each</code>).</li>
            <li>Cypress and TestCafe create one test case per dataset row.</li>
          </ol>
          <p className="text-xs text-gray-600 mt-2">Example usage for login form:</p>
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
            <li><code>type {'{{username}}'} into #email</code></li>
            <li><code>type {'{{password}}'} into #password</code></li>
            <li><code>see text {'{{expectedResult}}'}</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}


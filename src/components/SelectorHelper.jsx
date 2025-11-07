import React, { useState, useRef } from 'react';
import { Target, Copy, CheckCircle, XCircle, Lightbulb, TestTube, Info } from 'lucide-react';

/**
 * Selector Helper Component
 * Helps users capture, validate, and test CSS/XPath selectors
 */
export default function SelectorHelper({ onSelectSelector, currentSelector = '' }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSelectors, setCapturedSelectors] = useState([]);
  const [selectorInput, setSelectorInput] = useState(currentSelector || '');
  const [selectorType, setSelectorType] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const inputRef = useRef(null);

  // Detect selector type
  const detectSelectorType = (selector) => {
    if (!selector || !selector.trim()) {
      return null;
    }

    const trimmed = selector.trim();

    // ID selector
    if (/^#[a-zA-Z][\w-]*$/.test(trimmed)) {
      return {
        type: 'ID',
        quality: 'excellent',
        description: 'By ID - Most reliable and fastest',
        icon: '🎯'
      };
    }

    // Data attribute (test ID)
    if (/^\[data-testid=["'].*["']\]$/.test(trimmed) || /^\[data-testid=.*\]$/.test(trimmed)) {
      return {
        type: 'Data Attribute',
        quality: 'excellent',
        description: 'By data-testid - Best practice for testing',
        icon: '✅'
      };
    }

    // Class selector
    if (/^\.[a-zA-Z][\w-]*$/.test(trimmed)) {
      return {
        type: 'Class',
        quality: 'good',
        description: 'By CSS class - Good but may match multiple elements',
        icon: '📦'
      };
    }

    // XPath
    if (/^\/\//.test(trimmed) || /^\/.*\//.test(trimmed)) {
      return {
        type: 'XPath',
        quality: 'fair',
        description: 'XPath - Powerful but can be brittle',
        icon: '🔍'
      };
    }

    // Attribute selector
    if (/^\[.*\]$/.test(trimmed)) {
      return {
        type: 'Attribute',
        quality: 'good',
        description: 'By attribute - Flexible selector',
        icon: '🏷️'
      };
    }

    // Tag selector
    if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(trimmed)) {
      return {
        type: 'Tag',
        quality: 'fair',
        description: 'By HTML tag - May match multiple elements',
        icon: '📄'
      };
    }

    // Complex selector (multiple parts)
    if (/[ >+~,]/.test(trimmed) || trimmed.includes(' ')) {
      return {
        type: 'Complex',
        quality: 'fair',
        description: 'Complex selector - Multiple parts combined',
        icon: '🔗'
      };
    }

    // Invalid
    return {
      type: 'Invalid',
      quality: 'poor',
      description: 'Invalid selector format',
      icon: '❌'
    };
  };

  // Validate selector syntax
  const validateSelector = (selector) => {
    if (!selector || !selector.trim()) {
      return {
        valid: false,
        message: 'Selector cannot be empty'
      };
    }

    const trimmed = selector.trim();

    // Basic CSS selector validation
    try {
      // Try to use querySelector to validate
      const testDiv = document.createElement('div');
      testDiv.innerHTML = '<div></div>';
      const testElement = testDiv.querySelector(trimmed);
      
      // If querySelector doesn't throw, it's syntactically valid
      return {
        valid: true,
        message: 'Selector is valid',
        elementFound: testElement !== null
      };
    } catch (error) {
      return {
        valid: false,
        message: `Invalid selector: ${error.message}`
      };
    }
  };

  // Handle selector input change
  const handleSelectorChange = (value) => {
    setSelectorInput(value);
    setTestResult(null);
    
    if (value.trim()) {
      const type = detectSelectorType(value);
      setSelectorType(type);
      
      const validation = validateSelector(value);
      setValidationResult(validation);
    } else {
      setSelectorType(null);
      setValidationResult(null);
    }
  };

  // Start capture mode
  const startCapture = () => {
    setIsCapturing(true);
    
    const instructions = `
Selector Capture Mode Instructions:

1. Open your test website in another browser tab
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Select an element in the Elements/Inspector tab
4. Right-click the element in DevTools
5. Select "Copy" → "Copy selector" (or "Copy XPath")
6. Come back here and paste the selector

Alternative: Manually type selectors like:
• #email (by ID)
• .submit-button (by class)
• [data-testid="login"] (by test ID)
• button:has-text("Login") (by text)
    `;

    alert(instructions);
  };

  // Test selector syntax (works on any page context)
  const testSelectorSyntax = () => {
    if (!selectorInput.trim()) {
      alert('Please enter a selector to test');
      return;
    }

    // Test syntax validation
    const validation = validateSelector(selectorInput.trim());
    
    if (!validation.valid) {
      setTestResult({
        success: false,
        message: validation.message,
        isSyntaxTest: true
      });
      return;
    }

    // Note: Can only test on current page due to browser security
    // Provide instructions for testing on user's actual page
    setTestResult({
      success: true,
      message: 'Syntax is valid!',
      isSyntaxTest: true,
      instructions: true
    });
  };

  // Generate browser console test code
  const getConsoleTestCode = () => {
    const selector = selectorInput.trim();
    return `// Test selector in your browser console on your target website
// 1. Open your website in another tab
// 2. Press F12 to open DevTools
// 3. Go to Console tab
// 4. Paste and run this code:

const elements = document.querySelectorAll('${selector}');
console.log('Found', elements.length, 'element(s)');

if (elements.length === 0) {
  console.error('❌ No elements found - selector may be incorrect');
} else if (elements.length === 1) {
  console.log('✅ Perfect! Found exactly 1 element');
  elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  elements[0].style.outline = '3px solid green';
  elements[0].style.outlineOffset = '2px';
  setTimeout(() => {
    elements[0].style.outline = '';
  }, 3000);
} else {
  console.warn('⚠️ Found', elements.length, 'elements - selector matches multiple elements');
  console.log('Consider making selector more specific');
}`;
  };

  // Copy console test code to clipboard
  const copyConsoleTestCode = () => {
    const code = getConsoleTestCode();
    navigator.clipboard.writeText(code);
    alert('Console test code copied! Paste it in your browser console on your target website.');
  };

  // Handle paste
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.trim()) {
      handleSelectorChange(pastedText);
      if (onSelectSelector) {
        onSelectSelector(pastedText);
      }
    }
  };

  // Use selector in current step
  const useSelector = () => {
    if (selectorInput.trim()) {
      if (onSelectSelector) {
        onSelectSelector(selectorInput.trim());
      }
      setCapturedSelectors(prev => [...prev, selectorInput.trim()]);
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <Target className="text-blue-600" size={20} />
          Selector Helper
        </h3>
        {isCapturing && (
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded animate-pulse">
            Capturing...
          </span>
        )}
      </div>

      {/* Capture Button */}
      <div className="mb-3">
        <button
          onClick={startCapture}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Target size={16} />
          Start Selector Capture
        </button>
      </div>

      {/* Selector Input */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste or Type Selector:
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={selectorInput}
            onChange={(e) => handleSelectorChange(e.target.value)}
            onPaste={handlePaste}
            placeholder="Paste selector: #email, .button, [data-testid='login']"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
          />
          {selectorInput && (
            <button
              onClick={useSelector}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              Use
            </button>
          )}
        </div>
      </div>

      {/* Selector Type & Validation */}
      {selectorType && (
        <div className="mb-3 p-3 bg-white rounded border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{selectorType.icon}</span>
            <div>
              <div className="font-semibold text-gray-800">{selectorType.type}</div>
              <div className="text-xs text-gray-600">{selectorType.description}</div>
            </div>
          </div>
          {validationResult && (
            <div className="flex items-center gap-2 mt-2">
              {validationResult.valid ? (
                <>
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm text-green-700">{validationResult.message}</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-600" size={16} />
                  <span className="text-sm text-red-700">{validationResult.message}</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Test Selector Buttons */}
      {selectorInput.trim() && (
        <div className="mb-3 space-y-2">
          <button
            onClick={testSelectorSyntax}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            <TestTube size={16} />
            Validate Selector Syntax
          </button>
          <button
            onClick={copyConsoleTestCode}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
          >
            <Copy size={16} />
            Copy Console Test Code
          </button>
          <p className="text-xs text-gray-600 text-center">
            💡 Tip: Use console test code on your actual website to verify the selector works
          </p>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div className={`mb-3 p-3 rounded border ${
          testResult.success && !testResult.warning
            ? 'bg-green-50 border-green-200'
            : testResult.warning
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {testResult.success && !testResult.warning ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : testResult.warning ? (
              <Info className="text-yellow-600" size={20} />
            ) : (
              <XCircle className="text-red-600" size={20} />
            )}
            <div className="flex-1">
              <div className="font-semibold">{testResult.message}</div>
              {testResult.count !== undefined && (
                <div className="text-xs text-gray-600 mt-1">
                  Elements found: {testResult.count}
                </div>
              )}
              {testResult.isSyntaxTest && testResult.success && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  <strong>Note:</strong> This validates syntax only. To test on your actual website:
                  <br />1. Open your website in another tab
                  <br />2. Press F12 → Console tab
                  <br />3. Use the "Copy Console Test Code" button above
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Best Practices Tips */}
      <div className="border-t border-blue-200 pt-3 mt-3">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Lightbulb size={16} />
          Selector Best Practices
        </h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><code className="bg-gray-100 px-1 rounded">#id</code> - By ID (most reliable)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><code className="bg-gray-100 px-1 rounded">[data-testid="value"]</code> - By test ID (best for tests)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">⚠</span>
            <span><code className="bg-gray-100 px-1 rounded">.class</code> - By class (may match multiple)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">⚠</span>
            <span><code className="bg-gray-100 px-1 rounded">tag</code> - By tag (less specific)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">✗</span>
            <span>Avoid: Complex nested selectors, XPath if possible</span>
          </li>
        </ul>
      </div>

      {/* Common Patterns */}
      <div className="border-t border-blue-200 pt-3 mt-3">
        <h4 className="font-semibold text-blue-900 mb-2">Common Selector Patterns:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleSelectorChange('#email')}
            className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
          >
            <code>#email</code>
          </button>
          <button
            onClick={() => handleSelectorChange('.submit-button')}
            className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
          >
            <code>.submit-button</code>
          </button>
          <button
            onClick={() => handleSelectorChange('[data-testid="login"]')}
            className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
          >
            <code>[data-testid]</code>
          </button>
          <button
            onClick={() => handleSelectorChange('button:has-text("Login")')}
            className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
          >
            <code>button:has-text</code>
          </button>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ChevronDown } from 'lucide-react';
import { searchSuggestions, getCategories, getAllSuggestions } from '../utils/stepSuggestions';

/**
 * Autocomplete component for step suggestions
 */
export default function StepAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  onFocus,
  placeholder = "Enter step in plain English...",
  className = "" 
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCategoryTabs, setShowCategoryTabs] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const wrapperRef = useRef(null);

  const categories = getCategories();

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Search suggestions when query changes
  useEffect(() => {
    if (query.trim()) {
      const results = searchSuggestions(query, activeCategory, 15);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      // Show all suggestions when empty, grouped by category
      if (showCategoryTabs && !activeCategory) {
        setShowSuggestions(true);
        setSuggestions(getAllSuggestions());
      } else if (activeCategory) {
        const results = searchSuggestions('', activeCategory, 15);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  }, [query, activeCategory, showCategoryTabs]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setShowSuggestions(true);
  };

  // Handle suggestion select
  const handleSelect = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSelect(suggestion.text);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && !query.trim()) {
        // Show suggestions on down arrow when empty
        setShowCategoryTabs(true);
        setSuggestions(getAllSuggestions());
        setShowSuggestions(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setShowCategoryTabs(false);
        setActiveCategory(null);
        break;
      
      default:
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowCategoryTabs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Insert example placeholder
  const insertExample = (text, e) => {
    if (e) e.stopPropagation();
    // Replace {placeholder} with example values
    let example = text
      .replace('{url}', 'https://example.com')
      .replace('{selector}', '#button')
      .replace('{text}', 'Hello World')
      .replace('{option}', 'Option 1')
      .replace('{key}', 'Enter')
      .replace('{value}', 'test value')
      .replace('{count}', '5')
      .replace('{title}', 'Page Title')
      .replace('{seconds}', '2')
      .replace('{path}', '/path/to/file.txt');
    
    setQuery(example);
    onChange(example);
    onSelect(example);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input with icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Sparkles className="h-4 w-4 text-indigo-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (onFocus) onFocus();
            if (query.trim() || showCategoryTabs) {
              setShowSuggestions(true);
            }
          }}
          className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
          placeholder={placeholder}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-hidden flex flex-col" style={{ marginTop: '4px' }}>
          {/* Category Tabs */}
          {showCategoryTabs && (
            <div className="border-b border-gray-200 bg-gray-50 px-2 py-1 flex gap-1 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setQuery('');
                }}
                className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
                  activeCategory === null
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({getAllSuggestions().length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setQuery('');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
                    activeCategory === cat.key
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Suggestions List */}
          <div
            ref={suggestionsRef}
            className="overflow-y-auto max-h-64"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.category}-${index}`}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between group ${
                  selectedIndex === index
                    ? 'bg-indigo-50 text-indigo-900'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{suggestion.text}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {suggestion.displayCategory}
                  </div>
                </div>
                <button
                  onClick={(e) => insertExample(suggestion.text, e)}
                  className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded opacity-0 group-hover:opacity-100 hover:bg-indigo-200 transition-opacity"
                  title="Insert example"
                >
                  Example
                </button>
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
            <span className="font-medium">Tip:</span> Use ↑↓ to navigate, Enter to select, Esc to close
          </div>
        </div>
      )}

      {/* Show suggestions button when empty */}
      {!query.trim() && !showSuggestions && (
        <button
          onClick={() => {
            setShowCategoryTabs(true);
            setSuggestions(getAllSuggestions());
            setShowSuggestions(true);
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
          title="Show suggestions"
        >
          <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
}


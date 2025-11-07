/**
 * Step Suggestions Data
 * Organized by category for easy browsing and autocomplete
 */
export const STEP_SUGGESTIONS = {
  navigation: [
    "navigate to {url}",
    "go to {url}",
    "visit page {url}",
    "refresh page",
    "go back",
    "go forward"
  ],
  interaction: [
    "click {selector}",
    "click on button {text}",
    "double click {selector}",
    "right click {selector}",
    "type {text} into {selector}",
    "clear {selector}",
    "select {option} from {selector}",
    "check {selector}",
    "uncheck {selector}",
    "hover over {selector}",
    "press {key}",
    "press {key} on {selector}",
    "scroll to {selector}",
    "upload file {path} to {selector}"
  ],
  verification: [
    "see text {text}",
    "see element {selector}",
    "not see element {selector}",
    "verify {selector} contains {text}",
    "verify {selector} is visible",
    "verify {selector} is hidden",
    "verify {selector} has value {value}",
    "verify {selector} has {count} items",
    "verify page title is {title}"
  ],
  waiting: [
    "wait for {selector}",
    "wait {seconds} seconds",
    "wait for page to load",
    "wait for text {text}",
    "wait until {selector} is visible"
  ]
};

/**
 * Get all suggestions as a flat array with category info
 */
export const getAllSuggestions = () => {
  const all = [];
  Object.entries(STEP_SUGGESTIONS).forEach(([category, suggestions]) => {
    suggestions.forEach(suggestion => {
      all.push({
        text: suggestion,
        category: category,
        displayCategory: category.charAt(0).toUpperCase() + category.slice(1)
      });
    });
  });
  return all;
};

/**
 * Simple fuzzy search - matches if query appears in suggestion
 * @param {string} query - Search query
 * @param {string} text - Text to search in
 * @returns {boolean}
 */
export const fuzzyMatch = (query, text) => {
  if (!query) return true;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest priority
  if (textLower.includes(queryLower)) {
    return true;
  }
  
  // Match words separately
  const queryWords = queryLower.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return true;

  const firstWord = queryWords[0];
  if (textLower.includes(firstWord)) {
    return true;
  }

  return queryWords.some(word => textLower.includes(word));
};

/**
 * Score a match for sorting (better matches first)
 * @param {string} query - Search query
 * @param {string} text - Text matched
 * @returns {number} - Higher is better
 */
export const getMatchScore = (query, text) => {
  if (!query) return 0;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower === queryLower) return 100;
  
  // Starts with query
  if (textLower.startsWith(queryLower)) return 80;
  
  // Contains query
  if (textLower.includes(queryLower)) return 60;
  
  // Word match
  const queryWords = queryLower.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return 0;

  const matchingWords = queryWords.filter(word => textLower.includes(word));
  if (matchingWords.length === 0) return 0;

  const firstWord = queryWords[0];
  const bonus = textLower.startsWith(firstWord) ? 10 : 0;

  return (matchingWords.length / queryWords.length) * 40 + bonus;
};

/**
 * Search suggestions based on query
 * @param {string} query - Search query
 * @param {string} categoryFilter - Optional category filter
 * @param {number} limit - Maximum results
 * @returns {Array} - Sorted suggestions
 */
export const searchSuggestions = (query = '', categoryFilter = null, limit = 10) => {
  const all = getAllSuggestions();
  
  // Filter by category if specified
  let filtered = categoryFilter 
    ? all.filter(s => s.category === categoryFilter)
    : all;
  
  // Filter by query
  if (query.trim()) {
    filtered = filtered
      .filter(s => fuzzyMatch(query, s.text))
      .map(s => ({
        ...s,
        score: getMatchScore(query, s.text)
      }))
      .sort((a, b) => b.score - a.score);
  } else {
    filtered = filtered.map(s => ({ ...s, score: 0 }));
  }
  
  return filtered.slice(0, limit);
};

/**
 * Get suggestions by category
 * @param {string} category - Category name
 * @returns {Array}
 */
export const getSuggestionsByCategory = (category) => {
  return STEP_SUGGESTIONS[category] || [];
};

/**
 * Get category labels
 */
export const getCategories = () => {
  return Object.keys(STEP_SUGGESTIONS).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    count: STEP_SUGGESTIONS[key].length
  }));
};


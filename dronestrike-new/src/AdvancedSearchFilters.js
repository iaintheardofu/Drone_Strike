import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Save, 
  X, 
  Plus, 
  ChevronDown, 
  Sliders, 
  RefreshCw,
  BookOpen,
  Clock
} from 'lucide-react';

const AdvancedSearchFilters = () => {
  // State for basic search params
  const [zipCodes, setZipCodes] = useState('');
  const [radius, setRadius] = useState(5);
  const [propertyType, setPropertyType] = useState('All Properties');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [taxesRange, setTaxesRange] = useState({ min: '', max: '' });
  const [foreclosureStatus, setForeclosureStatus] = useState('Any');
  const [ownershipYears, setOwnershipYears] = useState({ min: '', max: '' });
  
  // Filter builder state
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [filterConditions, setFilterConditions] = useState([
    { id: 1, field: 'Property Type', operator: 'is', value: 'Residential', logic: 'AND' }
  ]);
  
  // Saved filters state
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'High Value Fort Worth', criteria: 'ZIP: 76102, 76104 | Value: $200k+ | Type: Residential' },
    { id: 2, name: 'Tax Delinquent Properties', criteria: 'Taxes Due: $5k+ | Foreclosure: Yes' },
    { id: 3, name: 'Commercial Downtown', criteria: 'ZIP: 76102 | Type: Commercial | Radius: 2mi' }
  ]);
  
  // Recent searches state
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, criteria: 'ZIP: 76106, Residential, 5 miles', timestamp: '2 hours ago' },
    { id: 2, criteria: 'ZIP: 76102, Commercial, 2 miles', timestamp: '5 hours ago' }
  ]);
  
  // Show saved filters/recent searches
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  
  // Handle adding a new filter condition
  const addFilterCondition = () => {
    const newCondition = {
      id: filterConditions.length + 1,
      field: 'Property Type',
      operator: 'is',
      value: '',
      logic: 'AND'
    };
    setFilterConditions([...filterConditions, newCondition]);
  };
  
  // Handle removing a filter condition
  const removeFilterCondition = (id) => {
    setFilterConditions(filterConditions.filter(condition => condition.id !== id));
  };
  
  // Handle updating a filter condition
  const updateFilterCondition = (id, field, value) => {
    setFilterConditions(
      filterConditions.map(condition => 
        condition.id === id 
          ? { ...condition, [field]: value } 
          : condition
      )
    );
  };
  
  // Handle search submission
  const handleSearch = () => {
    // In a real app, this would trigger API calls
    console.log('Searching with criteria:', {
      zipCodes,
      radius,
      propertyType,
      priceRange,
      taxesRange,
      foreclosureStatus,
      ownershipYears,
      filterConditions
    });
    
    // Add to recent searches
    const newSearch = {
      id: recentSearches.length + 1,
      criteria: `ZIP: ${zipCodes || 'Any'}, ${propertyType}, ${radius} miles`,
      timestamp: 'Just now'
    };
    setRecentSearches([newSearch, ...recentSearches]);
  };
  
  // Handle saving current search
  const saveCurrentSearch = () => {
    const filterName = prompt('Enter a name for this search filter:');
    if (filterName) {
      const newFilter = {
        id: savedFilters.length + 1,
        name: filterName,
        criteria: `ZIP: ${zipCodes || 'Any'} | Type: ${propertyType} | Radius: ${radius}mi`
      };
      setSavedFilters([...savedFilters, newFilter]);
    }
  };
  
  // Apply a saved filter
  const applySavedFilter = (filter) => {
    // In a real app, this would parse the criteria and set all the state values
    console.log('Applying saved filter:', filter);
    setShowSavedFilters(false);
    
    // For demo purposes, we'll just set some basic values
    if (filter.id === 1) {
      setZipCodes('76102, 76104');
      setPropertyType('Residential');
      setPriceRange({ min: '200000', max: '' });
    } else if (filter.id === 2) {
      setTaxesRange({ min: '5000', max: '' });
      setForeclosureStatus('Yes');
    } else if (filter.id === 3) {
      setZipCodes('76102');
      setPropertyType('Commercial');
      setRadius(2);
    }
  };
  
  // Apply a recent search
  const applyRecentSearch = (search) => {
    console.log('Applying recent search:', search);
    setShowRecentSearches(false);
    
    // For demo purposes, we'll set some basic values based on the criteria
    if (search.criteria.includes('76106')) {
      setZipCodes('76106');
      setPropertyType('Residential');
      setRadius(5);
    } else if (search.criteria.includes('76102')) {
      setZipCodes('76102');
      setPropertyType('Commercial');
      setRadius(2);
    }
  };
  
  return (
    <div className="advanced-search-container">
      <div className="search-panel-header">
        <h3 className="search-title">Property Search</h3>
        <div className="search-actions">
          {/* Saved Filters Dropdown */}
          <div className="dropdown">
            <button 
              className="btn-secondary dropdown-toggle"
              onClick={() => setShowSavedFilters(!showSavedFilters)}
            >
              <BookOpen size={16} className="icon" />
              Saved Filters
              <ChevronDown size={16} />
            </button>
            {showSavedFilters && (
              <div className="dropdown-menu wider">
                {savedFilters.map(filter => (
                  <div 
                    key={filter.id} 
                    className="dropdown-item"
                    onClick={() => applySavedFilter(filter)}
                  >
                    <div className="saved-filter-item">
                      <span className="saved-filter-name">{filter.name}</span>
                      <span className="saved-filter-criteria">{filter.criteria}</span>
                    </div>
                  </div>
                ))}
                {savedFilters.length === 0 && (
                  <div className="dropdown-item disabled">No saved filters</div>
                )}
              </div>
            )}
          </div>
          
          {/* Recent Searches Dropdown */}
          <div className="dropdown">
            <button 
              className="btn-secondary dropdown-toggle"
              onClick={() => setShowRecentSearches(!showRecentSearches)}
            >
              <Clock size={16} className="icon" />
              Recent Searches
              <ChevronDown size={16} />
            </button>
            {showRecentSearches && (
              <div className="dropdown-menu wider">
                {recentSearches.map(search => (
                  <div 
                    key={search.id} 
                    className="dropdown-item"
                    onClick={() => applyRecentSearch(search)}
                  >
                    <div className="recent-search-item">
                      <span className="recent-search-criteria">{search.criteria}</span>
                      <span className="recent-search-time">{search.timestamp}</span>
                    </div>
                  </div>
                ))}
                {recentSearches.length === 0 && (
                  <div className="dropdown-item disabled">No recent searches</div>
                )}
              </div>
            )}
          </div>
          
          {/* Advanced Filters Toggle */}
          <button 
            className={`btn-secondary ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Sliders size={16} className="icon" />
            Advanced Filters
          </button>
          
          {/* Filter Builder Toggle */}
          <button 
            className={`btn-secondary ${showFilterBuilder ? 'active' : ''}`}
            onClick={() => setShowFilterBuilder(!showFilterBuilder)}
          >
            <Filter size={16} className="icon" />
            Filter Builder
          </button>
        </div>
      </div>
      
      {/* Basic Search Fields */}
      <div className="search-grid">
        <div className="search-section">
          <label className="form-label">ZIP Code Search (comma separated)</label>
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="E.g. 76102, 76104"
              value={zipCodes}
              onChange={(e) => setZipCodes(e.target.value)}
            />
            <Search className="search-icon" size={20} />
          </div>
        </div>
        
        <div className="search-section">
          <label className="form-label">Search Radius</label>
          <div className="radius-control">
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="range-input"
            />
            <div className="range-value-display">
              <span className="range-min">1</span>
              <span className="range-current">{radius} miles</span>
              <span className="range-max">50</span>
            </div>
          </div>
        </div>
        
        <div className="search-section">
          <label className="form-label">Property Type</label>
          <select 
            className="select-input"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option>All Properties</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Land</option>
            <option>Multi-Family</option>
            <option>Industrial</option>
          </select>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="advanced-filters-section">
          <h4 className="section-subtitle">Advanced Filters</h4>
          
          <div className="search-grid">
            <div className="search-section">
              <label className="form-label">Property Value Range</label>
              <div className="range-container">
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input 
                    type="text" 
                    className="search-input with-prefix" 
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  />
                </div>
                <span className="range-separator">to</span>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input 
                    type="text" 
                    className="search-input with-prefix" 
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="search-section">
              <label className="form-label">Taxes Due Range</label>
              <div className="range-container">
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input 
                    type="text" 
                    className="search-input with-prefix" 
                    placeholder="Min"
                    value={taxesRange.min}
                    onChange={(e) => setTaxesRange({...taxesRange, min: e.target.value})}
                  />
                </div>
                <span className="range-separator">to</span>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input 
                    type="text" 
                    className="search-input with-prefix" 
                    placeholder="Max"
                    value={taxesRange.max}
                    onChange={(e) => setTaxesRange({...taxesRange, max: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="search-section">
              <label className="form-label">Foreclosure Status</label>
              <select 
                className="select-input"
                value={foreclosureStatus}
                onChange={(e) => setForeclosureStatus(e.target.value)}
              >
                <option>Any</option>
                <option>Yes</option>
                <option>No</option>
                <option>Pending</option>
              </select>
            </div>
            
            <div className="search-section">
              <label className="form-label">Years of Ownership</label>
              <div className="range-container">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Min Years"
                  value={ownershipYears.min}
                  onChange={(e) => setOwnershipYears({...ownershipYears, min: e.target.value})}
                />
                <span className="range-separator">to</span>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Max Years"
                  value={ownershipYears.max}
                  onChange={(e) => setOwnershipYears({...ownershipYears, max: e.target.value})}
                />
              </div>
            </div>
            
            <div className="search-section">
              <label className="form-label">Owner Occupied</label>
              <select className="select-input">
                <option>Any</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            
            <div className="search-section">
              <label className="form-label">Last Contact</label>
              <select className="select-input">
                <option>Any time</option>
                <option>Never contacted</option>
                <option>Over 30 days ago</option>
                <option>Over 90 days ago</option>
                <option>This year</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter Builder */}
      {showFilterBuilder && (
        <div className="filter-builder-section">
          <h4 className="section-subtitle">Custom Filter Builder</h4>
          
          <div className="filter-conditions">
            {filterConditions.map((condition, index) => (
              <div className="filter-condition" key={condition.id}>
                {index > 0 && (
                  <select 
                    className="logic-selector"
                    value={condition.logic}
                    onChange={(e) => updateFilterCondition(condition.id, 'logic', e.target.value)}
                  >
                    <option>AND</option>
                    <option>OR</option>
                  </select>
                )}
                
                <div className="condition-builder">
                  <select 
                    className="field-selector"
                    value={condition.field}
                    onChange={(e) => updateFilterCondition(condition.id, 'field', e.target.value)}
                  >
                    <option>Property Type</option>
                    <option>Foreclosure Status</option>
                    <option>Property Value</option>
                    <option>Taxes Due</option>
                    <option>ZIP Code</option>
                    <option>Owner Name</option>
                  </select>
                  
                  <select 
                    className="operator-selector"
                    value={condition.operator}
                    onChange={(e) => updateFilterCondition(condition.id, 'operator', e.target.value)}
                  >
                    <option>is</option>
                    <option>is not</option>
                    <option>contains</option>
                    <option>greater than</option>
                    <option>less than</option>
                    <option>between</option>
                  </select>
                  
                  <input 
                    type="text"
                    className="value-input"
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => updateFilterCondition(condition.id, 'value', e.target.value)}
                  />
                  
                  <button 
                    className="remove-condition-btn"
                    onClick={() => removeFilterCondition(condition.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            <button className="add-condition-btn" onClick={addFilterCondition}>
              <Plus size={14} />
              Add Condition
            </button>
          </div>
        </div>
      )}
      
      <div className="search-buttons">
        <button className="btn-secondary" onClick={() => {
          setShowAdvancedFilters(false);
          setShowFilterBuilder(false);
        }}>
          <RefreshCw size={16} className="icon" />
          Reset Filters
        </button>
        
        <div className="primary-actions">
          <button className="btn-secondary" onClick={saveCurrentSearch}>
            <Save size={16} className="icon" />
            Save Filter
          </button>
          
          <button className="btn-primary" onClick={handleSearch}>
            <Search size={16} className="icon" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchFilters;
import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Share2,
  ArrowUp,
  ArrowDown,
  Minus,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  BarChart2
} from 'lucide-react';

const PropertyComparisonTool = () => {
  // sample properties data - replace later
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: '123 Main St, Fort Worth',
      propertyType: 'Residential',
      zipCode: '76102',
      value: 245000,
      taxesDue: 12500,
      foreclosureStatus: true,
      ownershipYears: 8,
      size: 2200,
      bedrooms: 4,
      bathrooms: 2.5,
      yearBuilt: 1985,
      lastContactDate: '2025-03-10',
      category: 'Target'
    },
    {
      id: 2,
      name: '456 Oak Ave, Fort Worth',
      propertyType: 'Residential',
      zipCode: '76104',
      value: 178000,
      taxesDue: 8750,
      foreclosureStatus: false,
      ownershipYears: 5,
      size: 1800,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 1992,
      lastContactDate: '2025-03-05',
      category: 'Target'
    },
    {
      id: 3,
      name: '789 Elm St, Fort Worth',
      propertyType: 'Residential',
      zipCode: '76106',
      value: 320000,
      taxesDue: 15000,
      foreclosureStatus: true,
      ownershipYears: 12,
      size: 2600,
      bedrooms: 5,
      bathrooms: 3,
      yearBuilt: 1978,
      lastContactDate: '2025-03-01',
      category: 'Target'
    }
  ]);
  
  // available properties for adding to comparison - replace data later
  const [availableProperties, setAvailableProperties] = useState([
    {
      id: 4,
      name: '321 Pine St, Fort Worth',
      propertyType: 'Residential',
      zipCode: '76104',
      value: 210000,
      category: 'Opportunity'
    },
    {
      id: 5,
      name: '567 Maple Ave, Fort Worth',
      propertyType: 'Commercial',
      zipCode: '76106',
      value: 450000,
      category: 'Target'
    }
  ]);
  
  // State for showing/hiding the add property dropdown
  const [showAddProperty, setShowAddProperty] = useState(false);
  
  // State for sorting
  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Handle removing a property from comparison
  const removeProperty = (id) => {
    const removedProperty = properties.find(p => p.id === id);
    setProperties(properties.filter(p => p.id !== id));
    
    if (removedProperty) {
      setAvailableProperties([...availableProperties, removedProperty]);
    }
  };
  
  // handle adding a property to comparison
  const addProperty = (id) => {
    const propertyToAdd = availableProperties.find(p => p.id === id);
    setAvailableProperties(availableProperties.filter(p => p.id !== id));
    
    if (propertyToAdd) {
      setProperties([...properties, propertyToAdd]);
    }
    
    setShowAddProperty(false);
  };
  
  // handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Sort properties based on current sort settings
  const sortedProperties = [...properties].sort((a, b) => {
    const valueA = a[sortField] ?? 0;
    const valueB = b[sortField] ?? 0;
    
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  // Function to render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return <Minus size={14} className="sort-icon" />;
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="sort-icon active" />
      : <ArrowDown size={14} className="sort-icon active" />;
  };
  
  // Function to render comparison value with indicators
  const renderComparisonValue = (property, field, formatter = (v) => v) => {
    if (property[field] === undefined) return '-';
    
    const value = formatter(property[field]);
    
    // Only show indicators if more than one property
    if (properties.length <= 1) return value;
    
    // Find min/max values among properties
    const values = properties.map(p => p[field]).filter(v => v !== undefined);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    let indicatorClass = '';
    let indicator = null;
    
    // Fields where higher is better
    const higherIsBetter = ['value', 'size', 'bedrooms', 'bathrooms', 'yearBuilt'];
    // Fields where lower is better
    const lowerIsBetter = ['taxesDue', 'ownershipYears'];
    
    if (higherIsBetter.includes(field)) {
      if (property[field] === maxValue) {
        indicatorClass = 'best-value';
        indicator = <ArrowUp size={14} className="indicator-icon best" />;
      } else if (property[field] === minValue) {
        indicatorClass = 'worst-value';
        indicator = <ArrowDown size={14} className="indicator-icon worst" />;
      }
    } else if (lowerIsBetter.includes(field)) {
      if (property[field] === minValue) {
        indicatorClass = 'best-value';
        indicator = <ArrowUp size={14} className="indicator-icon best" />;
      } else if (property[field] === maxValue) {
        indicatorClass = 'worst-value';
        indicator = <ArrowDown size={14} className="indicator-icon worst" />;
      }
    }
    
    return (
      <div className={`comparison-value ${indicatorClass}`}>
        {value}
        {indicator}
      </div>
    );
  };
  
  return (
    <div className="property-comparison-container">
      <div className="comparison-header">
        <h3 className="panel-title">Property Comparison</h3>
        <div className="comparison-actions">
          <button className="btn-secondary">
            <Copy size={16} className="icon" />
            Export
          </button>
          <button className="btn-secondary">
            <Share2 size={16} className="icon" />
            Share
          </button>
          <div className="dropdown">
            <button 
              className="btn-primary"
              onClick={() => setShowAddProperty(!showAddProperty)}
            >
              Add Property
              <ChevronDown size={16} />
            </button>
            {showAddProperty && (
              <div className="dropdown-menu property-menu">
                <h4 className="dropdown-title">Add to Comparison</h4>
                {availableProperties.length === 0 ? (
                  <div className="dropdown-item disabled">No properties available</div>
                ) : (
                  availableProperties.map(property => (
                    <div 
                      key={property.id} 
                      className="dropdown-item"
                      onClick={() => addProperty(property.id)}
                    >
                      <div className="property-item">
                        <div className="property-category-badge">{property.category}</div>
                        <div className="property-item-details">
                          <div className="property-item-name">{property.name}</div>
                          <div className="property-item-subtitle">
                            {property.propertyType} | {property.zipCode} | ${property.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="comparison-table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="property-info-header">Property Information</th>
              {sortedProperties.map(property => (
                <th key={property.id} className="property-column">
                  <div className="property-header">
                    <div className="property-name">{property.name}</div>
                    <button 
                      className="remove-property-btn"
                      onClick={() => removeProperty(property.id)}
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Info Section */}
            <tr className="section-header">
              <td colSpan={properties.length + 1}>
                <div className="section-title">
                  <Home size={16} className="section-icon" />
                  Basic Information
                </div>
              </td>
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('propertyType')}>
                <div className="sortable-label">
                  Property Type
                  {renderSortIndicator('propertyType')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>{property.propertyType || '-'}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('zipCode')}>
                <div className="sortable-label">
                  ZIP Code
                  {renderSortIndicator('zipCode')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>{property.zipCode || '-'}</td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('size')}>
                <div className="sortable-label">
                  Size (sq ft)
                  {renderSortIndicator('size')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(property, 'size', v => v.toLocaleString())}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('bedrooms')}>
                <div className="sortable-label">
                  Bedrooms
                  {renderSortIndicator('bedrooms')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(property, 'bedrooms')}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('bathrooms')}>
                <div className="sortable-label">
                  Bathrooms
                  {renderSortIndicator('bathrooms')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(property, 'bathrooms')}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('yearBuilt')}>
                <div className="sortable-label">
                  Year Built
                  {renderSortIndicator('yearBuilt')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(property, 'yearBuilt')}
                </td>
              ))}
            </tr>
            
            {/* Financial Section */}
            <tr className="section-header">
              <td colSpan={properties.length + 1}>
                <div className="section-title">
                  <DollarSign size={16} className="section-icon" />
                  Financial Information
                </div>
              </td>
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('value')}>
                <div className="sortable-label">
                  Property Value
                  {renderSortIndicator('value')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(
                    property, 
                    'value', 
                    v => `$${v.toLocaleString()}`
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('taxesDue')}>
                <div className="sortable-label">
                  Taxes Due
                  {renderSortIndicator('taxesDue')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(
                    property, 
                    'taxesDue', 
                    v => `$${v.toLocaleString()}`
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('foreclosureStatus')}>
                <div className="sortable-label">
                  Foreclosure Status
                  {renderSortIndicator('foreclosureStatus')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {property.foreclosureStatus !== undefined ? 
                    (property.foreclosureStatus ? 
                      <span className="status-badge foreclosure">Yes</span> : 
                      <span className="status-badge no-foreclosure">No</span>
                    ) : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('ownershipYears')}>
                <div className="sortable-label">
                  Years of Ownership
                  {renderSortIndicator('ownershipYears')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {renderComparisonValue(
                    property, 
                    'ownershipYears', 
                    v => `${v} years`
                  )}
                </td>
              ))}
            </tr>
            
            {/* Activity Section */}
            <tr className="section-header">
              <td colSpan={properties.length + 1}>
                <div className="section-title">
                  <Calendar size={16} className="section-icon" />
                  Activity & Status
                </div>
              </td>
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('lastContactDate')}>
                <div className="sortable-label">
                  Last Contact Date
                  {renderSortIndicator('lastContactDate')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>
                  {property.lastContactDate ? 
                    new Date(property.lastContactDate).toLocaleDateString() : 
                    'Never'
                  }
                </td>
              ))}
            </tr>
            <tr>
              <td className="row-label" onClick={() => handleSort('category')}>
                <div className="sortable-label">
                  Category
                  {renderSortIndicator('category')}
                </div>
              </td>
              {sortedProperties.map(property => (
                <td key={property.id}>{property.category || '-'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="comparison-chart-section">
        <h4 className="section-subtitle">
          <BarChart2 size={16} className="section-icon" />
          Property Value Comparison
        </h4>
        
        <div className="value-chart">
          {sortedProperties.map(property => {
            // Find max value to normalize the chart
            const maxValue = Math.max(...properties.map(p => p.value || 0));
            const percentage = ((property.value || 0) / maxValue) * 100;
            
            return (
              <div className="chart-bar-container" key={property.id}>
                <div className="chart-bar-label">{property.name}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    ${property.value?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyComparisonTool;
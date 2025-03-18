import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  Target,
  Phone,
  Mail,
  FileText,
  Search,
  Plus,
  Filter,
  DollarSign,
  Users,
  Calendar,
  ChevronDown,
  Briefcase,
  ListTodo,
  Info,
  AlertCircle,
  MessageSquare,
  MapPin,
  Bookmark,
  Clock,
  Save,
  Trophy,
  RefreshCw,
  UserPlus,
  File,
  Download,
  Upload,
  List
} from 'lucide-react';
import './App.css';
import DragDropTaskBoard from './DragDropTaskBoard .js';
import AdvancedSearchFilters from './AdvancedSearchFilters.js';
import PropertyComparisonTool from './PropertyComparisonTool.js';

// Demo data for leads - we'll replace with real API data later
const DemoData = {
  targets: [
    {
      id: 1,
      name: 'Jorge Almaguer',
      address: '123 Main St',
      city: 'Fort Worth',
      state: 'TX',
      zip: '76102',
      status: 'New Lead',
      taxesDue: 12500,
      propertyValue: 245000,
      propertyType: 'Residential',
      foreclosureStatus: true
    },
    {
      id: 2,
      name: 'Mike Johnson',
      address: '456 Oak Ave',
      city: 'Fort Worth',
      state: 'TX',
      zip: '76104',
      status: 'In Progress',
      taxesDue: 8750,
      propertyValue: 178000,
      propertyType: 'Residential',
      foreclosureStatus: false
    },
    {
      id: 3,
      name: 'Sarah Williams',
      address: '789 Elm St',
      city: 'Fort Worth',
      state: 'TX',
      zip: '76106',
      status: 'New Lead',
      taxesDue: 15000,
      propertyValue: 320000,
      propertyType: 'Residential',
      foreclosureStatus: true
    }
  ],
  missions: [
    {
      id: 101,
      name: 'Fort Worth North',
      description: 'Tax lien properties in 76106',
      targetCount: 24,
      status: 'Active',
      startDate: '2025-02-15',
      completionRate: 35
    },
    {
      id: 102,
      name: 'Commercial Downtown',
      description: 'Commercial properties in 76102',
      targetCount: 12,
      status: 'Active',
      startDate: '2025-03-01',
      completionRate: 15
    }
  ],
  tasks: [
    { 
      id: 1, 
      text: 'Initial contact with Jorge Almaguer', 
      status: 'green', 
      date: 'Mar 12, 2025',
      assignee: 'You',
      priority: 'Medium',
      relatedTo: 'Jorge Almaguer'
    },
    { 
      id: 2, 
      text: 'Send tax information to Mike Johnson', 
      status: 'yellow', 
      date: 'Due today',
      assignee: 'You',
      priority: 'High',
      relatedTo: 'Mike Johnson'
    },
    { 
      id: 3, 
      text: 'Follow-up call with Sarah Williams', 
      status: 'red', 
      date: 'Overdue (2 days)',
      assignee: 'Sarah',
      priority: 'Critical',
      relatedTo: 'Sarah Williams'
    },
    { 
      id: 4, 
      text: 'Review property documents for 789 Elm St', 
      status: 'yellow', 
      date: 'Due tomorrow',
      assignee: 'You',
      priority: 'Medium',
      relatedTo: 'Sarah Williams'
    }
  ],
  opportunities: [
    {
      id: 201,
      address: '321 Pine St',
      city: 'Fort Worth',
      state: 'TX',
      zip: '76104',
      expectedValue: 45000,
      probability: 'High',
      stage: 'Negotiation'
    },
    {
      id: 202,
      address: '567 Maple Ave',
      city: 'Fort Worth',
      state: 'TX',
      zip: '76106',
      expectedValue: 32000,
      probability: 'Medium',
      stage: 'Initial Contact'
    }
  ]
};

function App() {
  // State management for UI components
  const [activeTab, setActiveTab] = useState('targets');
  const [selectedLead, setSelectedLead] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(50000);
  const [expandedItems, setExpandedItems] = useState([]);
  const [mapView, setMapView] = useState('standard');
  const [showMap, setShowMap] = useState(false);
  const [detailsTab, setDetailsTab] = useState('info');
  
  // Token usage
  const [tokenUsage, setTokenUsage] = useState(12450);
  const [totalTokens, setTotalTokens] = useState(50000);
  
  // Notifications
  const [notificationTime, setNotificationTime] = useState(new Date(Date.now() - 45 * 60000)); // 45 mins ago
  const [newLeadsCount, setNewLeadsCount] = useState(18);
  
  // Search functionality
  const [searchHistory, setSearchHistory] = useState([
    { id: 1, zipCodes: '76102, 76104', radius: 5, propertyType: 'Residential' },
    { id: 2, zipCodes: '76106', radius: 10, propertyType: 'All Properties' }
  ]);
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, name: 'Fort Worth North', zipCodes: '76106, 76164', radius: 5, propertyType: 'Residential' },
    { id: 2, name: 'Commercial Downtown', zipCodes: '76102', radius: 2, propertyType: 'Commercial' }
  ]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [multipleZipCodes, setMultipleZipCodes] = useState('');
  
  // Task management
  const [tasks, setTasks] = useState(DemoData.tasks);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskSortBy, setTaskSortBy] = useState('date');
  const [showTaskFilters, setShowTaskFilters] = useState(false);
  
  // Notes for the leads
  const [leadNotes, setLeadNotes] = useState([
    { id: 1, text: "Owner seems interested in selling due to tax burden", date: "Mar 10, 2025", author: "You" },
    { id: 2, text: "Property needs major repairs according to owner", date: "Mar 8, 2025", author: "Sarah" }
  ]);
  const [newNote, setNewNote] = useState('');

  // Navigation items with subitems
  const navItems = [
    { 
      id: 'targets', 
      icon: <Target size={20} />, 
      label: 'Targets',
      hasSubMenu: true,
      subItems: [
        { id: 'new-leads', label: 'New Leads' },
        { id: 'saved-targets', label: 'Saved Targets' },
        { id: 'high-value', label: 'High Value' }
      ]
    },
    { 
      id: 'missions', 
      icon: <Map size={20} />, 
      label: 'Missions',
      hasSubMenu: true,
      subItems: [
        { id: 'active-missions', label: 'Active Missions' },
        { id: 'completed', label: 'Completed' },
        { id: 'archived', label: 'Archived' }
      ]
    },
    { 
      id: 'tasks', 
      icon: <ListTodo size={20} />, 
      label: 'Tasks',
      hasSubMenu: true,
      subItems: [
        { id: 'my-tasks', label: 'My Tasks' },
        { id: 'team-tasks', label: 'Team Tasks' },
        { id: 'completed-tasks', label: 'Completed' }
      ]
    },
    { 
      id: 'opportunities', 
      icon: <Briefcase size={20} />, 
      label: 'Opportunities',
      hasSubMenu: true,
      subItems: [
        { id: 'active-opps', label: 'Active' },
        { id: 'won', label: 'Won' },
        { id: 'lost', label: 'Lost' }
      ]
    },
    { 
      id: 'warroom', 
      icon: <Phone size={20} />, 
      label: 'War Room',
      hasSubMenu: true,
      subItems: [
        { id: 'call-logs', label: 'Call Logs' },
        { id: 'text-messages', label: 'Text Messages' },
        { id: 'email-templates', label: 'Email Templates' }
      ]
    },
    { 
      id: 'marketing', 
      icon: <Mail size={20} />, 
      label: 'Marketing',
      hasSubMenu: true,
      subItems: [
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'templates', label: 'Templates' },
        { id: 'analytics', label: 'Analytics' }
      ]
    },
    { 
      id: 'info', 
      icon: <Info size={20} />, 
      label: 'Info',
      hasSubMenu: false
    },
    { 
      id: 'news', 
      icon: <FileText size={20} />, 
      label: 'News',
      hasSubMenu: false
    }
  ];

  // Toggle function for expanding/collapsing sidebar items
  const toggleExpand = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  // This function is here to show only new leads
  const showNewLeads = () => {
    // This would filter the leads in a real implementation
    console.log("Showing only new leads");
    setActiveTab('targets');
    // Additional filtering logic would go here
  };

  // Function to add a note to a lead
  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: leadNotes.length + 1,
        text: newNote,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        author: "You"
      };
      setLeadNotes([note, ...leadNotes]);
      setNewNote('');
    }
  };

  // Functions for search functionality
  const handleSearch = () => {
    // This would perform the actual search in a real implementation later
    // but for now, just add to search history
    const newSearch = {
      id: searchHistory.length + 1,
      zipCodes: multipleZipCodes,
      radius: 5, // !!Get from the actual field
      propertyType: 'Residential' // !!Get from the actual field
    };
    
    setSearchHistory([newSearch, ...searchHistory]);
  };

  const applySavedSearch = (search) => {
    setMultipleZipCodes(search.zipCodes);
    // Set other search fields here
    setShowSavedSearches(false);
  };

  const applyHistorySearch = (search) => {
    setMultipleZipCodes(search.zipCodes);
    // Set other search fields here
    setShowSearchHistory(false);
  };

  const saveCurrentSearch = () => {
    // This would open a dialog to name and save the search
    const searchName = prompt("Enter a name for this search:");
    if (searchName) {
      const newSavedSearch = {
        id: savedSearches.length + 1,
        name: searchName,
        zipCodes: multipleZipCodes,
        radius: 5, // !!Get from the actual field
        propertyType: 'Residential' // !!Get from the actual field
      };
      
      setSavedSearches([...savedSearches, newSavedSearch]);
    }
  };

  // Filter tasks based on current filter
  const filteredTasks = taskFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === taskFilter);

  // Function to add a new task
  const addNewTask = () => {
    // This would open a dialog to create a new task
    // just add a placeholder task for now
    const newTask = {
      id: tasks.length + 1,
      text: 'New Task',
      status: 'yellow',
      date: 'Due in 3 days',
      assignee: 'You',
      priority: 'Medium',
      relatedTo: 'N/A'
    };
    
    setTasks([...tasks, newTask]);
  };

  // Get the content for the current active tab!
  const getTabContent = () => {
    switch (activeTab) {
      case 'targets':
          return (
            <>
              {/* Advanced Search Filters */}
              <AdvancedSearchFilters />

              {/* Map/List View Toggle */}
              {showMap ? (
                <div className="map-container-full">
                  <div className="map-header">
                    <h3 className="panel-title">Property Map View</h3>
                    <div className="map-controls">
                      <div className="map-view-buttons">
                        <button 
                          className={`map-btn ${mapView === 'standard' ? 'active' : ''}`}
                          onClick={() => setMapView('standard')}
                        >
                          Standard
                        </button>
                        <button 
                          className={`map-btn ${mapView === 'satellite' ? 'active' : ''}`}
                          onClick={() => setMapView('satellite')}
                        >
                          Satellite
                        </button>
                        <button 
                          className={`map-btn ${mapView === 'terrain' ? 'active' : ''}`}
                          onClick={() => setMapView('terrain')}
                        >
                          Terrain
                        </button>
                      </div>
                      <button className="btn-secondary" onClick={() => setShowMap(false)}>
                        <List size={16} className="icon" />
                        List View
                      </button>
                    </div>
                  </div>
                  <div className="map-visualization">
                    {/* This would be replaced with actual Google Maps component */}
                    <div className="map-placeholder">
                      <MapPin size={40} className="map-icon" />
                      <p>Google Maps Integration</p>
                      <p className="map-description">
                        Properties are shown as pins on the map. 
                        This would be connected to the Google Maps API.
                      </p>
                      <div className="map-legend">
                        <div className="legend-item">
                          <div className="legend-marker new"></div>
                          <span>New Leads</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-marker foreclosure"></div>
                          <span>Foreclosure</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-marker regular"></div>
                          <span>Regular Leads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="view-toggle">
                    <button className="btn-secondary active">
                      <List size={16} className="icon" />
                      List View
                    </button>
                    <button className="btn-secondary" onClick={() => setShowMap(true)}>
                      <Map size={16} className="icon" />
                      Map View
                    </button>
                  </div>
                  
                  {/* Lead List */}
                  <div className="lead-panel">
                    <div className="lead-header">
                      <h3 className="panel-title">Available Leads</h3>
                      <div className="lead-actions">
                        <button className="btn-secondary">
                          <Filter size={16} className="icon" />
                          Filter
                        </button>
                        <button className="btn-primary">
                          Get All Leads
                        </button>
                      </div>
                    </div>

                    <div className="lead-list">
                      {DemoData.targets.map((lead) => (
                        <div 
                          key={lead.id}
                          className="lead-item"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="lead-content">
                            <div className="lead-info">
                              <h4 className="lead-name">{lead.name}</h4>
                              <p className="lead-address">
                                {lead.address}, {lead.city}, {lead.state} {lead.zip}
                              </p>
                              <div className="lead-tags">
                                <span className={`tag-status ${lead.status === 'New Lead' ? 'new' : 'progress'}`}>
                                  {lead.status}
                                </span>
                                {lead.foreclosureStatus && (
                                  <span className="tag-foreclosure">
                                    Foreclosure
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="lead-finances">
                              <p className="property-value">
                                ${lead.propertyValue.toLocaleString()}
                              </p>
                              <p className="taxes-due">
                                Taxes Due: ${lead.taxesDue.toLocaleString()}
                              </p>
                              <p className="property-type">
                                {lead.propertyType}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Property Comparison Tool */}
              <PropertyComparisonTool />
            </>
          );
      case 'missions':
        return (
          <div className="mission-panel">
            <div className="panel-header">
              <h3 className="panel-title">Active Missions</h3>
              <button className="btn-primary">
                <Plus size={16} className="icon" />
                New Mission
              </button>
            </div>
            
            <div className="mission-list">
              {DemoData.missions.map(mission => (
                <div key={mission.id} className="mission-item">
                  <div className="mission-header">
                    <h4 className="mission-name">{mission.name}</h4>
                    <span className="mission-status-badge">
                      {mission.status}
                    </span>
                  </div>
                  <p className="mission-description">{mission.description}</p>
                  <div className="mission-details">
                    <div className="mission-detail">
                      <span className="detail-label">Target Count:</span>
                      <span className="detail-value">{mission.targetCount}</span>
                    </div>
                    <div className="mission-detail">
                      <span className="detail-label">Start Date:</span>
                      <span className="detail-value">{mission.startDate}</span>
                    </div>
                  </div>
                  <div className="mission-progress">
                    <div className="progress-label">
                      <span>Progress</span>
                      <span>{mission.completionRate}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${mission.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'tasks':
        return (
          <DragDropTaskBoard />
        );
        
      case 'opportunities':
        return (
          <div className="opportunity-panel">
            <div className="panel-header">
              <h3 className="panel-title">Opportunities</h3>
              <button className="btn-primary">
                <Plus size={16} className="icon" />
                New Opportunity
              </button>
            </div>
            
            <div className="opportunity-list">
              {DemoData.opportunities.map(opp => (
                <div key={opp.id} className="opportunity-item">
                  <div className="opportunity-address">
                    <h4>{opp.address}</h4>
                    <p>{opp.city}, {opp.state} {opp.zip}</p>
                  </div>
                  <div className="opportunity-details">
                    <div className="opportunity-value">
                      ${opp.expectedValue.toLocaleString()}
                    </div>
                    <div className="opportunity-stage">
                      Stage: <span className="stage-label">{opp.stage}</span>
                    </div>
                    <div className="opportunity-probability">
                      <span className={`probability-badge ${opp.probability.toLowerCase()}`}>
                        {opp.probability} Probability
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        // Default content or "coming soon" for other sections
        return (
          <div className="coming-soon-container">
            <h3 className="coming-soon-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h3>
            <p className="coming-soon-text">This section is coming soon. We're working hard to bring you more features!</p>
            <div className="coming-soon-icon">
              <Briefcase size={48} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">Drone Strike CRM</h1>
          <div className="token-display">
            <DollarSign size={16} className="icon" />
            <div className="token-info">
              <div className="token-balance">Tokens: {tokenBalance.toLocaleString()}</div>
              <div className="token-usage-container">
                <div className="token-usage-text">
                  Usage: {tokenUsage.toLocaleString()} / {totalTokens.toLocaleString()}
                </div>
                <div className="token-progress-container">
                  <div 
                    className="token-progress-bar" 
                    style={{ width: `${(tokenUsage / totalTokens) * 100}%` }}
                  />
                </div>
              </div>
              <button className="token-purchase-btn" title="Purchase additional tokens">
                <Plus size={12} />
                Purchase Tokens
              </button>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div key={item.id} className="nav-item-container">
              <button
                onClick={() => item.hasSubMenu ? toggleExpand(item.id) : setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'nav-active' : ''}`}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
                {item.hasSubMenu && (
                  <ChevronDown 
                    size={16} 
                    className={`chevron-icon ${expandedItems.includes(item.id) ? 'rotated' : ''}`} 
                  />
                )}
              </button>
              
              {/* Submenu items */}
              {item.hasSubMenu && expandedItems.includes(item.id) && (
                <div className="submenu">
                  {item.subItems.map(subItem => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveTab(subItem.id)}
                      className={`submenu-item ${activeTab === subItem.id ? 'submenu-active' : ''}`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="company-info">
            <div className="info-row">
              <Users size={16} className="icon" />
              <span>Company: Real Estate Pro</span>
            </div>
            <div className="info-row">
              <Calendar size={16} className="icon" />
              <span>Subscription: Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-container">
            <h2 className="page-title">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="header-actions">
              {activeTab === 'targets' && (
                <button className="btn-primary">
                  <Plus size={20} className="icon" />
                  New Lead
                </button>
              )}
              {activeTab === 'tasks' && (
                <button className="btn-primary">
                  <Plus size={20} className="icon" />
                  New Task
                </button>
              )}
              {activeTab === 'missions' && (
                <button className="btn-primary">
                  <Plus size={20} className="icon" />
                  New Mission
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Alert Bar */}
        <div className="alert-bar">
          <div className="alert-content clickable" onClick={showNewLeads}>
            <AlertCircle size={20} className="icon" />
            <div className="alert-message">
              <span>New leads available in your target area ({newLeadsCount})</span>
              <span className="alert-timestamp">
                {notificationTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div className="alert-actions">
              <button className="alert-action-btn" onClick={(e) => {
                e.stopPropagation();
                showNewLeads();
              }}>
                View Now
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Dynamic content based on active tab */}
          {getTabContent()}
        </div>
      </div>

      {/* Lead Details Sidebar */}
      {selectedLead && (
        <div className="details-sidebar">
          <div className="details-header">
            <h3 className="details-title">Lead Details</h3>
            <button 
              onClick={() => setSelectedLead(null)}
              className="close-btn"
            >
              ×
            </button>
          </div>
          
          <div className="details-content">
            <div className="details-top">
              <h4 className="details-name">{selectedLead.name}</h4>
              
              {/* Badge for high-value properties */}
              {selectedLead.propertyValue > 200000 && (
                <span className="high-value-badge">
                  <Trophy size={14} />
                  High Value
                </span>
              )}
            </div>
            
            {/* Contact Actions */}
            <div className="action-buttons">
              <button className="btn-call">
                <Phone size={16} className="icon" />
                Call
              </button>
              <button className="btn-text">
                <MessageSquare size={16} className="icon" />
                Text
              </button>
              <button className="btn-email">
                <Mail size={16} className="icon" />
                Email
              </button>
            </div>
            
            {/* Tabs for different detail sections */}
            <div className="details-tabs">
              <button 
                className={`tab-btn ${detailsTab === 'info' ? 'active' : ''}`}
                onClick={() => setDetailsTab('info')}
              >
                Information
              </button>
              <button 
                className={`tab-btn ${detailsTab === 'activity' ? 'active' : ''}`}
                onClick={() => setDetailsTab('activity')}
              >
                Activity
              </button>
              <button 
                className={`tab-btn ${detailsTab === 'documents' ? 'active' : ''}`}
                onClick={() => setDetailsTab('documents')}
              >
                Documents
              </button>
              <button 
                className={`tab-btn ${detailsTab === 'notes' ? 'active' : ''}`}
                onClick={() => setDetailsTab('notes')}
              >
                Notes
              </button>
            </div>
            
            {/* Information Tab */}
            {detailsTab === 'info' && (
              <div className="details-section">
                {/* Property Information Card */}
                <div className="details-card">
                  <h5 className="card-title">Property Information</h5>
                  <div className="details-field">
                    <label className="field-label">Address</label>
                    <p>{selectedLead.address}, {selectedLead.city}, {selectedLead.state} {selectedLead.zip}</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Property Type</label>
                    <p>{selectedLead.propertyType}</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Status</label>
                    <div className="tag-container">
                      <span className={`tag-status ${selectedLead.status === 'New Lead' ? 'new' : 'progress'}`}>
                        {selectedLead.status}
                      </span>
                      {selectedLead.foreclosureStatus && (
                        <span className="tag-foreclosure">
                          Foreclosure
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Added to System</label>
                    <p>March 5, 2025</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Last Updated</label>
                    <p>March 12, 2025</p>
                  </div>
                </div>
                
                {/* Financial Details Card */}
                <div className="details-card">
                  <h5 className="card-title">Financial Details</h5>
                  <div className="details-field">
                    <label className="field-label">Property Value</label>
                    <p className="property-value">${selectedLead.propertyValue.toLocaleString()}</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Taxes Due</label>
                    <p className="taxes-due">${selectedLead.taxesDue.toLocaleString()}</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Last Tax Payment</label>
                    <p>January 15, 2025</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Tax Rate</label>
                    <p>2.15%</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Years of Ownership</label>
                    <p>8 years</p>
                  </div>
                </div>
                
                {/* Owner Information Card */}
                <div className="details-card">
                  <h5 className="card-title">Owner Information</h5>
                  <div className="details-field">
                    <label className="field-label">Full Name</label>
                    <p>{selectedLead.name}</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Phone Number</label>
                    <p>(817) 555-6789</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Email Address</label>
                    <p>{selectedLead.name.split(' ')[0].toLowerCase()}@example.com</p>
                  </div>
                  <div className="details-field">
                    <label className="field-label">Mailing Address</label>
                    <p>Same as property</p>
                  </div>
                </div>
                
                {/* Property Map */}
                <div className="details-card">
                  <h5 className="card-title">Property Location</h5>
                  <div className="map-container">
                    {/* This would be replaced with actual Google Maps component */}
                    <div className="map-placeholder">
                      <MapPin size={24} className="map-icon" />
                      <span>Property Map View</span>
                    </div>
                    
                    {/* Map controls */}
                    <div className="map-controls">
                      <button 
                        className={`map-btn ${mapView === 'standard' ? 'active' : ''}`}
                        onClick={() => setMapView('standard')}
                      >
                        Standard
                      </button>
                      <button 
                        className={`map-btn ${mapView === 'satellite' ? 'active' : ''}`}
                        onClick={() => setMapView('satellite')}
                      >
                        Satellite
                      </button>
                      <button 
                        className={`map-btn ${mapView === 'terrain' ? 'active' : ''}`}
                        onClick={() => setMapView('terrain')}
                      >
                        Terrain
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Task Checklist */}
                <div className="details-card">
                  <h5 className="card-title">Task Checklist</h5>
                  <div className="task-list">
                    {tasks.filter(task => task.relatedTo === selectedLead.name).length > 0 ? (
                      tasks
                        .filter(task => task.relatedTo === selectedLead.name)
                        .map(task => (
                          <div key={task.id} className="task-item">
                            <div className={`task-status ${task.status}`}></div>
                            <span className="task-text">{task.text}</span>
                            <span className="task-date">{task.date}</span>
                          </div>
                        ))
                    ) : (
                      <div className="no-tasks-message">No tasks for this lead</div>
                    )}
                    <button className="add-task-btn">
                      <Plus size={16} className="icon" />
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Activity Tab */}
            {detailsTab === 'activity' && (
              <div className="details-section">
                <div className="details-card">
                  <h5 className="card-title">Communication History</h5>
                  <div className="comm-history">
                    <div className="comm-item">
                      <div className="comm-icon email">
                        <Mail size={14} />
                      </div>
                      <div className="comm-details">
                        <div className="comm-header">
                          <span className="comm-type">Email Sent</span>
                          <span className="comm-date">Mar 10, 2025</span>
                        </div>
                        <p className="comm-description">Property tax inquiry follow-up</p>
                      </div>
                    </div>
                    <div className="comm-item">
                      <div className="comm-icon call">
                        <Phone size={14} />
                      </div>
                      <div className="comm-details">
                        <div className="comm-header">
                          <span className="comm-type">Phone Call</span>
                          <span className="comm-date">Mar 8, 2025</span>
                        </div>
                        <p className="comm-description">Discussed payment options (2m 30s)</p>
                      </div>
                    </div>
                    <div className="comm-item">
                      <div className="comm-icon text">
                        <MessageSquare size={14} />
                      </div>
                      <div className="comm-details">
                        <div className="comm-header">
                          <span className="comm-type">Text Message</span>
                          <span className="comm-date">Mar 7, 2025</span>
                        </div>
                        <p className="comm-description">Scheduled initial consultation</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="details-card">
                  <h5 className="card-title">System Activity</h5>
                  <div className="activity-timeline">
                    <div className="activity-item">
                      <div className="activity-icon update">
                        <RefreshCw size={14} />
                      </div>
                      <div className="activity-details">
                        <div className="activity-header">
                          <span className="activity-type">Lead Updated</span>
                          <span className="activity-date">Mar 12, 2025</span>
                        </div>
                        <p className="activity-description">Property value updated from $240,000 to $245,000</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon create">
                        <FileText size={14} />
                      </div>
                      <div className="activity-details">
                        <div className="activity-header">
                          <span className="activity-type">Task Created</span>
                          <span className="activity-date">Mar 9, 2025</span>
                        </div>
                        <p className="activity-description">Follow-up call scheduled</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon new">
                        <UserPlus size={14} />
                      </div>
                      <div className="activity-details">
                        <div className="activity-header">
                          <span className="activity-type">Lead Added</span>
                          <span className="activity-date">Mar 5, 2025</span>
                        </div>
                        <p className="activity-description">Lead imported from weekly data update</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Documents Tab */}
            {detailsTab === 'documents' && (
              <div className="details-section">
                <div className="details-card">
                  <h5 className="card-title">Documents</h5>
                  <div className="document-list">
                    <div className="document-item">
                      <div className="document-icon">
                        <File size={16} />
                      </div>
                      <div className="document-details">
                        <span className="document-name">Property Tax Statement.pdf</span>
                        <span className="document-date">Uploaded Mar 10, 2025</span>
                      </div>
                      <div className="document-actions">
                        <button className="icon-button" title="Download">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="document-item">
                      <div className="document-icon">
                        <File size={16} />
                      </div>
                      <div className="document-details">
                        <span className="document-name">Property Photos.zip</span>
                        <span className="document-date">Uploaded Mar 8, 2025</span>
                      </div>
                      <div className="document-actions">
                        <button className="icon-button" title="Download">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="upload-document">
                      <button className="add-document-btn">
                        <Upload size={16} className="icon" />
                        Upload Document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notes Tab */}
            {detailsTab === 'notes' && (
              <div className="details-section">
                <div className="details-card">
                  <h5 className="card-title">Notes</h5>
                  <div className="notes-input">
                    <textarea 
                      placeholder="Add a note about this lead..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="note-textarea"
                    ></textarea>
                    <button 
                      className="add-note-btn"
                      onClick={addNote}
                      disabled={!newNote.trim()}
                    >
                      <Plus size={16} className="icon" />
                      Add Note
                    </button>
                  </div>
                  <div className="notes-list">
                    {leadNotes.map(note => (
                      <div key={note.id} className="note-item">
                        <div className="note-header">
                          <span className="note-author">{note.author}</span>
                          <span className="note-date">{note.date}</span>
                        </div>
                        <p className="note-text">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
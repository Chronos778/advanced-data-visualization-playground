import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the DataContext
const DataContext = createContext(null);

/**
 * Data Provider Component
 * Manages global application state for data, transformations, and preferences
 */
export const DataProvider = ({ children }) => {
  // Data state
  const [data, setData] = useState(null);
  const [transformedData, setTransformedData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  
  // UI state
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  // Preferences
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('user-preferences');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      defaultChartType: 'bar',
      autoSave: true,
      showTooltips: true,
      animateCharts: true
    };
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Data operations
  const loadData = useCallback((newData) => {
    setData(newData);
    setTransformedData(null);
    setDataHistory(prev => [...prev.slice(-9), newData]); // Keep last 10
    
    addNotification({
      type: 'success',
      message: `Successfully loaded ${newData.fileName} with ${newData.rowCount} rows`
    });
  }, []);

  const applyTransformation = useCallback((transformation) => {
    setTransformedData(transformation);
    addNotification({
      type: 'info',
      message: `Transformation applied: ${transformation.filteredRowCount} of ${transformation.originalRowCount} rows`
    });
  }, []);

  const getCurrentData = useCallback(() => {
    return transformedData || data;
  }, [transformedData, data]);

  const resetData = useCallback(() => {
    setData(null);
    setTransformedData(null);
    setCurrentTab(0);
    addNotification({
      type: 'info',
      message: 'Data reset successfully'
    });
  }, []);

  // Notification operations
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 6000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Preference operations
  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  // Tab operations
  const navigateToTab = useCallback((tabIndex) => {
    setCurrentTab(tabIndex);
  }, []);

  const value = {
    // Data state
    data,
    transformedData,
    dataHistory,
    
    // Data operations
    loadData,
    applyTransformation,
    getCurrentData,
    resetData,
    
    // UI state
    currentTab,
    navigateToTab,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    
    // Preferences
    preferences,
    updatePreference
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use the Data Context
 * @returns {Object} Context value
 */
export const useDataContext = () => {
  const context = useContext(DataContext);
  
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  
  return context;
};

export default DataContext;

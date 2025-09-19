// Persistence utility for managing localStorage data
export class PersistenceManager {
  static STORAGE_KEYS = {
    DATA: 'cit_app_data',
    TRANSFORMED_DATA: 'cit_app_transformed_data',
    DASHBOARD_STATE: 'cit_app_dashboard_state',
    CURRENT_TAB: 'cit_app_current_tab',
    DARK_MODE: 'cit_app_dark_mode',
    AI_INSIGHTS: 'cit_app_ai_insights'
  };

  // Save data to localStorage with compression for large datasets
  static saveData(key, data) {
    try {
      if (!data) {
        localStorage.removeItem(key);
        return;
      }

      // Add timestamp to data
      const dataWithTimestamp = {
        data,
        timestamp: Date.now(),
        version: '1.0'
      };

      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error);
      // If storage is full, try to clear old data and retry
      if (error.name === 'QuotaExceededError') {
        this.clearOldData();
        try {
          localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
          return true;
        } catch (retryError) {
          console.error('Failed to save data even after clearing old data:', retryError);
        }
      }
      return false;
    }
  }

  // Load data from localStorage
  static loadData(key, maxAge = 7 * 24 * 60 * 60 * 1000) { // Default: 7 days
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsedData = JSON.parse(stored);
      
      // Handle legacy data without timestamp
      if (!parsedData.timestamp) {
        return parsedData;
      }

      // Check if data is too old
      const age = Date.now() - parsedData.timestamp;
      if (age > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedData.data;
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error);
      // Remove corrupted data
      localStorage.removeItem(key);
      return null;
    }
  }

  // Clear old data to free up space
  static clearOldData() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    Object.values(this.STORAGE_KEYS).forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsedData = JSON.parse(stored);
          if (parsedData.timestamp && parsedData.timestamp < cutoffTime) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Remove corrupted data
        localStorage.removeItem(key);
      }
    });
  }

  // Get storage usage information
  static getStorageInfo() {
    let totalSize = 0;
    const breakdown = {};

    Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      const size = data ? new Blob([data]).size : 0;
      breakdown[name] = size;
      totalSize += size;
    });

    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      breakdown,
      availableSpace: this.getAvailableSpace()
    };
  }

  // Estimate available localStorage space
  static getAvailableSpace() {
    try {
      const testKey = 'localStorage_test';
      const testData = '0'.repeat(1024); // 1KB
      let size = 0;

      // Test in 1MB increments
      while (size < 10 * 1024) { // Max 10MB test
        try {
          localStorage.setItem(testKey, testData.repeat(size + 1024));
          size += 1024;
        } catch (error) {
          localStorage.removeItem(testKey);
          return size;
        }
      }
      
      localStorage.removeItem(testKey);
      return size;
    } catch (error) {
      return 0;
    }
  }

  // Clear all app data
  static clearAllData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Dashboard-specific methods
  static saveDashboardState(widgets, layout) {
    return this.saveData(this.STORAGE_KEYS.DASHBOARD_STATE, {
      widgets,
      layout,
      lastUpdated: Date.now()
    });
  }

  static loadDashboardState() {
    return this.loadData(this.STORAGE_KEYS.DASHBOARD_STATE);
  }

  // App state methods
  static saveAppState(state) {
    const {
      data,
      transformedData,
      currentTab,
      darkMode,
      dashboardState
    } = state;

    // Save each piece of state separately to avoid size limits
    this.saveData(this.STORAGE_KEYS.DATA, data);
    this.saveData(this.STORAGE_KEYS.TRANSFORMED_DATA, transformedData);
    this.saveData(this.STORAGE_KEYS.CURRENT_TAB, currentTab);
    this.saveData(this.STORAGE_KEYS.DARK_MODE, darkMode);
    
    if (dashboardState) {
      this.saveDashboardState(dashboardState.widgets, dashboardState.layout);
    }
  }

  static loadAppState() {
    return {
      data: this.loadData(this.STORAGE_KEYS.DATA),
      transformedData: this.loadData(this.STORAGE_KEYS.TRANSFORMED_DATA),
      currentTab: this.loadData(this.STORAGE_KEYS.CURRENT_TAB) || 0,
      darkMode: this.loadData(this.STORAGE_KEYS.DARK_MODE) || false,
      dashboardState: this.loadDashboardState()
    };
  }
}

export default PersistenceManager;
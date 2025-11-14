import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing Web Workers
 * Provides easy interface for offloading heavy computations
 */
export const useWorker = (workerPath) => {
  const workerRef = useRef(null);
  const taskCallbacksRef = useRef({});
  const taskIdCounterRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    try {
      workerRef.current = new Worker(workerPath);
      
      // Handle messages from worker
      workerRef.current.onmessage = (e) => {
        const { taskId, success, result, error, type } = e.data;
        
        if (type === 'READY') {
          console.log('Worker ready');
          return;
        }
        
        const callback = taskCallbacksRef.current[taskId];
        if (callback) {
          if (success) {
            callback.resolve(result);
          } else {
            callback.reject(new Error(error));
          }
          delete taskCallbacksRef.current[taskId];
        }
      };
      
      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
    }
    
    // Cleanup
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerPath]);

  // Execute task in worker
  const executeTask = useCallback((type, payload) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }
      
      const taskId = ++taskIdCounterRef.current;
      taskCallbacksRef.current[taskId] = { resolve, reject };
      
      workerRef.current.postMessage({
        type,
        payload,
        taskId
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (taskCallbacksRef.current[taskId]) {
          reject(new Error('Worker task timeout'));
          delete taskCallbacksRef.current[taskId];
        }
      }, 30000);
    });
  }, []);

  return executeTask;
};

// Specific worker hooks for common tasks
export const useDataWorker = () => {
  const executeTask = useWorker('/workers/dataProcessing.worker.js');
  
  return {
    calculateStatistics: useCallback((data, column) => 
      executeTask('CALCULATE_STATISTICS', { data, column }), [executeTask]),
      
    calculateCorrelation: useCallback((data, col1, col2) => 
      executeTask('CALCULATE_CORRELATION', { data, col1, col2 }), [executeTask]),
      
    aggregateData: useCallback((data, groupBy, valueColumn, operation) => 
      executeTask('AGGREGATE_DATA', { data, groupBy, valueColumn, operation }), [executeTask]),
      
    filterData: useCallback((data, filters) => 
      executeTask('FILTER_DATA', { data, filters }), [executeTask]),
      
    linearRegression: useCallback((data, xCol, yCol) => 
      executeTask('LINEAR_REGRESSION', { data, xCol, yCol }), [executeTask]),
      
    detectOutliers: useCallback((data, column) => 
      executeTask('DETECT_OUTLIERS', { data, column }), [executeTask])
  };
};

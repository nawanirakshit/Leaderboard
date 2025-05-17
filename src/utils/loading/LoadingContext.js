import React, { useState, createContext, useContext } from 'react';

const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false, // Add isLoading to the context
});

const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const contextValue = {
    showLoading,
    hideLoading,
    isLoading, // Make isLoading available
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export { LoadingProvider, useLoading };
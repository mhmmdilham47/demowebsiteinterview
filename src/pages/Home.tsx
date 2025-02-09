import React from 'react';
import HomeDashboard from '../components/Home/HomeDashboard';
import { DataProvider } from '../context/UserDataContext';

const Home: React.FC = () => {
  return (
    <DataProvider>
      <HomeDashboard />
    </DataProvider>
    
  );
};

export default Home;


import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import TableMapView from './pages/TableMapView';
import KitchenView from './pages/KitchenView';
import DashboardView from './pages/DashboardView';
import FeedbackView from './pages/FeedbackView';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-900 text-gray-200">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<TableMapView />} />
              <Route path="/kitchen" element={<KitchenView />} />
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/feedback/:tableId" element={<FeedbackView />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;

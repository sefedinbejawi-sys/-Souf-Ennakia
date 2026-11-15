/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ReportView } from './views/ReportView';
import { LeaderboardView } from './views/LeaderboardView';
import { AdminDashboardView } from './views/AdminDashboardView';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-['Cairo']" dir="rtl">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1">
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
        {currentView === 'report' && <ReportView setCurrentView={setCurrentView} />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      <Footer />
    </div>
  );
}


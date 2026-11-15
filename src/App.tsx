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

type View = 'home' | 'report' | 'leaderboard' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const navigate = (view: string) => {
    if (['home', 'report', 'leaderboard', 'admin'].includes(view)) setCurrentView(view as View);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf9] text-slate-800 font-['Cairo']" dir="rtl">
      <Navbar currentView={currentView} setCurrentView={navigate} />
      
      <main className="flex-1">
        {currentView === 'home' && <HomeView setCurrentView={navigate} />}
        {currentView === 'report' && <ReportView setCurrentView={navigate} />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      <Footer />
    </div>
  );
}

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import { SubscriptionProvider } from '@/features/subscription/SubscriptionContext'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AgentsPage from '@/pages/AgentsPage'
import AgentChatPage from '@/pages/AgentChatPage'
import HistoryPage from '@/pages/HistoryPage'
import SavedPage from '@/pages/SavedPage'
import SettingsPage from '@/pages/SettingsPage'
import PlansPage from '@/pages/PlansPage'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/:slug" element={<AgentChatPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App

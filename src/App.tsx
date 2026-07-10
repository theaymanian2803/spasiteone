import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Index from './pages/Index'
import BookingPage from './pages/BookingPage'
import ContactUs from './pages/ContactUs'
import MyAppointments from './pages/MyAppointments'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminClients from './pages/admin/AdminClients'
import AdminServices from './pages/admin/AdminServices'
import AdminSettings from './pages/admin/AdminSettings'
import AdminContent from './pages/admin/AdminContent'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => {
  useEffect(() => {
    // Auto-create schema and seed on first visit
    import("./db/init").then((m) => m.initDatabase());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

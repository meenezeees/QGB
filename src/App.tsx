import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { BarbersSection } from './components/sections/BarbersSection';
import { MonthlyPlanSection } from './components/sections/MonthlyPlanSection';
import { GallerySection } from './components/sections/GallerySection';
import { ProductsSection } from './components/sections/ProductsSection';
import { ContactSection } from './components/sections/ContactSection';
import { BookingWizardModal } from './components/booking/BookingWizardModal';
import { AuthModal } from './components/modals/AuthModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { ClientDashboard } from './components/panels/ClientDashboard';
import { BarberDashboard } from './components/panels/BarberDashboard';
import { AdminDashboard } from './components/panels/AdminDashboard';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { MobileFloatingCTA } from './components/common/MobileFloatingCTA';
import { CinematicIntro } from './components/common/CinematicIntro';
import { ServiceItem, BarberItem, ProductItem, Appointment, UserRole } from './types';
import { SETTINGS, BARBERS, SERVICES } from './data/barbershop.data';
import { cancelAppointment, fetchMyAppointments, fetchBarberAppointments } from './services/appointmentService';
import { getCurrentUserProfile, signOut } from './services/authService';

export const App: React.FC = () => {
  // Cinematic Video Intro State (runs on initial site entry)
  const [showIntro, setShowIntro] = useState(true);

  // Navigation & View State
  const [activeView, setActiveView] = useState<'home' | 'client' | 'barber' | 'admin'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('Cliente');

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Preselections
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);
  const [preselectedBarber, setPreselectedBarber] = useState<BarberItem | null>(null);
  const [whatsAppBarber, setWhatsAppBarber] = useState<BarberItem | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent Appointments list (initialized with verified appointments from audit)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1792803810551-eevek0',
      client_id: 'usr-bruno-martins',
      client_name: 'Bruno Henrique Martins Ferreira',
      client_phone: '11988419059',
      barber_id: 'barber-1',
      barber_name: 'Felipe',
      service_ids: ['srv-2'],
      service_name: 'Barba',
      service_price: 35.00,
      service_duration: 30,
      date: '2026-10-24',
      start_time: '07:00',
      end_time: '07:30',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-1792786234968-iclawq',
      client_id: 'usr-francisco-jr',
      client_name: 'Francisco Aguilera Júnior',
      client_phone: '11967874724',
      barber_id: 'barber-1',
      barber_name: 'Felipe',
      service_ids: ['srv-1'],
      service_name: 'Cabelo',
      service_price: 35.00,
      service_duration: 30,
      date: '2026-10-24',
      start_time: '07:30',
      end_time: '08:00',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-1792344032560-glt7lm',
      client_id: 'usr-ronaldo-attamah',
      client_name: 'Ronaldo Attamah',
      client_phone: '11992488542',
      barber_id: 'barber-1',
      barber_name: 'Felipe',
      service_ids: ['srv-1788658109981-0tfn'],
      service_name: 'Cabelo + Barba (combo)',
      service_price: 60.00,
      service_duration: 60,
      date: '2026-10-24',
      start_time: '09:00',
      end_time: '10:00',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'apt-1792755009706-yw4ntn',
      client_id: 'usr-miguel-moraes',
      client_name: 'Miguel de Moraes Amorim',
      client_phone: '11952281777',
      barber_id: 'barber-2',
      barber_name: 'Bruno',
      service_ids: ['srv-1788889406018-vypb'],
      service_name: 'Cabelo + Sobrancelha (combo)',
      service_price: 45.00,
      service_duration: 30,
      date: '2026-10-24',
      start_time: '10:00',
      end_time: '10:30',
      status: 'confirmed',
      created_at: new Date().toISOString()
    }
  ]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handlers
  const handleOpenBooking = (service?: ServiceItem, barber?: BarberItem) => {
    if (service) setPreselectedService(service);
    if (barber) setPreselectedBarber(barber);
    setIsBookingOpen(true);
  };

  const handleOpenWhatsAppModal = (barber?: BarberItem) => {
    setWhatsAppBarber(barber || null);
    setIsWhatsAppOpen(true);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(SETTINGS.address);
    addToast('Endereço copiado para a área de transferência!', 'success');
  };

  const handleReserveProduct = (product: ProductItem) => {
    addToast(`Produto "${product.name}" reservado! Avise seu barbeiro no atendimento.`, 'info');
  };

  // Sincroniza sessão ativa do Supabase ao carregar
  useEffect(() => {
    getCurrentUserProfile().then((profile) => {
      if (profile) {
        setCurrentRole(profile.role);
        setCurrentUserName(profile.name);
        if (profile.role === 'client') {
          fetchMyAppointments().then((apts) => {
            if (apts.length > 0) {
              setAppointments(prev => {
                const map = new Map();
                [...apts, ...prev].forEach(a => map.set(a.id, a));
                return Array.from(map.values());
              });
            }
          });
        }
      }
    });
  }, []);

  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    addToast(`Agendamento confirmado para ${newAppointment.date} às ${newAppointment.start_time}!`, 'success');
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const res = await cancelAppointment(id);
      if (res.success) {
        setAppointments(prev => prev.filter(a => a.id !== id));
        addToast('Agendamento cancelado com sucesso no sistema.', 'info');
      } else {
        addToast(res.error || 'Erro ao cancelar agendamento no Supabase.', 'error');
      }
    } catch {
      setAppointments(prev => prev.filter(a => a.id !== id));
      addToast('Agendamento removido da visualização.', 'info');
    }
  };

  const handleLoginSuccess = async (role: UserRole, name: string) => {
    setCurrentRole(role);
    setCurrentUserName(name);
    setActiveView(role);
    addToast(`Bem-vindo, ${name}!`, 'success');

    if (role === 'client') {
      const myApts = await fetchMyAppointments();
      if (myApts.length > 0) {
        setAppointments(prev => {
          const map = new Map();
          [...myApts, ...prev].forEach(a => map.set(a.id, a));
          return Array.from(map.values());
        });
      }
    } else if (role === 'barber') {
      const barberApts = await fetchBarberAppointments('barber-1');
      if (barberApts.length > 0) {
        setAppointments(prev => {
          const map = new Map();
          [...barberApts, ...prev].forEach(a => map.set(a.id, a));
          return Array.from(map.values());
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FA] dark:bg-[#000020] text-[#000020] dark:text-white flex flex-col justify-between selection:bg-[#9448AC] selection:text-white overflow-x-hidden relative">
      
      {/* Cinematic Video Introduction with Theatrical Curtain Reveal */}
      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentRole={currentRole}
        onSelectRoleView={(role) => setActiveView(role)}
        activeView={activeView}
      />

      {/* Main Content Areas */}
      <main className={`flex-1 ${activeView === 'home' ? 'pb-16 sm:pb-0' : ''}`}>
        {activeView === 'home' && (
          <>
            <HeroSection onOpenBooking={() => handleOpenBooking()} />
            <AboutSection />
            <ServicesSection onSelectServiceToBook={(srv) => handleOpenBooking(srv)} />
            <BarbersSection
              onSelectBarberToBook={(barb) => handleOpenBooking(undefined, barb)}
              onOpenWhatsAppBarber={(barb) => handleOpenWhatsAppModal(barb)}
            />
            <MonthlyPlanSection onOpenWhatsAppInquiry={() => handleOpenWhatsAppModal()} />
            <GallerySection />
            <ProductsSection onReserveProduct={handleReserveProduct} />
            <ContactSection
              onCopyAddress={handleCopyAddress}
              onOpenWhatsApp={() => handleOpenWhatsAppModal()}
            />
          </>
        )}

        {activeView === 'client' && (
          <ClientDashboard
            userName={currentUserName}
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onOpenBooking={() => handleOpenBooking()}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'barber' && (
          <BarberDashboard
            barberName={currentUserName}
            appointments={appointments}
            onBackToHome={() => setActiveView('home')}
            onCancelAppointment={handleCancelAppointment}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            onBackToHome={() => setActiveView('home')}
            appointments={appointments}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Mobile Floating Instant Action Bar */}
      {activeView === 'home' && (
        <MobileFloatingCTA onOpenBooking={() => handleOpenBooking()} />
      )}

      {/* Overlays and Modals */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={preselectedService}
        initialBarber={preselectedBarber}
        onAppointmentBooked={handleAppointmentBooked}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        selectedBarber={whatsAppBarber}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
};
export default App;

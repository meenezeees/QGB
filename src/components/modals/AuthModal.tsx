import React, { useState } from 'react';
import { User, Lock, Mail, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types';
import { signIn, signUp } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError('Por favor, preencha seu login e senha.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(identifier, password);
      if (res.success && res.role) {
        onLoginSuccess(res.role, res.userName || 'Usuário');
        onClose();
      } else {
        setError(res.error || 'Credenciais inválidas. Verifique os dados informados.');
      }
    } catch (err: any) {
      setError(err?.message || 'Falha ao conectar com o serviço de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!consent) {
      setError('É necessário aceitar os termos de consentimento para prosseguir.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(name, email, password, phone, consent);
      if (res.success && res.role) {
        onLoginSuccess(res.role, res.userName || name.trim());
        onClose();
      } else {
        setError(res.error || 'Não foi possível concluir o cadastro.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'login' ? 'Acessar Conta' : 'Criar Nova Conta'}
      subtitle="Acesse para gerenciar seus agendamentos e histórico"
      maxWidth="md"
    >
      <div id="auth-modal" className="space-y-5">
        
        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-[#480355] text-[#000020] dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-[#480355] text-[#000020] dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div id="auth-error-banner" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form id="login-form" onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                E-mail ou Telefone / WhatsApp
              </label>
              <div className="relative">
                <input
                  id="login-identifier-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="seuemail@exemplo.com ou telefone"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs sm:text-sm font-medium focus:border-[#9448AC] outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#000020] dark:text-white">
                  Senha
                </label>
                <button
                  type="button"
                  id="btn-forgot-password-link"
                  onClick={() => alert('Para redefinir sua senha, solicite suporte pelo WhatsApp ou verifique seu e-mail cadastrado.')}
                  className="text-[11px] text-[#9448AC] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs sm:text-sm font-medium focus:border-[#9448AC] outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white font-bold text-xs uppercase tracking-wider shadow-brand cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar na Conta</span>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form id="register-form" onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                Nome Completo *
              </label>
              <input
                id="reg-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs font-medium focus:border-[#9448AC] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  id="reg-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs font-medium focus:border-[#9448AC] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                  E-mail *
                </label>
                <input
                  id="reg-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs font-medium focus:border-[#9448AC] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#000020] dark:text-white block mb-1">
                Criar Senha *
              </label>
              <input
                id="reg-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101026] text-xs font-medium focus:border-[#9448AC] outline-none"
              />
            </div>

            {/* Exact LGPD Consent checkbox from audit */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <input
                id="reg-consent-checkbox"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#9448AC] focus:ring-[#9448AC] w-4 h-4"
              />
              <span className="text-[11px] text-[#45454C] dark:text-slate-400 leading-tight">
                Concordo com a utilização das informações preenchidas (nome, número e e-mail) para criação da conta e realização de agendamentos. *
              </span>
            </label>

            <button
              type="submit"
              id="btn-register-submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#480355] to-[#9448AC] hover:from-[#3a0245] hover:to-[#843c9c] text-white font-bold text-xs uppercase tracking-wider shadow-brand cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando Conta...</span>
                </>
              ) : (
                <span>Criar Conta e Entrar</span>
              )}
            </button>
          </form>
        )}

      </div>
    </Modal>
  );
};

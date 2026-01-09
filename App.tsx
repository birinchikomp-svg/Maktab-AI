
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, Teacher } from './types';
import { translations, Language } from './translations';
import { userService } from './services/userService';
import { storageService } from './services/storageService';
import LoadingScreen from './components/LoadingScreen';
import StudentPanel from './components/StudentPanel';
import TeacherPanel from './components/TeacherPanel';
import AdminPanel from './components/AdminPanel';

userService.init();
storageService.init();

const CLASSES = [];
for (let i = 5; i <= 11; i++) {
  ['A', 'B', 'V'].forEach(letter => CLASSES.push(`${i}-${letter}`));
}

export const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof translations['uz']) => string;
}>({
  lang: 'uz',
  setLang: () => {},
  t: (k) => k
});

export const UserContext = createContext<{
  user: User | null;
  setUser: (u: User | null) => void;
}>({
  user: null,
  setUser: () => {}
});

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const { t } = useContext(LanguageContext);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = userService.login(login, password);
    if (user) onLogin(user);
    else setError(t('error_login'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="text-center mb-10">
          <img src="https://buxedu.uz/static/images/logo.png" alt="Logo" className="w-32 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 font-poppins">{t('welcome')}</h2>
          <p className="text-slate-400">{t('login_subtitle')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none text-slate-900 font-medium" placeholder={t('username')} value={login} onChange={(e) => setLogin(e.target.value)} />
          <input type="password" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none text-slate-900 font-medium" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            {t('login')}
          </button>
        </form>
        <div className="mt-6 text-center text-slate-500">
          {t('no_account')} <Link to="/register" className="text-blue-600 font-bold hover:underline">{t('register_now')}</Link>
        </div>
      </div>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [formData, setFormData] = useState({ fullName: '', login: '', password: '', subject: '', className: '5-A' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const isRegistered = userService.register({ ...formData, role });
    if (isRegistered) { setSuccess(true); setTimeout(() => navigate('/login'), 2000); }
    else setError("Bu login band!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">{t('register')}</h2>
        {success ? (
          <div className="text-center py-10 text-green-600 font-bold">{t('success_reg')}</div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl mb-4">
              <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-2 rounded-xl font-bold ${role === UserRole.STUDENT ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>{t('student')}</button>
              <button type="button" onClick={() => setRole(UserRole.TEACHER)} className={`py-2 rounded-xl font-bold ${role === UserRole.TEACHER ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>{t('teacher')}</button>
            </div>
            <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900" placeholder={t('full_name')} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900" placeholder={t('username')} value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})} />
            <input type="password" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900" placeholder={t('password')} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            {role === UserRole.TEACHER ? (
              <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900" placeholder={t('subject')} value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
            ) : (
              <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})}>
                {CLASSES.map(c => <option key={c} value={c}>{c} sinf</option>)}
              </select>
            )}
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl hover:bg-emerald-700 transition-all">
              {t('register')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://buxedu.uz/static/images/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-slate-800 font-poppins">Maktab AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['uz', 'ru', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l as Language)} className={`px-2 py-1 rounded-lg text-xs font-bold ${lang === l ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {user && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4">
                {user.role === UserRole.STUDENT && <Link to="/student" className={`font-bold transition-colors ${location.pathname === '/student' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-400'}`}>{t('my_panel')}</Link>}
                {user.role === UserRole.TEACHER && <Link to="/teacher" className={`font-bold transition-colors ${location.pathname === '/teacher' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-400'}`}>{t('tasks')}</Link>}
                {user.role === UserRole.ADMIN && <Link to="/admin" className={`font-bold transition-colors ${location.pathname === '/admin' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-400'}`}>{t('admin_panel')}</Link>}
              </div>
              <button onClick={() => { onLogout(); navigate('/login'); }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('uz');

  const t = (key: keyof typeof translations['uz']) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <UserContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
        <Router>
          {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
          {!loading && (
            <div className="min-h-screen flex flex-col">
              <Navbar user={currentUser} onLogout={() => setCurrentUser(null)} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage onLogin={setCurrentUser} />} />
                  <Route path="/register" element={currentUser ? <Navigate to="/" /> : <RegisterPage />} />
                  <Route path="/" element={
                    currentUser ? (
                      currentUser.role === UserRole.STUDENT ? <Navigate to="/student" /> :
                      currentUser.role === UserRole.TEACHER ? <Navigate to="/teacher" /> :
                      <Navigate to="/admin" />
                    ) : <Navigate to="/login" />
                  } />
                  <Route path="/student" element={currentUser?.role === UserRole.STUDENT ? <StudentPanel /> : <Navigate to="/" />} />
                  <Route path="/teacher" element={currentUser?.role === UserRole.TEACHER ? <TeacherPanel /> : <Navigate to="/" />} />
                  <Route path="/admin" element={currentUser?.role === UserRole.ADMIN ? <AdminPanel /> : <Navigate to="/" />} />
                </Routes>
              </main>
              <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center">
                 <p className="text-slate-900 text-xs font-black uppercase tracking-widest">{t('footer_text')}</p>
              </footer>
            </div>
          )}
        </Router>
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;

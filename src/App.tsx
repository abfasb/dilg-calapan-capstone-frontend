import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/authentication/RegistrationPage';
import LoginPage from './pages/authentication/LoginPage';
import NotFoundPage from './pages/404/NotFoundPage';
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage';
import SubForgotPasswordPage from './pages/authentication/SubForgotPasswordPage';
import LguMainDashboardPage from './pages/lgus/LguMainDashboardPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';

function App() {
  return (
      <Router>
        <Routes>

        <Route path='/' element={ <LandingPage />}/>

         { /* Authentication*/ }
         <Route path='/account/register' element={ <RegistrationPage />}/>
         <Route path='/account/login' element={ <LoginPage />}/>

         { /* Forgot Password*/ }
         <Route path='/account/forgot-password/:token' element={ <ForgotPasswordPage />}/>
         <Route path='/account/forgot-password/' element={ <SubForgotPasswordPage />}/>

         { /* Forgot Password*/ }
          <Route path='/account/eGov-lgu' element={<LguMainDashboardPage />} />
        <Route path='*' element={ <NotFoundPage />}/>

        { /* Admin*/ }
        <Route path='/account/admin' element={<AdminPanelPage />} />
        </Routes>
      </Router>
  );
}

export default App
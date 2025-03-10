import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/authentication/RegistrationPage';
import LoginPage from './pages/authentication/LoginPage';
import NotFoundPage from './pages/404/NotFoundPage';
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage';
import SubForgotPasswordPage from './pages/authentication/SubForgotPasswordPage';
import LguMainDashboardPage from './pages/lgus/LguMainDashboardPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import LGURegistrationPage from './pages/lgus/LGURegistrationPage';
import CitizenPage from './pages/citizen/CitizenPage';
import ReportFormPage from './pages/citizen/ReportFormPage';
import SubmissionSuccessPage from './pages/citizen/SubmissionSuccessPage';
import MyReportPage from './pages/citizen/MyReportPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';

function App() {
  return (
      <Router>
        <Routes>

        <Route path='/' element={ <LandingPage />}/>
        <Route path='/blogs' element={ <BlogListPage />}/>
        <Route path='/blogs/:id' element={ <BlogDetailPage />}/>

         { /* Authentication*/ }
         <Route path='/account/register' element={ <RegistrationPage />}/>
         <Route path='/account/login' element={ <LoginPage />}/>
         <Route path='/account/lgu/register' element={ <LGURegistrationPage />}/>

         { /* Forgot Password*/ }
         <Route path='/account/forgot-password/:token' element={ <ForgotPasswordPage />}/>
         <Route path='/account/forgot-password/' element={ <SubForgotPasswordPage />}/>

         { /* LGU*/ }
          <Route path='/account/lgu/:id' element={<LguMainDashboardPage />} />


        { /* Admin*/ }
        <Route path='/account/admin/:id' element={<AdminPanelPage />} />

        { /* Citizen*/ }
        <Route path='/account/citizen/:id' element={<CitizenPage />}/>
        <Route path="/report/:id" element={<ReportFormPage />} />
        <Route path='/account/citizen/submission/success/:userId' element={<SubmissionSuccessPage />} />
        <Route path='/account/citizen/my-report/:userId' element={<MyReportPage />} />


        <Route path='*' element={ <NotFoundPage />}/>
        
        </Routes>
      </Router>
  );
}

export default App
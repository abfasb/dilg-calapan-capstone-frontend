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
import MeetTheTeamPage from './pages/MeetTheTeamPage';
import Layout from './layouts/Layout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHomePage from './pages/lgus/DashboardHomePage';
import ReportsPage from './pages/lgus/ReportsPage';
import StaffPage from './pages/lgus/StaffPage';
import SettingsPage from './pages/lgus/SettingsPage';
import AnnouncementPage from './pages/lgus/AnnouncementPage';
import AppointmentPage from './pages/lgus/AppointmentPage';
import EditReportPage from './pages/citizen/EditReportPage';

function App() {
  return (
      <Router>
        <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="blogs" element={<BlogListPage />} />
          <Route path="blogs/:id" element={<BlogDetailPage />} />
          <Route path="meet-the-team" element={<MeetTheTeamPage />} />
        </Route>

         { /* Authentication*/ }
         <Route path='/account/register' element={ <RegistrationPage />}/>
         <Route path='/account/login' element={ <LoginPage />}/>
         <Route path='/account/lgu/register' element={ <LGURegistrationPage />}/>

         { /* Forgot Password*/ }
         <Route path='/account/forgot-password/:token' element={ <ForgotPasswordPage />}/>
         <Route path='/account/forgot-password/' element={ <SubForgotPasswordPage />}/>

         { /* LGU*/ }
         <Route path="/account/lgu/:id" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="announcements" element={<AnnouncementPage />} />
            <Route path='appointments' element={<AppointmentPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>


        { /* Admin*/ }
        <Route path='/account/admin/:id' element={<AdminPanelPage />} />

        { /* Citizen*/ }
        <Route path='/account/citizen/:id' element={<CitizenPage />}/>
        <Route path="/report/:id" element={<ReportFormPage />} />
        <Route path='/account/citizen/submission/success/:userId' element={<SubmissionSuccessPage />} />
        <Route path='/account/citizen/submission/:reportId' element={<SubmissionSuccessPage />} />
        <Route path='/account/citizen/my-report/:userId' element={<MyReportPage />} />
        <Route path='/account/citizen/my-report/edit/:id' element={<EditReportPage />} />


        <Route path='*' element={ <NotFoundPage />}/>
        
        </Routes>
      </Router>
  );
}

export default App
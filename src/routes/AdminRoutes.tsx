import { Routes, Route } from 'react-router-dom';
import Dashboard from "../components/admin/Dashboard";
import RBACManagement from "../components/admin/access-control/RBACManagement";
import SessionPolicies from "../components/admin/access-control/SessionPolicies";
import { AuditLogs } from '../components/admin/access-control/AuditLogs';
import CitizenRegistration from "../components/admin/citizen-management/CitizenRegistration";
import StaffOnboarding from "../components/admin/citizen-management/StaffOnboarding";
import ReportOversight from "../components/admin/citizen-management/ReportOversight";
import VerificationSystem from "../components/admin/citizen-management/VerificationSystem";
import AddReports from "../components/admin/analytics/AddReports";
import CustomReports from "../components/admin/analytics/CustomReports";
import ResolutionAnalytics from "../components/admin/analytics/ResolutionAnalytics";
import AISummaryReports from "../components/admin/analytics/AISummaryReports";
import WorkflowAutomation from "../components/admin/system-health/WorkflowAutomation";
import PerformanceMetrics from "../components/admin/system-health/PerformanceMetrics";
import BackupManagement from "../components/admin/system-health/BackupManagement";
import SystemAnnouncements from "../components/admin/communications/SystemAnnouncements";
import PublicNotices from "../components/admin/communications/PublicNotices";
import AlertHistory from "../components/admin/communications/AlertHistory";
import { Navigate } from 'react-router-dom';
import DocumentTracker from '../components/admin/analytics/DocumentTracker';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="access-control">
        <Route path="rbac" element={<RBACManagement />} />
        <Route path="session-policies" element={<SessionPolicies />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>
      <Route path="citizen-management">
        <Route path="registration" element={<CitizenRegistration />} />
        <Route path="staff-onboarding" element={<StaffOnboarding />} />
        <Route path="report-oversight" element={<ReportOversight />} />
        <Route path="verification" element={<VerificationSystem />} />
      </Route>
      <Route path="analytics">
        <Route path="add-reports" element={<AddReports />} />
        <Route path="custom-reports" element={<CustomReports />} />
        <Route path="resolution" element={<ResolutionAnalytics />} />
        <Route path="ai-reports" element={<AISummaryReports />} />
        <Route path="document-tracker" element={<DocumentTracker />} />
      </Route>
      <Route path="system-health">
        <Route path="workflows" element={<WorkflowAutomation />} />
        <Route path="performance" element={<PerformanceMetrics />} />
        <Route path="backups" element={<BackupManagement />} />
      </Route>
      <Route path="communications">
        <Route path="announcements" element={<SystemAnnouncements />} />
        <Route path="public-notices" element={<PublicNotices />} />
        <Route path="alert-history" element={<AlertHistory />} />
      </Route>
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};
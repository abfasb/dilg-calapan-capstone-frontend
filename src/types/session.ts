export interface Session {
    _id: string;
    device: string;
    location: string;
    ip: string;
    lastActivity: Date;
    status: 'active' | 'expired';
    userAgent: string;
  }
  
  export interface PolicySettings {
    sessionTimeout: number;
    maxLoginAttempts: number;
    inactivityLockout: number;
    ipMonitoring: boolean;
    concurrentSessions: boolean;
    securityAlerts: boolean;
  }
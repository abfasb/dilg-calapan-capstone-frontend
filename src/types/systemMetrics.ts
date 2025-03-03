export interface SystemMetrics {
    cpu: {
      utilization: string;
      load1: string;
      load5: string;
      load15: string;
    };
    memoryUsage: {
      percentage: number;
      total: number;
      used: number;
    };
    mongoStorage: {
      used: number;
      total: number;
      percentage: number;
      collections: number;
      indexes: number;
    };
    connections: {
      current: number;
      available: number;
      active: number;
    };
    uptime: number;
    os: {
      platform: string;
      version: string;
    };
    timestamp: Date;
  }
  
  export interface HistoricalDataPoint extends Omit<SystemMetrics, 'uptime'> {
    uptime: number;
  }
  
  export interface Alert {
    id: string;
    type: 'CPU' | 'MEMORY' | 'STORAGE' | 'CONNECTION';
    message: string;
    level: 'warning' | 'critical';
    timestamp: Date;
    acknowledged: boolean;
  }
  
  export interface SystemHealth {
    cpu: number;
    memory: number;
    storage: number;
  }
  
  export interface PerformanceHistory {
    timestamp: Date;
    cpu: number;
    memory: number;
    connections: number;
  }
  
  export interface StorageAnalysis {
    used: number;
    total: number;
    collections: number;
    indexes: number;
  }
  
  export interface SystemHealthStatus {
    overallStatus: 'healthy' | 'degraded' | 'critical';
    components: {
      database: ComponentStatus;
      memory: ComponentStatus;
      cpu: ComponentStatus;
      storage: ComponentStatus;
    };
  }
  
  interface ComponentStatus {
    status: 'operational' | 'degraded' | 'outage';
    message?: string;
  }
export interface SystemConfig {
  sla: {
    responseTime: number;
    responseUnit: 'minutes' | 'hours';
    completionTime: number;
    completionUnit: 'minutes' | 'hours';
  };
  notifications: {
    enabled: boolean;
    email: {
      enabled: boolean;
      smtpHost: string;
      smtpPort: number;
      smtpUser: string;
      smtpPassword: string;
      fromEmail: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
      apiSecret: string;
    };
    zalo: {
      enabled: boolean;
      oaId: string;
      appId: string;
      appSecret: string;
    };
  };
  ui: {
    systemName: string;
    theme: 'light' | 'dark' | 'auto';
    logoUrl: string;
  };
}

export interface SystemConfigResponse {
  success: boolean;
  data: SystemConfig;
  message?: string;
}

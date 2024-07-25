export interface ProjectDictionary {
    [key: string]: {
      env: {
        [key: string]: string;
      };
      type: string;
      bindings: {
        [key: string]: {
          scheme: string;
          protocol: string;
          transport: string;
          targetPort?: number;
          external?: boolean;
        };
      },
      path?: string;
      context?: string;
    };
  }
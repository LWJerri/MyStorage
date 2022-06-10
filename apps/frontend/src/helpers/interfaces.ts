export interface Member {
  error: boolean;
  text?: string;
  member: {
    id: string;
    createdAt: Date;
    username: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    endpoint: string;
    showPreview: boolean;
    maxGB: number;
    language: string;
  };
  uploads: {
    size: number;
    count: number;
  };
}

export interface Logout {
  error: boolean;
  text?: string;
}

export interface RegisterOrLogin {
  password: string;
  username: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  admin: string;
  endpoint: string;
}

export interface Error {
  error: boolean;
  text?: string;
}

export interface Response {
  error: boolean;
  uploads: Array<{ id: string; createdAt: Date; size: number; name: string; url: string; key: string }>;
  nextPage: boolean;
}

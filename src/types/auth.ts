export interface RefreshSession {
  userId: string
  tokenHash: string
  createdAt: string;
  lastUsedAt: string;
  userAgent?: string
  ip?:string
}

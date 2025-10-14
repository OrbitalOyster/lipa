import type { RowDataPacket } from 'mysql2/promise'

declare global {
  interface AuthRequest {
    userId: string
    isOrg: boolean
    password: string
    rememberMe: boolean
  }

  interface AuthSQLResult {
    name: string
  }

  interface UserPayload {
    userId: string
    isOrg: boolean
    name: string
    rememberMe: boolean
    exp: number
  }

  interface CheckFilenameQueryResult {
    filenameExists: number
  }

  interface CheckHashQueryResult {
    filename: string | null
    hashExists: number
  }

  interface Org extends RowDataPacket {
    id: string
    ord: string
    name: string
    parent: string | null
  }

  interface APIReport {
    date: string
    org: string
    year: number
    status: string
  }

  type sortableCols = 'date' | 'year'

  interface SaveTemplateRequest {
    key: string
    filename: string
  }
}

declare module 'bun' {
  interface Env {
    COOKIE_NAME: string
    COOKIE_LIFETIME_SEC: number
    COOKIE_SECRET: string
    TOKEN_SECRET: string
    PORT: number
    ALLOWED_ORIGIN: string
  }
}

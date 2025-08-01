import type { RowDataPacket } from 'mysql2/promise'

declare global {
  interface AuthRequest {
    userId: string
    isOrg: boolean
    password: string
    rememberMe: boolean
  }

  interface UserPayload {
    userId?: string | null
    isOrg?: boolean | null
    name: string | null
    rememberMe?: boolean | null
    exp?: number
  }

  interface Org extends RowDataPacket {
    id: string
    ord: string
    name: string
    parent: string | null
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

import type { RowDataPacket } from 'mysql2/promise'

declare global {
  interface AuthRequest {
    username: string
    password: string
  }

  interface UserPayload {
    username?: string | null
    role?: string | null
    sideBarWidth?: number
    exp?: number
  }

  interface User extends RowDataPacket {
    
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

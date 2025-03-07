interface AuthRequest {
  username: string
  password: string
}

interface UserPayload {
  username?: string
  role?: string
  exp: number
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

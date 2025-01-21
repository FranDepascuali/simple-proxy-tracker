export namespace Environment {
  export const PORT = process.env.PORT ?? 3000
  export const PROXY_USERNAME = process.env.PROXY_USERNAME
  export const PROXY_PASSWORD = process.env.PROXY_PASSWORD

  export function validate(): void {
    if (!Environment.PROXY_USERNAME || !Environment.PROXY_PASSWORD) {
      throw new Error('Proxy credentials not set')
    }
  }
}

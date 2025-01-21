import { Request, Response } from 'express'

export namespace Auth {
  export function authenticateProxyRequest(
    req: Request,
    res: Response,
  ): boolean {
    const proxyAuth = req.headers['proxy-authorization']
    if (!proxyAuth) {
      res.setHeader(
        'Proxy-Authenticate',
        'Basic realm="Proxy Authentication Required"',
      )
      res.status(407).send('Proxy Authentication Required')
      return false
    }

    try {
      const [username, password] = Buffer.from(
        proxyAuth.split(' ')[1],
        'base64',
      )
        .toString()
        .split(':')

      if (username === 'username' && password === 'password') {
        return true
      }

      res.setHeader(
        'Proxy-Authenticate',
        'Basic realm="Proxy Authentication Required"',
      )
      res.status(407).send('Invalid proxy credentials')
      return false
    } catch (error) {
      res.setHeader(
        'Proxy-Authenticate',
        'Basic realm="Proxy Authentication Required"',
      )
      res.status(407).send('Malformed proxy credentials')
      return false
    }
  }
}

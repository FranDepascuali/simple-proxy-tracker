import { NextFunction, Request, Response } from 'express'
import { IncomingMessage } from 'http'
import { createProxyMiddleware } from 'http-proxy-middleware'

import { Auth } from './auth-service.js'
import { MetricsService } from './metrics-service.js'

export namespace ProxyService {
  /**
   * Creates the proxy middleware that handles request forwarding and metrics collection
   */
  export function createProxyHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.log('Incoming request URL:', req.url)

    // Authenticate the proxy request
    if (!Auth.authenticateProxyRequest(req, res)) {
      return // Stop here if authentication failed
    }

    // Create and configure the proxy middleware
    return createProxyMiddleware({
      target: req.url,
      changeOrigin: true,
      on: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        proxyRes: (proxyRes: IncomingMessage, req: Request, res: Response) => {
          console.log('Proxy response:', proxyRes.statusCode)

          // Track response data for bandwidth metrics
          proxyRes.on('data', (chunk: Buffer) => {
            console.log('Response data:', chunk.length)
            MetricsService.updateBandwidth(chunk.length)
          })
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        proxyReq: (proxyReq, req: Request, res: Response) => {
          console.log('Proxy request:', req.url)

          // Track site visits and request bandwidth
          MetricsService.siteVisited(req.url)

          req.on('data', (chunk: Buffer) => {
            console.log('Request data:', chunk.length)
            MetricsService.updateBandwidth(chunk.length)
          })
        },
        error: (err: Error, req: Request, res: Response) => {
          console.error('Proxy error:', err)
          res.status(500).setHeader('Content-Type', 'text/plain')
          res.end('Proxy error occurred')
        },
      },
    })(req, res, next)
  }
}

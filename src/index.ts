import { Environment } from '@src/environment.js'
import { MetricsService } from '@src/services/metrics-service.js'
import { ProxyService } from '@src/services/proxy-service.js'
import { ShutdownService } from '@src/services/shutdown-service.js'
import express, { NextFunction, Request, Response } from 'express'

Environment.validate()

const app = express()

app.get('/metrics', (request: Request, response: Response) => {
  response.json(MetricsService.getMetrics())
})

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/metrics') {
    return next()
  }

  return ProxyService.createProxyHandler(req, res, next)
})

ShutdownService.onShutdown(() => {
  console.log('\nShutting down proxy server...')
  MetricsService.printReport()
  process.exit(0)
})

app.listen(Environment.PORT, () => {
  console.log(`Proxy server running on port ${Environment.PORT}`)
})

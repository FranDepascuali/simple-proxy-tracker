# Simple Proxy Tracker  
A lightweight HTTP proxy server that monitors and tracks network traffic while providing basic authentication. Built with Express.js and TypeScript, this proxy server helps you understand network usage patterns by collecting metrics about bandwidth consumption and frequently visited sites.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access proxy metrics at: `http://localhost:3000/metrics`

Default proxy credentials:
- Username: username
- Password: password

## Technical Details
The project is structured using TypeScript namespaces to organize different concerns:
- Authentication handling
- Proxy request forwarding
- Metrics collection and reporting
- Graceful shutdown management

Built using:
- TypeScript
- Express.js
- http-proxy-middleware
- ESM modules

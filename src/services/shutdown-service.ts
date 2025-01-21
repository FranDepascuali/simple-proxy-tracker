export namespace ShutdownService {
  /**
   * Registers all shutdown handlers for the application.
   * This should be called once when the application starts.
   */
  export function onShutdown(callback: () => void): void {
    process.on('SIGTERM', callback)
    process.on('SIGINT', callback)
  }
}

export interface Metrics {
  bandwidth_usage: string
  top_sites: {
    url: string
    visits: number
  }[]
}

export namespace MetricsService {
  let bandwidthUsage = 0
  const siteVisits = new Map<string, number>()

  export function updateBandwidth(bytes: number): void {
    bandwidthUsage += bytes
  }

  export function siteVisited(hostname: string): void {
    const currentVisits = siteVisits.get(hostname) ?? 0
    siteVisits.set(hostname, currentVisits + 1)
  }

  export function getMetrics(): Metrics {
    const topSites = Array.from(siteVisits.entries())
      .map(([url, visits]) => ({ url, visits }))
      .sort((a, b) => b.visits - a.visits)

    // Convert bytes to human-readable format
    let bandwidthString = ''
    if (bandwidthUsage < 1024) {
      bandwidthString = `${bandwidthUsage}B`
    } else if (bandwidthUsage < 1024 * 1024) {
      bandwidthString = `${(bandwidthUsage / 1024).toFixed(2)}KB`
    } else {
      bandwidthString = `${(bandwidthUsage / (1024 * 1024)).toFixed(2)}MB`
    }

    return {
      bandwidth_usage: bandwidthString,
      top_sites: topSites,
    }
  }

  export function printReport(): void {
    console.log('\nFinal Summary:')
    console.log(JSON.stringify(getMetrics(), null, 2))
  }
}

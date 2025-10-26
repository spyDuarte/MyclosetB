import * as Sentry from '@sentry/browser'

const inMemoryMetrics = {
  interactions: 0,
  pageViews: 0
}

export function initializeMonitoring () {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  Sentry.init({
    dsn: dsn || undefined,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0
  })

  window.addEventListener('error', (event) => {
    if (event.error) {
      Sentry.captureException(event.error)
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event.reason)
  })
}

export function recordPageView (path) {
  inMemoryMetrics.pageViews += 1
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Visited ${path}`,
    level: 'info'
  })
  console.info('analytics.page_view', {
    path,
    totalViews: inMemoryMetrics.pageViews
  })
}

export function recordInteraction (name, metadata = {}) {
  inMemoryMetrics.interactions += 1
  Sentry.addBreadcrumb({
    category: 'interaction',
    message: name,
    data: metadata,
    level: 'info'
  })
  const payload = {
    name,
    metadata,
    count: inMemoryMetrics.interactions,
    timestamp: new Date().toISOString()
  }
  console.info('analytics.interaction', payload)

  if (navigator.sendBeacon && import.meta.env.VITE_METRICS_ENDPOINT) {
    const body = JSON.stringify(payload)
    navigator.sendBeacon(import.meta.env.VITE_METRICS_ENDPOINT, body)
  }
}

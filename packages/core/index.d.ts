import type { Emitter } from 'mitt'

export interface MetatagsRule {
  selector: string
  attr?: string
  validator: (opts: { value: string; el: unknown }) => Promise<void>
  status?: 'success' | string
  message?: string
  value?: string
}

export interface MetatagsReport {
  [key: string]: MetatagsRule[]
}

export interface FetchedData {
  html: string
  targetUrl: string
  [key: string]: unknown
}

export interface MetatagsOptions {
  /**
   * Custom emitter instance for listening to events
   * @default mitt()
   */
  emitter?: Emitter<MetatagsEvents>
  /**
   * Number of concurrent requests
   * @default 8
   */
  concurrence?: number
  /**
   * Custom browserless instance
   */
  getBrowserless?: unknown
  /**
   * Additional options passed to html-get
   */
  [key: string]: unknown
}

export interface MetatagsEvents {
  urls: string[]
  fetching: { url: string }
  fetched: FetchedData
  rule: MetatagsRule
  report: MetatagsReport
  end: MetatagsReport
  error: Error
}

/**
 * Validate meta tags across multiple URLs
 * @param urls - Single URL or array of URLs to validate
 * @param options - Configuration options
 * @returns Emitter instance for listening to validation events
 */
export function metatags(
  urls: string | string[],
  options?: MetatagsOptions
): Emitter<MetatagsEvents>

export default metatags

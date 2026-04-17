import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. Try refreshing the page.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }}>Error details</summary>
            <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)' }}>
              {this.state.error?.message}
            </pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

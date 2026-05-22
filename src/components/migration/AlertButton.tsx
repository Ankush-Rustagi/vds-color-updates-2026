import type { ButtonHTMLAttributes, CSSProperties } from 'react'

export type AlertButtonVariant = 'legacy' | 'v2'
export type AlertButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tokenVariant: AlertButtonVariant
  state?: AlertButtonState
}

const stateStyles: Record<AlertButtonVariant, Record<AlertButtonState, CSSProperties>> = {
  legacy: {
    default: { background: 'var(--legacy-button-danger-bg)', color: '#fff' },
    hover: { background: 'var(--legacy-button-danger-hover)', color: '#fff' },
    active: { background: 'var(--legacy-button-danger-hover)', color: '#fff' },
    disabled: { background: 'var(--legacy-button-danger-disabled)', color: '#fff', cursor: 'not-allowed' },
    loading: { background: 'var(--legacy-button-danger-bg)', color: '#fff', opacity: 0.8 },
  },
  v2: {
    default: { background: 'var(--vds-button-background-alert)', color: 'var(--vds-button-text-on-alert)' },
    hover: { background: 'var(--vds-button-background-alert-hover)', color: 'var(--vds-button-text-on-alert)' },
    active: { background: 'var(--vds-button-background-alert-active)', color: 'var(--vds-button-text-on-alert)' },
    disabled: {
      background: 'var(--vds-button-background-alert-disabled)',
      color: 'var(--vds-button-text-on-alert)',
      cursor: 'not-allowed',
    },
    loading: {
      background: 'var(--vds-button-background-alert)',
      color: 'var(--vds-button-text-on-alert)',
      opacity: 0.85,
    },
  },
}

export function AlertButton({ tokenVariant, state = 'default', disabled, style, children = 'Alert', ...rest }: Props) {
  const isDisabled = disabled || state === 'disabled'
  const visualState = state === 'loading' ? 'loading' : state

  return (
    <button
      type="button"
      disabled={isDisabled}
      style={{
        border: 'none',
        borderRadius: 'var(--vds-radius-xxsmall)',
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        minWidth: 100,
        ...stateStyles[tokenVariant][visualState],
        ...style,
      }}
      {...rest}
    >
      {state === 'loading' ? 'Loading…' : children}
    </button>
  )
}

export function AlertButtonRow({
  tokenVariant,
  background = 'canvas',
}: {
  tokenVariant: AlertButtonVariant
  background?: 'canvas' | 'surface-01'
}) {
  const surfaceClass =
    tokenVariant === 'legacy'
      ? background === 'surface-01'
        ? 'legacy-surface legacy-surface--01 legacy-tokens'
        : 'legacy-surface legacy-tokens'
      : background === 'surface-01'
        ? 'vds-surface vds-surface--01'
        : 'vds-surface'

  const states: AlertButtonState[] = ['default', 'hover', 'active', 'disabled', 'loading']

  return (
    <div className={surfaceClass}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {states.map((s) => (
          <div key={s} style={{ textAlign: 'center' }}>
            <AlertButton tokenVariant={tokenVariant} state={s} />
            <div style={{ fontSize: 11, color: 'var(--vds-text-secondary)', marginTop: 6 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

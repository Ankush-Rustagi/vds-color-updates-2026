import type { InputHTMLAttributes } from 'react'

export type CheckboxVariant = 'legacy' | 'v2'
export type CheckboxVisual = 'unselected' | 'selected' | 'mixed' | 'alert'
export type CheckboxState = 'default' | 'hover' | 'active' | 'disabled' | 'focus'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  tokenVariant: CheckboxVariant
  visual?: CheckboxVisual
  state?: CheckboxState
}

function getCheckboxColors(
  tokenVariant: CheckboxVariant,
  visual: CheckboxVisual,
  state: CheckboxState,
): { bg: string; border: string; check: string } {
  if (tokenVariant === 'legacy') {
    if (state === 'disabled') {
      return { bg: 'var(--legacy-checkbox-disabled)', border: 'var(--legacy-checkbox-disabled)', check: '#fff' }
    }
    if (visual === 'alert') {
      return { bg: 'var(--legacy-checkbox-alert)', border: 'var(--legacy-checkbox-alert)', check: '#fff' }
    }
    if (state === 'hover') {
      return { bg: 'var(--legacy-checkbox-hover)', border: 'var(--legacy-checkbox-hover)', check: '#fff' }
    }
    return { bg: 'var(--legacy-checkbox-bg)', border: 'var(--legacy-checkbox-bg)', check: '#fff' }
  }

  if (state === 'disabled') {
    return {
      bg: 'var(--vds-checkbox-disabled-background)',
      border: 'var(--vds-checkbox-disabled-background)',
      check: 'var(--vds-checkbox-checkmark)',
    }
  }
  if (visual === 'alert') {
    const bg =
      state === 'hover'
        ? 'var(--vds-checkbox-alert-background-hover)'
        : 'var(--vds-checkbox-alert-background)'
    return { bg, border: bg, check: 'var(--vds-checkbox-checkmark)' }
  }
  if (state === 'hover') {
    return {
      bg: 'var(--vds-checkbox-default-background-hover)',
      border: 'var(--vds-checkbox-default-border)',
      check: 'var(--vds-checkbox-checkmark)',
    }
  }
  if (state === 'active') {
    return {
      bg: 'var(--vds-checkbox-default-background-active)',
      border: 'var(--vds-checkbox-default-border)',
      check: 'var(--vds-checkbox-checkmark)',
    }
  }
  return {
    bg: visual === 'unselected' ? 'transparent' : 'var(--vds-checkbox-default-background)',
    border: 'var(--vds-checkbox-default-border)',
    check: 'var(--vds-checkbox-checkmark)',
  }
}

function CheckIcon({ visual, color }: { visual: CheckboxVisual; color: string }) {
  if (visual === 'unselected') return null
  if (visual === 'mixed') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
        <rect x="2" y="5" width="8" height="2" fill={color} />
      </svg>
    )
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path d="M2 6l3 3 5-6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Checkbox({
  tokenVariant,
  visual = 'unselected',
  state = 'default',
  disabled,
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || state === 'disabled'
  const colors = getCheckboxColors(tokenVariant, visual, state)
  const focusRing = state === 'focus' ? '0 0 0 2px var(--vds-border-focus)' : 'none'

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: 'var(--vds-radius-xxsmall)',
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: tokenVariant === 'v2' ? focusRing : state === 'focus' ? '0 0 0 2px var(--legacy-focus)' : 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        ...style,
      }}
    >
      <input type="checkbox" disabled={isDisabled} style={{ display: 'none' }} {...rest} />
      <CheckIcon visual={visual} color={colors.check} />
    </label>
  )
}

export function CheckboxMatrix({ tokenVariant }: { tokenVariant: CheckboxVariant }) {
  const surfaceClass =
    tokenVariant === 'legacy'
      ? 'legacy-surface legacy-surface--01 legacy-tokens'
      : 'vds-surface vds-surface--01'

  const visuals: CheckboxVisual[] = ['unselected', 'selected', 'mixed']
  const states: CheckboxState[] = ['default', 'hover', 'active', 'disabled', 'focus']

  return (
    <div className={surfaceClass}>
      <div style={{ display: 'grid', gap: 16 }}>
        {(['default', 'alert'] as const).map((path) => (
          <div key={path}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--vds-text-secondary)' }}>
              {path === 'alert' ? 'Alert path' : 'Default path'}
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {visuals.map((visual) => (
                <div key={visual}>
                  <div style={{ fontSize: 11, marginBottom: 6, color: 'var(--vds-text-secondary)' }}>{visual}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {states.map((state) => (
                      <Checkbox
                        key={state}
                        tokenVariant={tokenVariant}
                        visual={path === 'alert' ? 'alert' : visual}
                        state={state}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

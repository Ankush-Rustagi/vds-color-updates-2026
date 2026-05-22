import type { ProductTeam } from '../../content/teams'
import { AlertButton } from './AlertButton'
import { Checkbox } from './Checkbox'

type Props = {
  team: ProductTeam
}

function StatusPill({ status }: { status: ProductTeam['status'] }) {
  const cls =
    status === 'example-ready'
      ? 'status-pill status-pill--ready'
      : status === 'in-progress'
        ? 'status-pill status-pill--progress'
        : 'status-pill status-pill--pending'
  const label =
    status === 'example-ready' ? 'Example ready' : status === 'in-progress' ? 'In progress' : 'Not started'
  return <span className={cls}>{label}</span>
}

export function TeamMigrationCard({ team }: Props) {
  return (
    <div className="team-card">
      <div className="team-card__header">
        <strong>{team.name}</strong>
        <StatusPill status={team.status} />
      </div>
      <p style={{ margin: '0 0 8px', color: 'var(--vds-text-secondary)', fontSize: 13 }}>{team.surface}</p>
      <p style={{ margin: '0 0 12px', fontSize: 13 }}>
        <strong>Example:</strong> {team.example}
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 13 }}>
        <code>{team.mapping.legacy}</code> → <code>{team.mapping.v2}</code>
      </p>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--vds-text-secondary)' }}>
        Design: {team.designOwner} · Eng: {team.engOwner}
      </p>
    </div>
  )
}

export function TeamSurfacePreview({ team }: Props) {
  return (
    <BeforeAfterPanels team={team} />
  )
}

function BeforeAfterPanels({ team }: Props) {
  return (
    <div className="before-after">
      <div className="before-after__panel">
        <div className="before-after__label">Legacy</div>
        <div className="before-after__content legacy-tokens legacy-surface legacy-surface--01">
          <TeamSurfaceMock team={team} variant="legacy" />
        </div>
      </div>
      <div className="before-after__panel">
        <div className="before-after__label">Color v2</div>
        <div className="before-after__content vds-surface vds-surface--01">
          <TeamSurfaceMock team={team} variant="v2" />
        </div>
      </div>
    </div>
  )
}

function TeamSurfaceMock({ team, variant }: { team: ProductTeam; variant: 'legacy' | 'v2' }) {
  const tokenVariant = variant

  return (
    <div style={{ maxWidth: 320 }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: 'var(--vds-text-emphasis)' }}>
        {team.name} surface preview
      </div>
      <p style={{ fontSize: 13, margin: '0 0 16px', color: 'var(--vds-text-secondary)' }}>{team.example}</p>

      {team.id === 'access-control' && (
        <AlertButton tokenVariant={tokenVariant}>Force unlock</AlertButton>
      )}

      {team.id === 'guest' && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <Checkbox tokenVariant={tokenVariant} visual="selected" />
          I agree to visitor terms
        </label>
      )}

      {team.id === 'command-analytics' && (
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {['#0285C8', '#FF8A3D', '#14BA74', '#CB2939'].map((c) => (
              <div key={c} style={{ width: 24, height: 24, borderRadius: 3, background: c }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--vds-text-secondary)' }}>Chart series palette</div>
        </div>
      )}

      {team.id === 'maps' && (
        <div
          style={{
            height: 80,
            borderRadius: 4,
            background: variant === 'legacy' ? 'var(--legacy-bg-surface)' : 'var(--vds-background-surface-01)',
            border: '1px solid var(--vds-text-disabled)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: 'var(--vds-text-secondary)',
          }}
        >
          Map sidebar panel
        </div>
      )}

      {team.id === 'alarms' && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 4,
            background: variant === 'legacy' ? 'var(--legacy-bg-alert)' : 'var(--vds-background-alert)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Zone 3 triggered
        </div>
      )}

      {team.id === 'intercom' && (
        <AlertButton tokenVariant={tokenVariant} style={{ background: variant === 'legacy' ? 'var(--legacy-button-primary-bg)' : 'var(--vds-button-background-primary)' }}>
          Release door
        </AlertButton>
      )}

      {team.id === 'sensors' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: variant === 'legacy' ? 'var(--legacy-warning)' : 'var(--vds-support-warning)',
            }}
          />
          <span style={{ fontSize: 13 }}>CO2 threshold exceeded</span>
        </div>
      )}

      {team.id === 'video-security' && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 999,
            background: variant === 'legacy' ? '#eee' : 'var(--vds-background-surface-01)',
            color: variant === 'legacy' ? 'var(--legacy-text-secondary)' : 'var(--vds-text-secondary)',
          }}
        >
          Offline
        </span>
      )}

      {!['access-control', 'guest', 'command-analytics', 'maps', 'alarms', 'intercom', 'sensors', 'video-security'].includes(team.id) && (
        <p style={{ fontSize: 13, color: 'var(--vds-text-secondary)' }}>{team.surface}</p>
      )}

      <div style={{ marginTop: 16, fontSize: 11, color: 'var(--vds-text-tertiary)' }}>
        <code>{team.mapping.legacy}</code> → <code>{team.mapping.v2}</code>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

type Props = {
  beforeLabel?: string
  afterLabel?: string
  before: ReactNode
  after: ReactNode
}

export function BeforeAfter({
  beforeLabel = 'Legacy tokens',
  afterLabel = 'Color v2 tokens',
  before,
  after,
}: Props) {
  return (
    <div className="before-after">
      <div className="before-after__panel">
        <div className="before-after__label">{beforeLabel}</div>
        <div className="before-after__content">{before}</div>
      </div>
      <div className="before-after__panel">
        <div className="before-after__label">{afterLabel}</div>
        <div className="before-after__content">{after}</div>
      </div>
    </div>
  )
}

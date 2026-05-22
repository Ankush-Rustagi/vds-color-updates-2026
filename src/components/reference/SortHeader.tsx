import type { SortDirection } from './sort-utils'

type Props = {
  label: string
  column: string
  activeColumn: string | null
  direction: SortDirection
  onSort: (column: string) => void
  className?: string
}

export function SortHeader({ label, column, activeColumn, direction, onSort, className }: Props) {
  const active = activeColumn === column
  return (
    <button
      type="button"
      className={`vds-sort-header${active ? ' vds-sort-header--active' : ''}${className ? ` ${className}` : ''}`}
      onClick={() => onSort(column)}
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span>{label}</span>
      <span className="vds-sort-header__icon" aria-hidden>
        {active ? (direction === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  )
}

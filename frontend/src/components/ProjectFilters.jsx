import { STATUSES } from '../lib/api'

export default function ProjectFilters({ filters, setFilters }) {
  return <div className="filters" aria-label="Project filters"><input value={filters.domain} onChange={(event) => setFilters({ ...filters, domain: event.target.value })} placeholder="Filter by domain" /><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} aria-label="Filter by status"><option value="">Every stage</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
}

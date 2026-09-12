import ProjectList from './ProjectList'
import ProjectFilters from './ProjectFilters'

export default function Overview({ projects, ownProjects, filters, setFilters, onSelect }) {
  return <>
    <section className="page-heading"><div><p className="eyebrow">Workspace / overview</p><h1>Project registry.</h1><p className="muted">Browse the IEDC initiatives and open any project for its details.</p></div><div className="stat-block"><strong>{projects.length.toString().padStart(2, '0')}</strong><span>all<br />projects</span></div></section>
    <ProjectFilters filters={filters} setFilters={setFilters} />
    <ProjectList projects={projects} onSelect={onSelect} />
  </>
}

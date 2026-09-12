import ProjectList from './ProjectList'
import ProjectFilters from './ProjectFilters'

export default function MyProjects({ projects, filters, setFilters, onSelect, onUpdate, onDelete, onRefresh }) {
  return <section className="management-page"><div className="section-heading"><div><p className="eyebrow">Project management / private workspace</p><h1>My projects.</h1><p className="muted">Only your projects appear here. Update their status or remove them.</p></div><button className="icon-button" title="Refresh projects" onClick={onRefresh}>+</button></div><ProjectFilters filters={filters} setFilters={setFilters} />{projects.length ? <ProjectList projects={projects} isOwner onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete} /> : <div className="empty-state"><h3>You have no projects yet.</h3><p>Use Create project to register your first initiative.</p></div>}</section>
}

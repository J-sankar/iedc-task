export default function ProjectList({ projects, isOwner = false, onSelect, onUpdate, onDelete }) {
  return <div className="project-list">
    {projects.map((project) => <article className="project-item" key={project.id}>
      <button className="project-index" onClick={() => onSelect(project)} aria-label={`View ${project.title}`}>{project.title.slice(0, 1).toUpperCase()}</button>
      <button className="project-info" onClick={() => onSelect(project)}>
        <div className="project-meta"><span>{project.domain}</span><span>{new Date(project.createdAt).toLocaleDateString()}</span></div>
        <h3>{project.title}</h3><p>{project.abstract}</p><small>Lead: {project.teamLead?.name || 'Unknown'}</small>
      </button>
      {isOwner && <div className="project-actions"><select value={project.status} onChange={(event) => onUpdate(project, event.target.value)} aria-label={`Update ${project.title} status`}>{['IDEATION', 'PROTOTYPE', 'SEED_FUNDED'].map((status) => <option key={status}>{status}</option>)}</select><button className="delete-button" title="Delete project" onClick={() => onDelete(project)}>Delete</button></div>}
    </article>)}
  </div>
}

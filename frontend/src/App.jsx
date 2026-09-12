import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { authHeaders, request } from './lib/api'
import AuthPanel from './components/AuthPanel'
import AppShell from './components/AppShell'
import Overview from './components/Overview'
import CreateProject from './components/CreateProject'
import MyProjects from './components/MyProjects'
import ProjectDetails from './components/ProjectDetails'

const emptyProject = { title: '', domain: '', abstract: '', status: 'IDEATION' }

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('iedc_token'))
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('iedc_user') || 'null'))
  const [view, setView] = useState('overview')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [filters, setFilters] = useState({ status: '', domain: '' })
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadProjects = async () => {
    try {
      const query = new URLSearchParams()
      if (filters.status) query.set('status', filters.status)
      if (filters.domain) query.set('domain', filters.domain)
      const data = await request(`/api/projects${query.size ? `?${query}` : ''}`)
      setProjects(data.projects || [])
    } catch (requestError) { setError(requestError.message) }
  }

  useEffect(() => { loadProjects() }, [filters.status, filters.domain])

  const ownProjects = useMemo(() => projects.filter((project) => project.teamLead?.id === user?.id), [projects, user])
  const showDetails = (project) => { setSelectedProject(project); setView('details') }

  const handleCreate = async (event) => {
    event.preventDefault()
    const payload = { title: projectForm.title.trim(), domain: projectForm.domain.trim(), abstract: projectForm.abstract.trim(), status: projectForm.status }
    if (!payload.title || !payload.domain || !payload.abstract) { setError('Title, domain, and abstract are required.'); return }
    setLoading(true); setError(''); setMessage('')
    try {
      await request('/api/projects', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload) })
      setProjectForm(emptyProject); setMessage('Project created.'); await loadProjects(); setView('my-projects')
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  const updateStatus = async (project, status) => {
    try {
      await request(`/api/projects/${project.id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify({ status }) })
      setMessage('Project status updated.'); await loadProjects()
      if (selectedProject?.id === project.id) setSelectedProject({ ...selectedProject, status })
    } catch (requestError) { setError(requestError.message) }
  }

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete ${project.title}?`)) return
    try {
      await request(`/api/projects/${project.id}`, { method: 'DELETE', headers: authHeaders(token) })
      setMessage('Project deleted.'); setSelectedProject(null); await loadProjects(); setView('my-projects')
    } catch (requestError) { setError(requestError.message) }
  }

  const signOut = () => { localStorage.removeItem('iedc_token'); localStorage.removeItem('iedc_user'); setToken(null); setUser(null) }
  if (!token) return <AuthPanel onAuthenticated={(newToken, newUser) => { setToken(newToken); setUser(newUser) }} />

  return <AppShell user={user} view={view} setView={setView} onSignOut={signOut} notice={{ error, message }}>
    {view === 'overview' && <Overview projects={projects} ownProjects={ownProjects} filters={filters} setFilters={setFilters} onSelect={showDetails} />}
    {view === 'create' && <CreateProject form={projectForm} setForm={setProjectForm} onSubmit={handleCreate} loading={loading} />}
    {view === 'my-projects' && <MyProjects projects={ownProjects} filters={filters} setFilters={setFilters} onSelect={showDetails} onUpdate={updateStatus} onDelete={deleteProject} onRefresh={loadProjects} />}
    {view === 'details' && selectedProject && <ProjectDetails project={selectedProject} isOwner={selectedProject.teamLead?.id === user?.id} onBack={() => setView('overview')} onUpdate={updateStatus} onDelete={deleteProject} />}
  </AppShell>
}

export default App

import { useEffect, useMemo, useState } from 'react'
import { API_URL } from '../config.jsx'

const TABS = [
  {
    id: 'companies',
    label: 'Companies',
    endpoint: 'companies',
    columns: ['name', 'email', 'phone', /* 'website', */ 'country', 'city', 'address'],
  },
  {
    id: 'pipelines',
    label: 'Pipeline',
    endpoint: 'pipelines',
    columns: ['company_id', 'company_name', 'name', 'color', 'sort_order', 'is_active'],
    editableColumns: ['company_id', 'name', 'color', 'sort_order', 'is_active'],
  },
  {
    id: 'leads',
    label: 'Leads',
    endpoint: 'leads',
    columns: [
      'company_name',
      'first_name',
      'last_name',
      'email',
      'phone',
      'job_title',
      'status',
      'value',
      'notes',
      'follow_up_at',
    ],
  },
]

function normalizeRecords(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.companies)) return payload.companies
  if (Array.isArray(payload?.pipelines)) return payload.pipelines
  if (Array.isArray(payload?.leads)) return payload.leads
  return []
}

function getColumnLabel(column) {
  const labels = {
    company_id: 'Company ID',
    company_name: 'Company Name',
    name: 'Name',
    color: 'Color',
    sort_order: 'Sort Order',
    is_active: 'Active',
    email: 'Email',
    phone: 'Phone',
    website: 'Website',
    country: 'Country',
    city: 'City',
    address: 'Address',
  }
  return labels[column] ?? column.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function renderCell(value, column, record) {
  if (column === 'company_name') {
    const companyName = value || record?.company?.name || record?.company_name
    return companyName || '-'
  }
  if (column === 'follow_up_at' && typeof value === 'string') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (column === 'color' && typeof value === 'string') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: value,
            borderRadius: '6px',
            border: '1px solid var(--border)',
          }}
        />
        <span>{value}</span>
      </div>
    )
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default function DashboardPage({ token }) {
  const [activeTab, setActiveTab] = useState('companies')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState(null)

  const activeTabConfig = useMemo(
    () => TABS.find((tab) => tab.id === activeTab) ?? TABS[0],
    [activeTab],
  )

  useEffect(() => {
    if (!token) return

    const fetchRecords = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/${activeTabConfig.endpoint}`, {
          headers: {
            Authorization: token,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to load records')
        }

        setRecords(normalizeRecords(data))
      } catch (fetchError) {
        setError(fetchError.message)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [token, activeTabConfig.endpoint])

  const displayColumns = useMemo(() => {
    if (activeTabConfig.columns) return activeTabConfig.columns
    if (!records.length) return []
    const first = records[0]
    return Object.keys(first)
  }, [records, activeTabConfig.columns])

  const editableColumns = useMemo(
    () => activeTabConfig.editableColumns ?? displayColumns,
    [activeTabConfig.editableColumns, displayColumns],
  )

  const handleEditClick = (record) => {
    setEditingId(record.id)
    setEditFormData({ ...record })
    setEditError(null)
  }

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditSubmit = async () => {
    setEditLoading(true)
    setEditError(null)

    try {
      const response = await fetch(`${API_URL}/${activeTabConfig.endpoint}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update record')
      }

      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingId ? { ...record, ...editFormData } : record,
        ),
      )
      setEditingId(null)
      setEditFormData({})
    } catch (fetchError) {
      setEditError(fetchError.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditFormData({})
    setEditError(null)
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-top">
        <div />
      </div>

      <div className="dashboard-grid">
        <nav className="side-nav">
          <div className="nav-title">Explore</div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={tab.id === activeTab ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="main-pane">
          <div className="details-card">
            <div>
              <h2>{activeTabConfig.label}</h2>
              <p>{loading ? 'Loading records...' : `${records.length} records found`}</p>
            </div>
          </div>

          {error ? (
            <div className="error-text">{error}</div>
          ) : loading ? (
            <div className="info-text">Fetching data from the server...</div>
          ) : records.length === 0 ? (
            <div className="info-text">No records available for this section.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <caption>{activeTabConfig.label} data table</caption>
                <thead>
                  <tr>
                    {displayColumns.map((column) => (
                      <th key={column}>{getColumnLabel(column)}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, rowIndex) => (
                    <tr key={record.id ?? rowIndex}>
                      {displayColumns.map((column) => (
                        <td key={`${rowIndex}-${column}`}>{renderCell(record[column], column, record)}</td>
                      ))}
                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEditClick(record)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editingId !== null && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit {activeTabConfig.label}</h2>
            {editError ? <div className="error-text">{editError}</div> : null}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEditSubmit()
              }}
            >
              {editableColumns.map((column) => {
                const value = editFormData[column] ?? ''
                const isColorColumn = column === 'color'
                const isBooleanColumn = column === 'is_active'
                const isNumericColumn = column === 'sort_order'

                return (
                  <div key={column} className="form-group">
                    <label htmlFor={`edit-${column}`}>{getColumnLabel(column)}</label>
                    {isBooleanColumn ? (
                      <input
                        id={`edit-${column}`}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => handleEditChange(column, e.target.checked)}
                      />
                    ) : isColorColumn ? (
                      <input
                        id={`edit-${column}`}
                        type="color"
                        value={typeof value === 'string' && value.startsWith('#') ? value : '#000000'}
                        onChange={(e) => handleEditChange(column, e.target.value)}
                      />
                    ) : isNumericColumn ? (
                      <input
                        id={`edit-${column}`}
                        type="number"
                        value={value}
                        onChange={(e) => handleEditChange(column, e.target.value)}
                      />
                    ) : (
                      <input
                        id={`edit-${column}`}
                        type="text"
                        value={value}
                        onChange={(e) => handleEditChange(column, e.target.value)}
                      />
                    )}
                  </div>
                )
              })}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleEditCancel}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

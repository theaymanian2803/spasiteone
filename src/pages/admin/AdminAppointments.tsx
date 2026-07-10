import { useEffect, useState, useMemo } from 'react'
import { turso } from '@/lib/db'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Pencil, Trash2, Search, X } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

interface AppointmentRow {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  client_name: string
  client_email: string
  client_phone: string | null
  special_requests: string | null
  status: string
  total_price: number
  service_id: string
  services: { name: string; category: string } | null
}

const statusOptions = ['pending', 'confirmed', 'completed', 'no-show', 'cancelled']

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editApt, setEditApt] = useState<AppointmentRow | null>(null)
  const [editForm, setEditForm] = useState({ status: '', special_requests: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  const fetchAppointments = async () => {
    const result = await turso.execute(
      `SELECT a.*, s.name as service_name, s.category as service_category
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       ORDER BY a.appointment_date DESC, a.start_time ASC`
    )
    setAppointments((result.rows as any[]).map((r: any) => ({
      id: r.id,
      appointment_date: r.appointment_date,
      start_time: r.start_time,
      end_time: r.end_time,
      client_name: r.client_name,
      client_email: r.client_email,
      client_phone: r.client_phone,
      special_requests: r.special_requests,
      status: r.status,
      total_price: r.total_price,
      service_id: r.service_id,
      services: r.service_name ? { name: r.service_name, category: r.service_category || '' } : null,
    })) as AppointmentRow[])
    setLoading(false)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      if (search) {
        const q = search.toLowerCase()
        const matches =
          apt.client_name.toLowerCase().includes(q) ||
          apt.client_email.toLowerCase().includes(q) ||
          (apt.client_phone && apt.client_phone.includes(q)) ||
          apt.services?.name?.toLowerCase().includes(q)
        if (!matches) return false
      }
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false
      if (dateFrom && apt.appointment_date < format(dateFrom, 'yyyy-MM-dd')) return false
      if (dateTo && apt.appointment_date > format(dateTo, 'yyyy-MM-dd')) return false
      return true
    })
  }, [appointments, search, statusFilter, dateFrom, dateTo])

  const hasFilters = search || statusFilter !== 'all' || dateFrom || dateTo

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const updateStatus = async (id: string, status: string) => {
    await turso.execute("UPDATE appointments SET status = ? WHERE id = ?", [status, id])
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    toast.success('Status updated')
  }

  const openEdit = (apt: AppointmentRow) => {
    setEditApt(apt)
    setEditForm({
      status: apt.status,
      special_requests: apt.special_requests ?? '',
    })
  }

  const handleSave = async () => {
    if (!editApt) return
    setSaving(true)
    await turso.execute(
      "UPDATE appointments SET status = ?, special_requests = ? WHERE id = ?",
      [editForm.status, editForm.special_requests, editApt.id]
    )
    toast.success('Appointment updated')
    setSaving(false)
    setEditApt(null)
    fetchAppointments()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await turso.execute("DELETE FROM appointments WHERE id = ?", [deleteId])
    toast.success('Appointment deleted')
    setDeleteId(null)
    fetchAppointments()
  }

  const inputClass =
    'w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors'

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">
        All <span className="italic">Appointments</span>
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Search client, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={`${inputClass} w-auto min-w-[140px]`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                inputClass,
                'w-auto min-w-[130px] text-left',
                !dateFrom && 'text-muted-foreground'
              )}>
              {dateFrom ? format(dateFrom, 'MMM d, yyyy') : 'From date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                inputClass,
                'w-auto min-w-[130px] text-left',
                !dateTo && 'text-muted-foreground'
              )}>
              {dateTo ? format(dateTo, 'MMM d, yyyy') : 'To date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-2">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="border border-border rounded-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Date', 'Time', 'Client', 'Service', 'Price', 'Status', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-3">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt) => (
              <tr key={apt.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-3 px-3 font-body text-sm">{apt.appointment_date}</td>
                <td className="py-3 px-3 font-body text-sm">{apt.start_time?.slice(0, 5)}</td>
                <td className="py-3 px-3 font-body text-sm">
                  <div className="font-medium">{apt.client_name}</div>
                  <div className="text-xs text-muted-foreground">{apt.client_email}</div>
                  {/* ADDED CLIENT PHONE HERE */}
                  {apt.client_phone && (
                    <div className="text-xs text-muted-foreground">{apt.client_phone}</div>
                  )}
                </td>
                <td className="py-3 px-3 font-body text-sm">{apt.services?.name}</td>
                <td className="py-3 px-3 font-body text-sm">€{apt.total_price}</td>
                <td className="py-3 px-3">
                  <select
                    value={apt.status}
                    onChange={(e) => updateStatus(apt.id, e.target.value)}
                    className="text-xs font-body border border-border rounded px-2 py-1 bg-background">
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(apt)}
                      className="text-muted-foreground hover:text-foreground">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(apt.id)}
                      className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                {/* Updated colSpan from 8 to 8 (remains same since no new column was added) */}
                <td
                  colSpan={7}
                  className="py-8 text-center font-body text-sm text-muted-foreground italic">
                  {hasFilters ? 'No appointments match your filters.' : 'No appointments yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editApt} onOpenChange={() => setEditApt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Edit Appointment</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Update appointment details for {editApt?.client_name}.
            </DialogDescription>
          </DialogHeader>
          {editApt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm font-body bg-muted/20 p-3 rounded-md">
                <div>
                  <span className="text-muted-foreground">Date:</span> {editApt.appointment_date}
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>{' '}
                  {editApt.start_time?.slice(0, 5)}
                </div>
                <div>
                  <span className="text-muted-foreground">Service:</span> {editApt.services?.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span> €{editApt.total_price}
                </div>
                {/* Added Email and Phone to the edit dialog for quick reference */}
                <div>
                  <span className="text-muted-foreground">Email:</span> {editApt.client_email}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>{' '}
                  {editApt.client_phone || 'N/A'}
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">
                  Status
                </label>
                <select
                  className={inputClass}
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">
                  Notes
                </label>
                <textarea
                  className={`${inputClass} min-h-[60px] resize-none`}
                  value={editForm.special_requests}
                  onChange={(e) => setEditForm({ ...editForm, special_requests: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="elegant" onClick={() => setEditApt(null)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Delete Appointment</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Are you sure you want to permanently delete this appointment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="elegant" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminAppointments

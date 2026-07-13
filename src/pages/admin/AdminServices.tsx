import { useEffect, useState, useMemo } from "react";
import { turso } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/booking";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

const emptyService = { name: "", description: "", duration_minutes: 60, price: 0, category: "", active: true, image_url: "" };

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchServices = async () => {
    const result = await turso.execute("SELECT * FROM services ORDER BY category, name");
    setServices(result.rows as unknown as Service[]);
  };

  const fetchCategories = async () => {
    const result = await turso.execute("SELECT id, name FROM categories WHERE active = 1 ORDER BY display_order, name");
    setCategories(result.rows as { id: string; name: string }[]);
  };

  useEffect(() => {
    Promise.all([fetchServices(), fetchCategories()]).then(() => setLoading(false));
  }, []);

  const allCategories = useMemo(() => [...new Set(services.map((s) => s.category))], [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !(s.description ?? "").toLowerCase().includes(q)) return false;
      }
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (activeFilter === "active" && !s.active) return false;
      if (activeFilter === "inactive" && s.active) return false;
      return true;
    });
  }, [services, search, categoryFilter, activeFilter]);

  const filteredCategories = [...new Set(filtered.map((s) => s.category))];
  const hasFilters = search || categoryFilter !== "all" || activeFilter !== "all";

  const clearFilters = () => { setSearch(""); setCategoryFilter("all"); setActiveFilter("all"); };

  const openCreate = () => { setEditing(null); setForm(emptyService); setDialogOpen(true); };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? "", duration_minutes: s.duration_minutes, price: s.price, category: s.category, active: s.active, image_url: s.image_url ?? "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Le nom est requis"); return; }
    setSaving(true);
    if (editing) {
      await turso.execute(
        "UPDATE services SET name = ?, description = ?, duration_minutes = ?, price = ?, category = ?, active = ?, image_url = ? WHERE id = ?",
        [form.name, form.description, form.duration_minutes, form.price, form.category, form.active ? 1 : 0, form.image_url, editing.id]
      );
      toast.success("Service mis à jour");
    } else {
      await turso.execute(
        "INSERT INTO services (name, description, duration_minutes, price, category, active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [form.name, form.description, form.duration_minutes, form.price, form.category, form.active ? 1 : 0, form.image_url]
      );
      toast.success("Service créé");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchServices();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await turso.execute("DELETE FROM services WHERE id = ?", [deleteId]);
    toast.success("Service supprimé");
    setDeleteId(null);
    fetchServices();
  };

  const inputClass = "w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors";

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Gestion des <span className="italic">Services</span></h1>
        <Button variant="hero" size="sm" onClick={openCreate}><Plus size={16} className="mr-1" /> Ajouter un Service</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className={`${inputClass} pl-9`} placeholder="Rechercher des services..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={`${inputClass} w-auto min-w-[130px]`} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Toutes les Catégories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={`${inputClass} w-auto min-w-[120px]`} value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="all">Tous les Statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-2">
            <X size={14} /> Effacer
          </button>
        )}
      </div>

      {filteredCategories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4">{cat}</h2>
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Image", "Nom", "Durée", "Prix", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.filter((s) => s.category === cat).map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-3">
                      {s.image_url ? (
                        <div className="w-12 h-12 rounded-sm overflow-hidden">
                          <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center">
                          <ImageIcon size={16} className="text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-body text-sm">
                      <div>{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.description}</div>
                    </td>
                    <td className="py-3 px-3 font-body text-sm">{s.duration_minutes} min</td>
                    <td className="py-3 px-3 font-body text-sm">{s.price} DH</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {s.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center font-body text-sm text-muted-foreground italic py-8">
          {hasFilters ? "Aucun service ne correspond à vos filtres." : "Aucun service pour le moment."}
        </p>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Modifier le Service" : "Nouveau Service"}</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {editing ? "Mettez à jour les détails du service ci-dessous." : "Remplissez les détails du nouveau service."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Nom *</label>
              <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Description</label>
              <textarea className={`${inputClass} min-h-[80px] resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">URL de l'Image du Service</label>
              <input className={inputClass} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." />
              {form.image_url && (
                <div className="mt-2 w-full h-32 rounded-sm overflow-hidden border border-border">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Catégorie</label>
                <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Durée (min)</label>
                <input type="number" className={inputClass} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Prix (DH)</label>
                <input type="number" step="0.01" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-primary" />
              <label htmlFor="active" className="font-body text-sm">Actif</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="elegant" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button variant="hero" onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Supprimer le Service</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="elegant" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;

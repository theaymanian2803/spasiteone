import { useEffect, useState } from "react";
import { turso } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  active: number;
}

const emptyCategory = { name: "", slug: "", description: "", display_order: 0, active: 1 };

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    const result = await turso.execute("SELECT * FROM categories ORDER BY display_order, name");
    setCategories(result.rows as unknown as Category[]);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyCategory, display_order: categories.length });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", display_order: cat.display_order, active: cat.active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Le nom est requis"); return; }
    const slug = form.slug || generateSlug(form.name);
    setSaving(true);

    if (editing) {
      await turso.execute(
        "UPDATE categories SET name = ?, slug = ?, description = ?, display_order = ?, active = ?, updated_at = datetime('now') WHERE id = ?",
        [form.name, slug, form.description, form.display_order, form.active, editing.id]
      );
      toast.success("Catégorie mise à jour");
    } else {
      // Check slug uniqueness
      const existing = await turso.execute("SELECT id FROM categories WHERE slug = ?", [slug]);
      if (existing.rows.length > 0) { toast.error("Une catégorie avec ce nom existe déjà"); setSaving(false); return; }

      await turso.execute(
        "INSERT INTO categories (name, slug, description, display_order, active) VALUES (?, ?, ?, ?, ?)",
        [form.name, slug, form.description, form.display_order, form.active]
      );
      toast.success("Catégorie créée");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    // Check if services use this category
    const cat = categories.find((c) => c.id === deleteId);
    if (cat) {
      const servicesUsing = await turso.execute("SELECT COUNT(*) as count FROM services WHERE category = ?", [cat.name]);
      const count = servicesUsing.rows[0]?.count as number ?? 0;
      if (count > 0) {
        toast.error(`Impossible de supprimer : ${count} service(s) utilisent cette catégorie. Réaffectez-les d'abord.`);
        setDeleteId(null);
        return;
      }
    }
    await turso.execute("DELETE FROM categories WHERE id = ?", [deleteId]);
    toast.success("Catégorie supprimée");
    setDeleteId(null);
    fetchCategories();
  };

  const inputClass = "w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors";

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Gestion des <span className="italic">Catégories</span></h1>
        <Button variant="hero" size="sm" onClick={openCreate}><Plus size={16} className="mr-1" /> Ajouter une Catégorie</Button>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Ordre", "Nom", "Slug", "Description", "Statut", "Actions"].map((h) => (
                <th key={h} className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-2 px-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical size={14} />
                    <span className="font-body text-sm">{cat.display_order}</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-body text-sm font-medium">{cat.name}</td>
                <td className="py-3 px-3 font-body text-sm text-muted-foreground">{cat.slug}</td>
                <td className="py-3 px-3 font-body text-sm text-muted-foreground">{cat.description || "—"}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cat.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {cat.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(cat.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <p className="text-center font-body text-sm text-muted-foreground italic py-8">Aucune catégorie pour le moment.</p>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Modifier la Catégorie" : "Nouvelle Catégorie"}</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {editing ? "Mettez à jour les détails de la catégorie ci-dessous." : "Remplissez les détails de la nouvelle catégorie."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Nom *</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm({ ...form, name, slug: editing ? form.slug : generateSlug(name) });
                }}
                placeholder="ex. Massages"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Slug</label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="ex. massages"
              />
              <p className="font-body text-xs text-muted-foreground mt-1">Généré automatiquement à partir du nom. Utilisé dans les URLs.</p>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Description</label>
              <textarea
                className={`${inputClass} min-h-[80px] resize-none`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brève description de cette catégorie"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Ordre d'Affichage</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={!!form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked ? 1 : 0 })}
                  className="accent-primary"
                />
                <label htmlFor="cat-active" className="font-body text-sm">Actif</label>
              </div>
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
            <DialogTitle className="font-display">Supprimer la Catégorie</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Êtes-vous sûr ? Les services utilisant cette catégorie devront d'abord être réaffectés.
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

export default AdminCategories;

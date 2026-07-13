import { useState } from "react";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/ImageUpload";
import { GalleryItem } from "@/hooks/useSiteContent";

interface GalleryManagerProps {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  onSave: () => void;
  saving: boolean;
}

const GalleryManager = ({ items, onChange, onSave, saving }: GalleryManagerProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const inputClass = "w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClass = "font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block";

  const updateItem = (index: number, updates: Partial<GalleryItem>) => {
    const updated = [...items];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, { image_url: "", alt: "", label: "" }]);
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    onChange(updated);
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-muted-foreground">
        Faites glisser les éléments pour les réordonner. Les images sans photo téléchargée utiliseront l'espace réservé par défaut.
      </p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`border border-border rounded-sm p-4 bg-background transition-shadow ${
              dragIndex === i ? "shadow-lg ring-1 ring-primary/30" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="cursor-grab mt-2 text-muted-foreground hover:text-foreground shrink-0">
                <GripVertical size={18} />
              </div>

              <div className="w-40 shrink-0">
                <ImageUpload
                  value={item.image_url}
                  onChange={(url) => updateItem(i, { image_url: url })}
                  label={`Image ${i + 1}`}
                  folder="gallery"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <label className={labelClass}>Libellé</label>
                  <input
                    className={inputClass}
                    value={item.label}
                    onChange={(e) => updateItem(i, { label: e.target.value })}
                    placeholder="ex. Coloration"
                  />
                </div>
                <div>
                  <label className={labelClass}>Texte Alternatif</label>
                  <input
                    className={inputClass}
                    value={item.alt}
                    onChange={(e) => updateItem(i, { alt: e.target.value })}
                    placeholder="Décrivez l'image pour l'accessibilité"
                  />
                </div>
              </div>

              <button
                onClick={() => removeItem(i)}
                className="text-muted-foreground hover:text-destructive shrink-0 mt-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-body text-primary hover:text-foreground transition-colors"
      >
        <Plus size={14} /> Ajouter un élément de galerie
      </button>

      <Button variant="hero" onClick={onSave} disabled={saving}>
        <Save size={14} className="mr-2" /> {saving ? "Enregistrement..." : "Enregistrer la Galerie"}
      </Button>
    </div>
  );
};

export default GalleryManager;

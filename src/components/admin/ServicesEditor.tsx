import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicesContent, ServiceCardItem } from "@/hooks/useSiteContent";

const ICON_OPTIONS = ["Scissors", "Sparkles", "Eye", "Droplets", "Flower2", "Heart", "Star", "Gem"];

interface ServicesEditorProps {
  content: ServicesContent;
  onChange: (content: ServicesContent) => void;
  onSave: () => void;
  saving: boolean;
}

const ServicesEditor = ({ content, onChange, onSave, saving }: ServicesEditorProps) => {
  const inputClass = "w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClass = "font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block";

  const updateItem = (index: number, updates: Partial<ServiceCardItem>) => {
    const updated = [...content.items];
    updated[index] = { ...updated[index], ...updates };
    onChange({ ...content, items: updated });
  };

  const removeItem = (index: number) => {
    onChange({ ...content, items: content.items.filter((_, i) => i !== index) });
  };

  const addItem = () => {
    onChange({ ...content, items: [...content.items, { icon: "Sparkles", title: "", description: "", price_range: "" }] });
  };

  return (
    <div className="space-y-6">
      {/* Section heading fields */}
      <div>
        <label className={labelClass}>Subtitle</label>
        <input className={inputClass} value={content.subtitle} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={content.title} onChange={(e) => onChange({ ...content, title: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Title Italic Part</label>
          <input className={inputClass} value={content.title_italic} onChange={(e) => onChange({ ...content, title_italic: e.target.value })} />
        </div>
      </div>

      {/* Service cards */}
      <div>
        <label className={labelClass}>Service Cards</label>
        <div className="space-y-4">
          {content.items.map((item, i) => (
            <div key={i} className="border border-border rounded-sm p-4 bg-background">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-[120px_1fr] gap-3">
                    <div>
                      <label className={labelClass}>Icon</label>
                      <select className={inputClass} value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })}>
                        {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Title</label>
                      <input className={inputClass} value={item.title} onChange={(e) => updateItem(i, { title: e.target.value })} placeholder="e.g. Hair" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea className={`${inputClass} min-h-[60px] resize-none`} value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Price Range</label>
                    <input className={inputClass} value={item.price_range} onChange={(e) => updateItem(i, { price_range: e.target.value })} placeholder="e.g. €65 – €250" />
                  </div>
                </div>
                <button onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive shrink-0 mt-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="flex items-center gap-2 text-sm font-body text-primary hover:text-foreground transition-colors mt-3">
          <Plus size={14} /> Add service card
        </button>
      </div>

      <Button variant="hero" onClick={onSave} disabled={saving}>
        <Save size={14} className="mr-2" /> {saving ? "Saving..." : "Save Services"}
      </Button>
    </div>
  );
};

export default ServicesEditor;

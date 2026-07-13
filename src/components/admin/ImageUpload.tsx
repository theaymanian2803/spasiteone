import { useState, useRef } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadSiteImage } from "@/hooks/useSiteContent";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  folder: string;
}

const ImageUpload = ({ value, onChange, label, folder }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Veuillez sélectionner un fichier image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("La taille maximale est de 5 Mo"); return; }

    setUploading(true);
    const path = `${folder}/${Date.now()}-${file.name}`;
    const { url, error } = await uploadSiteImage(file, path);
    setUploading(false);

    if (error) { toast.error("Échec de l'upload : " + error.message); return; }
    if (url) { onChange(url); toast.success("Image téléchargée"); }
  };

  return (
    <div>
      <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">{label}</label>
      <div className="border border-border rounded-sm overflow-hidden">
        {value ? (
          <div className="relative aspect-video bg-muted">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <button
                onClick={() => inputRef.current?.click()}
                className="bg-background/90 text-foreground px-4 py-2 rounded-sm font-body text-sm flex items-center gap-2"
              >
                <Upload size={14} /> Remplacer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-video bg-muted/50 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
            disabled={uploading}
          >
            <ImageIcon size={24} className="text-muted-foreground" />
            <span className="font-body text-sm text-muted-foreground">
              {uploading ? "Téléchargement..." : "Cliquer pour télécharger"}
            </span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
    </div>
  );
};

export default ImageUpload;

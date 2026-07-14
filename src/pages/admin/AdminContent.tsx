import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useSiteContent,
  saveSectionContent,
  uploadSiteImage,
  type SiteContent,
  type HeroContent,
  type AboutContent,
  type ServicesContent,
  type GalleryContent,
  type ContactContent,
  type FooterContent,
  type ServiceCardItem,
  type GalleryItem,
} from "@/hooks/useSiteContent";

const AdminContent = () => {
  const { content, loading } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && content) setDraft(content);
  }, [loading, content]);

  if (loading || !draft) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  const save = async (key: keyof SiteContent) => {
    setSaving(key);
    const { error } = await saveSectionContent(key, draft[key]);
    setSaving(null);
    if (error) {
      toast({ title: "Erreur lors de l'enregistrement", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Enregistré", description: `La section ${key} a été mise à jour avec succès.` });
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof SiteContent,
    pathPrefix: string,
    onUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${pathPrefix}/${Date.now()}-${file.name}`;
    const { url, error } = await uploadSiteImage(file, path);
    if (error || !url) {
      toast({ title: "Échec de l'upload", description: error?.message, variant: "destructive" });
      return;
    }
    onUrl(url);
  };

  const updateHero = (field: keyof HeroContent, value: string) =>
    setDraft((d) => d && { ...d, hero: { ...d.hero, [field]: value } });

  const updateAbout = (field: keyof AboutContent, value: any) =>
    setDraft((d) => d && { ...d, about: { ...d.about, [field]: value } });

  const updateContact = (field: keyof ContactContent, value: string) =>
    setDraft((d) => d && { ...d, contact: { ...d.contact, [field]: value } });

  const updateFooter = (field: keyof FooterContent, value: any) =>
    setDraft((d) => d && { ...d, footer: { ...d.footer, [field]: value } });

  const updateServiceItem = (index: number, field: keyof ServiceCardItem, value: string) => {
    setDraft((d) => {
      if (!d) return d;
      const items = [...d.services.items];
      items[index] = { ...items[index], [field]: value };
      return { ...d, services: { ...d.services, items } };
    });
  };

  const addServiceItem = () => {
    setDraft((d) => {
      if (!d) return d;
      return {
        ...d,
        services: {
          ...d.services,
          items: [...d.services.items, { number: String(d.services.items.length + 1).padStart(2, "0"), icon: "Scissors", title: "", description: "", image_url: "" }],
        },
      };
    });
  };

  const removeServiceItem = (index: number) => {
    setDraft((d) => {
      if (!d) return d;
      return { ...d, services: { ...d.services, items: d.services.items.filter((_, i) => i !== index) } };
    });
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    setDraft((d) => {
      if (!d) return d;
      const items = [...d.gallery.items];
      items[index] = { ...items[index], [field]: value };
      return { ...d, gallery: { ...d.gallery, items } };
    });
  };

  const addGalleryItem = () => {
    setDraft((d) => {
      if (!d) return d;
      return {
        ...d,
        gallery: { ...d.gallery, items: [...d.gallery.items, { image_url: "", alt: "", label: "" }] },
      };
    });
  };

  const removeGalleryItem = (index: number) => {
    setDraft((d) => {
      if (!d) return d;
      return { ...d, gallery: { ...d.gallery, items: d.gallery.items.filter((_, i) => i !== index) } };
    });
  };

  const SaveButton = ({ section }: { section: keyof SiteContent }) => (
    <Button onClick={() => save(section)} disabled={saving === section} className="gap-2">
      {saving === section ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Enregistrer
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Contenu du Site</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">
          Modifiez toutes les sections de la page d'accueil. Les modifications sont enregistrées par section.
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Bannière</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="about">À Propos</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="footer">Pied de Page</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Section Bannière</CardTitle>
              <CardDescription>Bannière principale avec titre et bouton d'action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Input value={draft.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Texte du Bouton CTA</Label>
                  <Input value={draft.hero.cta_text} onChange={(e) => updateHero("cta_text", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ligne de Titre 1</Label>
                  <Input value={draft.hero.title_line1} onChange={(e) => updateHero("title_line1", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ligne de Titre 2 (italique)</Label>
                  <Input value={draft.hero.title_line2} onChange={(e) => updateHero("title_line2", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={draft.hero.description} onChange={(e) => updateHero("description", e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Image de Fond</Label>
                <div className="flex items-center gap-4">
                  {draft.hero.image_url && (
                    <img src={draft.hero.image_url} alt="Aperçu de la bannière" className="h-20 w-32 object-cover rounded-sm border" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-sm text-sm hover:bg-muted transition-colors">
                    <ImageIcon className="h-4 w-4" /> Télécharger
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, "hero", "hero", (url) => updateHero("image_url", url))
                      }
                    />
                  </label>
                </div>
              </div>
              <SaveButton section="hero" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SERVICES */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Section Services</CardTitle>
              <CardDescription>Cartes de services en vedette sur la page d'accueil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Input
                    value={draft.services.subtitle}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, subtitle: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={draft.services.title}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, title: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre Itallique</Label>
                  <Input
                    value={draft.services.title_italic}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, title_italic: e.target.value } })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Note</Label>
                  <Input
                    value={draft.services.rating}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, rating: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre d'Utilisateurs</Label>
                  <Input
                    value={draft.services.users}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, users: e.target.value } })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Cartes de Services</Label>
                {draft.services.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-sm bg-muted/30">
                    <div className="space-y-1">
                      <Label className="text-xs">Numéro</Label>
                      <Input value={item.number} onChange={(e) => updateServiceItem(i, "number", e.target.value)} placeholder="01" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Icône</Label>
                      <Input value={item.icon} onChange={(e) => updateServiceItem(i, "icon", e.target.value)} placeholder="Scissors" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Titre</Label>
                      <Input value={item.title} onChange={(e) => updateServiceItem(i, "title", e.target.value)} />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeServiceItem(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input value={item.description} onChange={(e) => updateServiceItem(i, "description", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Image URL</Label>
                      <Input value={item.image_url} onChange={(e) => updateServiceItem(i, "image_url", e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addServiceItem} className="gap-2">
                  <Plus className="h-4 w-4" /> Ajouter une Carte de Service
                </Button>
              </div>
              <SaveButton section="services" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Section À Propos</CardTitle>
              <CardDescription>Titre, description, caractéristiques et statistiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Input value={draft.about.subtitle} onChange={(e) => updateAbout("subtitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input value={draft.about.title} onChange={(e) => updateAbout("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Titre Itallique</Label>
                  <Input value={draft.about.title_italic} onChange={(e) => updateAbout("title_italic", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={draft.about.description} onChange={(e) => updateAbout("description", e.target.value)} rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Caractéristique 1</Label>
                  <Input value={draft.about.feature1} onChange={(e) => updateAbout("feature1", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Caractéristique 2</Label>
                  <Input value={draft.about.feature2} onChange={(e) => updateAbout("feature2", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Statistiques</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2 p-3 border rounded-sm bg-muted/30">
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Nombre 1</Label>
                      <Input
                        value={draft.about.stat1_number}
                        onChange={(e) => updateAbout("stat1_number", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Libellé 1</Label>
                      <Input
                        value={draft.about.stat1_label}
                        onChange={(e) => updateAbout("stat1_label", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 p-3 border rounded-sm bg-muted/30">
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Nombre 2</Label>
                      <Input
                        value={draft.about.stat2_number}
                        onChange={(e) => updateAbout("stat2_number", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Libellé 2</Label>
                      <Input
                        value={draft.about.stat2_label}
                        onChange={(e) => updateAbout("stat2_label", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["image_url", "image2_url", "image3_url"] as const).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label className="text-xs">{field === "image_url" ? "Image Principale" : field === "image2_url" ? "Image Secondaire" : "Image Tertiaire"}</Label>
                      <div className="flex items-center gap-3">
                        {draft.about[field] && (
                          <img src={draft.about[field]} alt="Aperçu" className="h-16 w-20 object-cover rounded-sm border" />
                        )}
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border rounded-sm text-xs hover:bg-muted transition-colors">
                          <ImageIcon className="h-3 w-3" /> Télécharger
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, "about", "about", (url) => updateAbout(field, url))
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SaveButton section="about" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* GALLERY */}
        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Section Galerie</CardTitle>
              <CardDescription>Images du portfolio avec libellés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-sm bg-muted/30">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={draft.gallery.show_gallery}
                    onChange={(e) => setDraft((d) => d && { ...d, gallery: { ...d.gallery, show_gallery: e.target.checked } })}
                  />
                  <div className="w-11 h-6 bg-muted border border-border rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-gray-200 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
                </label>
                <Label className="cursor-pointer">Afficher la galerie sur la page d'accueil</Label>
              </div>
              {draft.gallery.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-sm bg-muted/30">
                  <div className="shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="h-20 w-28 object-cover rounded-sm border" />
                    ) : (
                      <div className="h-20 w-28 bg-muted rounded-sm flex items-center justify-center border">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 border rounded-sm text-xs mt-2 hover:bg-muted transition-colors">
                      <ImageIcon className="h-3 w-3" /> Télécharger
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, "gallery", "gallery", (url) => updateGalleryItem(i, "image_url", url))
                        }
                      />
                    </label>
                  </div>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeGalleryItem(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addGalleryItem} className="gap-2">
                <Plus className="h-4 w-4" /> Ajouter un Élément de Galerie
              </Button>
              <div className="pt-2">
                <SaveButton section="gallery" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Section Contact</CardTitle>
              <CardDescription>Section CTA près du bas de la page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Input value={draft.contact.subtitle} onChange={(e) => updateContact("subtitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input value={draft.contact.title} onChange={(e) => updateContact("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Titre Itallique</Label>
                  <Input value={draft.contact.title_italic} onChange={(e) => updateContact("title_italic", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={draft.contact.description} onChange={(e) => updateContact("description", e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input value={draft.contact.phone} onChange={(e) => updateContact("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone 2</Label>
                  <Input value={draft.contact.phone2} onChange={(e) => updateContact("phone2", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={draft.contact.email} onChange={(e) => updateContact("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input value={draft.contact.address} onChange={(e) => updateContact("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Horaires</Label>
                  <Input value={draft.contact.hours} onChange={(e) => updateContact("hours", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  {draft.contact.image_url && (
                    <img src={draft.contact.image_url} alt="Aperçu contact" className="h-20 w-32 object-cover rounded-sm border" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-sm text-sm hover:bg-muted transition-colors">
                    <ImageIcon className="h-4 w-4" /> Télécharger
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, "contact", "contact", (url) => updateContact("image_url", url))
                      }
                    />
                  </label>
                </div>
              </div>
              <SaveButton section="contact" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Pied de Page</CardTitle>
              <CardDescription>Informations de marque, horaires, coordonnées, réseaux sociaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Description de la Marque</Label>
                <Textarea value={draft.footer.brand_description} onChange={(e) => updateFooter("brand_description", e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input value={draft.footer.address} onChange={(e) => updateFooter("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input value={draft.footer.phone} onChange={(e) => updateFooter("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={draft.footer.email} onChange={(e) => updateFooter("email", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Horaires</Label>
                {draft.footer.hours.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={h}
                      onChange={(e) => {
                        const hours = [...draft.footer.hours];
                        hours[i] = e.target.value;
                        updateFooter("hours", hours);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => updateFooter("hours", draft.footer.hours.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-2" onClick={() => updateFooter("hours", [...draft.footer.hours, ""])}>
                  <Plus className="h-4 w-4" /> Ajouter une Ligne d'Horaire
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>URL Instagram</Label>
                  <Input value={draft.footer.instagram} onChange={(e) => updateFooter("instagram", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>URL Facebook</Label>
                  <Input value={draft.footer.facebook} onChange={(e) => updateFooter("facebook", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>URL Twitter</Label>
                  <Input value={draft.footer.twitter} onChange={(e) => updateFooter("twitter", e.target.value)} />
                </div>
              </div>
              <SaveButton section="footer" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;

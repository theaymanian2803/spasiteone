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
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `${key} section updated successfully.` });
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
      toast({ title: "Upload failed", description: error?.message, variant: "destructive" });
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
          items: [...d.services.items, { icon: "Scissors", title: "", description: "", price_range: "" }],
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
      Save {section}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Site Content</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">
          Edit all homepage sections. Changes are saved per section.
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Hero Section</CardTitle>
              <CardDescription>Main banner with headline and CTA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={draft.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input value={draft.hero.cta_text} onChange={(e) => updateHero("cta_text", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title Line 1</Label>
                  <Input value={draft.hero.title_line1} onChange={(e) => updateHero("title_line1", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title Line 2 (italic)</Label>
                  <Input value={draft.hero.title_line2} onChange={(e) => updateHero("title_line2", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={draft.hero.description} onChange={(e) => updateHero("description", e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex items-center gap-4">
                  {draft.hero.image_url && (
                    <img src={draft.hero.image_url} alt="Hero preview" className="h-20 w-32 object-cover rounded-sm border" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-sm text-sm hover:bg-muted transition-colors">
                    <ImageIcon className="h-4 w-4" /> Upload
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
              <CardTitle className="font-display">Services Section</CardTitle>
              <CardDescription>Featured service cards on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={draft.services.subtitle}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, subtitle: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={draft.services.title}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, title: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title Italic</Label>
                  <Input
                    value={draft.services.title_italic}
                    onChange={(e) => setDraft((d) => d && { ...d, services: { ...d.services, title_italic: e.target.value } })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Service Cards</Label>
                {draft.services.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-sm bg-muted/30">
                    <div className="space-y-1">
                      <Label className="text-xs">Icon</Label>
                      <Input value={item.icon} onChange={(e) => updateServiceItem(i, "icon", e.target.value)} placeholder="Scissors" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input value={item.title} onChange={(e) => updateServiceItem(i, "title", e.target.value)} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs">Description</Label>
                      <Input value={item.description} onChange={(e) => updateServiceItem(i, "description", e.target.value)} />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Price Range</Label>
                        <Input value={item.price_range} onChange={(e) => updateServiceItem(i, "price_range", e.target.value)} />
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeServiceItem(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addServiceItem} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Service Card
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
              <CardTitle className="font-display">About Section</CardTitle>
              <CardDescription>Story, stats, and image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={draft.about.subtitle} onChange={(e) => updateAbout("subtitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={draft.about.title} onChange={(e) => updateAbout("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title Italic</Label>
                  <Input value={draft.about.title_italic} onChange={(e) => updateAbout("title_italic", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Paragraphs</Label>
                {draft.about.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Textarea
                      value={p}
                      rows={2}
                      onChange={(e) => {
                        const paragraphs = [...draft.about.paragraphs];
                        paragraphs[i] = e.target.value;
                        updateAbout("paragraphs", paragraphs);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0 mt-1"
                      onClick={() => updateAbout("paragraphs", draft.about.paragraphs.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => updateAbout("paragraphs", [...draft.about.paragraphs, ""])}
                >
                  <Plus className="h-4 w-4" /> Add Paragraph
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Stats</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {draft.about.stats.map((stat, i) => (
                    <div key={i} className="flex gap-2 p-3 border rounded-sm bg-muted/30">
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Number</Label>
                        <Input
                          value={stat.number}
                          onChange={(e) => {
                            const stats = [...draft.about.stats];
                            stats[i] = { ...stats[i], number: e.target.value };
                            updateAbout("stats", stats);
                          }}
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const stats = [...draft.about.stats];
                            stats[i] = { ...stats[i], label: e.target.value };
                            updateAbout("stats", stats);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  {draft.about.image_url && (
                    <img src={draft.about.image_url} alt="About preview" className="h-20 w-20 object-cover rounded-sm border" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-sm text-sm hover:bg-muted transition-colors">
                    <ImageIcon className="h-4 w-4" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, "about", "about", (url) => updateAbout("image_url", url))
                      }
                    />
                  </label>
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
              <CardTitle className="font-display">Gallery Section</CardTitle>
              <CardDescription>Portfolio images with labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {draft.gallery.items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-sm bg-muted/30">
                  <div className="shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.alt} className="h-16 w-24 object-cover rounded-sm border" />
                    ) : (
                      <div className="h-16 w-24 bg-muted rounded-sm flex items-center justify-center border">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 border rounded-sm text-xs mt-2 hover:bg-muted transition-colors">
                      <ImageIcon className="h-3 w-3" /> Upload
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
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input value={item.label} onChange={(e) => updateGalleryItem(i, "label", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Alt Text</Label>
                      <Input value={item.alt} onChange={(e) => updateGalleryItem(i, "alt", e.target.value)} />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeGalleryItem(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addGalleryItem} className="gap-2">
                <Plus className="h-4 w-4" /> Add Gallery Item
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
              <CardTitle className="font-display">Contact Section</CardTitle>
              <CardDescription>CTA section near the bottom of the page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={draft.contact.subtitle} onChange={(e) => updateContact("subtitle", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={draft.contact.title} onChange={(e) => updateContact("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title Italic</Label>
                  <Input value={draft.contact.title_italic} onChange={(e) => updateContact("title_italic", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Primary</Label>
                  <Input value={draft.contact.cta_primary} onChange={(e) => updateContact("cta_primary", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Secondary</Label>
                  <Input value={draft.contact.cta_secondary} onChange={(e) => updateContact("cta_secondary", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={draft.contact.description} onChange={(e) => updateContact("description", e.target.value)} rows={3} />
              </div>
              <SaveButton section="contact" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Footer</CardTitle>
              <CardDescription>Brand info, hours, contact details, socials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Description</Label>
                <Textarea value={draft.footer.brand_description} onChange={(e) => updateFooter("brand_description", e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={draft.footer.address} onChange={(e) => updateFooter("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={draft.footer.phone} onChange={(e) => updateFooter("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={draft.footer.email} onChange={(e) => updateFooter("email", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hours</Label>
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
                  <Plus className="h-4 w-4" /> Add Hours Row
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input value={draft.footer.instagram} onChange={(e) => updateFooter("instagram", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input value={draft.footer.facebook} onChange={(e) => updateFooter("facebook", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Twitter URL</Label>
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

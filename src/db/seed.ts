import { turso } from "@/lib/db";
import { placeholderServices } from "@/lib/placeholderData";
import { defaultSiteContent } from "@/hooks/useSiteContent";

export async function seedDatabase() {
  // Check if data already exists
  const existing = await turso.execute("SELECT COUNT(*) as count FROM services");
  const count = existing.rows[0]?.count as number ?? 0;
  if (count > 0) return;

  // Seed categories
  const defaultCategories = [
    { name: "Massages", slug: "massages", description: "Relaxing massage treatments", display_order: 1 },
    { name: "Hammams", slug: "hammams", description: "Traditional hammam experiences", display_order: 2 },
    { name: "Packs", slug: "packs", description: "Curated spa packages", display_order: 3 },
    { name: "Hair", slug: "hair", description: "Hair care services", display_order: 4 },
    { name: "Nails", slug: "nails", description: "Nail care services", display_order: 5 },
    { name: "Facials", slug: "facials", description: "Facial treatments", display_order: 6 },
    { name: "Makeup", slug: "makeup", description: "Makeup services", display_order: 7 },
  ];

  for (const cat of defaultCategories) {
    await turso.execute(
      `INSERT INTO categories (name, slug, description, display_order, active)
       VALUES (?, ?, ?, ?, 1)`,
      [cat.name, cat.slug, cat.description, cat.display_order]
    );
  }

  // Seed services
  for (const s of placeholderServices) {
    await turso.execute(
      `INSERT INTO services (id, name, description, duration_minutes, price, category, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.description, s.duration_minutes, s.price, s.category, s.active ? 1 : 0, s.created_at, s.updated_at]
    );
  }

  // Seed site content
  const sections = ["hero", "services", "about", "gallery", "contact", "footer"];
  for (const key of sections) {
    const content = defaultSiteContent[key as keyof typeof defaultSiteContent];
    await turso.execute(
      `INSERT INTO site_content (section_key, content, updated_at)
       VALUES (?, ?, ?)`,
      [key, JSON.stringify(content), new Date().toISOString()]
    );
  }
}

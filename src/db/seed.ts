import { turso } from "@/lib/db";
import { placeholderServices } from "@/lib/placeholderData";
import { defaultSiteContent } from "@/hooks/useSiteContent";

export async function seedDatabase() {
  // Only seed if the database is empty — never wipe existing data
  const catCount = await turso.execute("SELECT COUNT(*) as count FROM categories");
  const existingCats = (catCount.rows[0] as { count: unknown }).count;
  if (Number(existingCats) > 0) return;

  // Insert default categories
  const defaultCategories = [
    { name: "Massages", slug: "massages", description: "", display_order: 1 },
    { name: "Hammams", slug: "hammams", description: "", display_order: 2 },
    { name: "Packs", slug: "packs", description: "", display_order: 3 },
  ];

  for (const cat of defaultCategories) {
    await turso.execute(
      `INSERT INTO categories (name, slug, description, display_order, active)
       VALUES (?, ?, ?, ?, 1)`,
      [cat.name, cat.slug, cat.description, cat.display_order]
    );
  }

  // Insert default services from placeholder data
  for (const s of placeholderServices) {
    await turso.execute(
      `INSERT INTO services (id, name, description, duration_minutes, price, category, active, image_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.description, s.duration_minutes, s.price, s.category, s.active ? 1 : 0, s.image_url ?? "", s.created_at, s.updated_at]
    );
  }

  // Insert default site content sections only if they don't exist
  const sections = ["hero", "services", "about", "whyChooseUs", "wellness", "premiumFeatures", "video", "pricing", "gallery", "contact", "footer"];
  for (const key of sections) {
    const content = defaultSiteContent[key as keyof typeof defaultSiteContent];
    if (!content) continue;
    const existing = await turso.execute("SELECT id FROM site_content WHERE section_key = ?", [key]);
    if (existing.rows.length === 0) {
      await turso.execute(
        `INSERT INTO site_content (section_key, content, updated_at)
         VALUES (?, ?, ?)`,
        [key, JSON.stringify(content), new Date().toISOString()]
      );
    }
  }
}
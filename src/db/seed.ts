import { turso } from "@/lib/db";
import { placeholderServices } from "@/lib/placeholderData";
import { defaultSiteContent } from "@/hooks/useSiteContent";

export async function seedDatabase() {
  // Check if data already exists
  const existing = await turso.execute("SELECT COUNT(*) as count FROM services");
  const count = existing.rows[0]?.count as number ?? 0;
  if (count > 0) return;

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

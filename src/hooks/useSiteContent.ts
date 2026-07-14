import { useEffect, useState } from "react";
import { turso } from "@/lib/db";

export interface HeroContent {
  subtitle: string;
  title_line1: string;
  title_line2: string;
  description: string;
  cta_text: string;
  image_url: string;
}

export interface AboutContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  feature1: string;
  feature2: string;
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  image_url: string;
  image2_url: string;
  image3_url: string;
}

export interface ServiceCardItem {
  number: string;
  icon: string;
  title: string;
  description: string;
  image_url: string;
}

export interface ServicesContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  items: ServiceCardItem[];
  rating: string;
  users: string;
}

export interface WhyChooseUsContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  image_url: string;
  since_year: string;
  certified_title: string;
  certified_description: string;
  experience_years: string;
  experience_description: string;
}

export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface WellnessContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  items: BenefitItem[];
  working_hours_image: string;
  categories: string[];
}

export interface FeatureItem {
  number: string;
  title: string;
  description: string;
}

export interface PremiumFeaturesContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  image_url: string;
  features: FeatureItem[];
}

export interface VideoContent {
  video_url: string;
  thumbnail_url: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

export interface PricingContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  plans: PricingPlan[];
}

export interface ContactContent {
  subtitle: string;
  title: string;
  title_italic: string;
  description: string;
  phone: string;
  phone2: string;
  email: string;
  address: string;
  hours: string;
  image_url: string;
}

export interface GalleryItem {
  image_url: string;
  alt: string;
  label: string;
}

export interface GalleryContent {
  show_gallery: boolean;
  items: GalleryItem[];
}

export interface FooterContent {
  brand_description: string;
  hours: string[];
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  whyChooseUs: WhyChooseUsContent;
  wellness: WellnessContent;
  premiumFeatures: PremiumFeaturesContent;
  video: VideoContent;
  pricing: PricingContent;
  contact: ContactContent;
  gallery: GalleryContent;
  footer: FooterContent;
}

export const defaultSiteContent: SiteContent = {
  hero: {
    subtitle: "Expérience Beauté Premium",
    title_line1: "Sublimez Votre",
    title_line2: "Beauté Quotidienne",
    description: "Pénétrez dans un monde d'élégance raffinée. Nos soins de luxe sont conçus pour révéler la version la plus radieuse de vous-même.",
    cta_text: "Réservez Votre Rendez-vous",
    image_url: "",
  },
  about: {
    subtitle: "À Propos",
    title: "Apportons ",
    title_italic: "relaxation et soin ensemble",
    description: "Nous sommes passionnés par l'aide apportée aux personnes pour atteindre un mode de vie plus sain et équilibré grâce à des soins spa professionnels et thérapies holistiques personnalisées.",
    feature1: "Des soins spa conçus pour détendre votre corps et votre esprit.",
    feature2: "Un environnement paisible allié à des soins d'expert",
    stat1_number: "100+",
    stat1_label: "Soins Spa de Luxe & Services",
    stat2_number: "40+",
    stat2_label: "Thérapeutes Certifiés et Experts Spa",
    image_url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=750&fit=crop",
    image2_url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
    image3_url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop",
  },
  services: {
    subtitle: "Nos Services",
    title: "Découvrez notre spa ",
    title_italic: "de luxe et nos services",
    description: "Des massages apaisants aux soins visage revitalisants, nos services sont conçus pour sublimer votre beauté, favoriser la guérison et améliorer votre bien-être général.",
    items: [
      {
        number: "01",
        icon: "Stone",
        title: "Thérapie aux Pierres Chaudes",
        description: "Des pierres chaudes sont doucement placées sur les points clés du corps pour soulager les tensions et favoriser une relaxation profonde.",
        image_url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
      },
      {
        number: "02",
        icon: "Face",
        title: "Soin du Visage",
        description: "Rajeunissez votre peau avec nos soins visage luxueux qui nettoient, exfolient et nourrissent en profondeur.",
        image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      },
      {
        number: "03",
        icon: "Hands",
        title: "Massage Suédois",
        description: "Un massage doux mais efficace qui améliore la circulation sanguine, réduit le stress et favorise le bien-être général.",
        image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      },
      {
        number: "04",
        icon: "Spa",
        title: "Aromathérapie",
        description: "Des huiles essentielles et des techniques de massage douces pour favoriser la relaxation et le bien-être émotionnel.",
        image_url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      },
    ],
    rating: "4.8/5",
    users: "40,000+",
  },
  whyChooseUs: {
    subtitle: "Pourquoi Nous Choisir",
    title: "L'endroit parfait pour la ",
    title_italic: "relaxation et la régénération",
    description: "Notre équipe de thérapeutes professionnels s'engage à vous fournir les soins spa de la plus haute qualité. Nous utilisons uniquement les meilleurs produits et techniques pour garantir votre satisfaction totale.",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=700&fit=crop",
    since_year: "2015",
    certified_title: "Thérapeutes Certifiés",
    certified_description: "Notre équipe de thérapeutes professionnels est hautement formée et certifiée pour offrir les meilleurs soins spa.",
    experience_years: "25+",
    experience_description: "Années d'expérience dans l'industrie du spa et du bien-être",
  },
  wellness: {
    subtitle: "Bienfaits du Wellness",
    title: "Découvrez la ",
    title_italic: "différence",
    description: "Du soulagement du stress à l'amélioration de la circulation, en passant par la santé de la peau et le bien-être général, nos soins offrent des bienfaits durables.",
    items: [
      {
        icon: "Sparkles",
        title: "Santé de la Peau Améliorée",
        description: "Nos soins aident à améliorer la texture de la peau, réduisent les signes de l'âge et favorisent un éclat sain.",
        features: ["Nettoyage profond & hydratation", "Traitements anti-âge", "Régénération cutanée"],
      },
      {
        icon: "Heart",
        title: "Relaxation Profonde",
        description: "Nos soins spa aident à réduire le stress, à soulager les tensions musculaires et à favoriser le bien-être général.",
        features: ["Thérapie anti-stress", "Libération des tensions musculaires", "Clarté mentale"],
      },
    ],
    working_hours_image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    categories: ["Soins Spa", "Beauté et Bien-être", "Services Spa Premium", "Massage Relaxant"],
  },
  premiumFeatures: {
    subtitle: "Nos Atouts",
    title: "Des fonctionnalités ",
    title_italic: "qui nous distinguent",
    description: "Des thérapeutes qualifiés aux environnements spa apaisants, nos atouts sont conçus pour créer une expérience relaxante et régénérante pour chaque client.",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=500&fit=crop",
    features: [
      {
        number: "01",
        title: "Thérapeutes Professionnels & Certifiés",
        description: "Nos thérapeutes expérimentés fournissent des soins d'expert, garantissant que chaque traitement est adapté à vos besoins spécifiques.",
      },
      {
        number: "02",
        title: "Produits Naturels & Écologiques",
        description: "Nous utilisons uniquement des produits naturels, biologiques et écologiques, doux pour votre peau et l'environnement.",
      },
      {
        number: "03",
        title: "Environnement Calme & Luxueux",
        description: "Notre spa est conçu pour offrir une atmosphère tranquille où vous pouvez vous détendre complètement.",
      },
      {
        number: "04",
        title: "Traitements Personnalisés",
        description: "Chaque traitement est personnalisé pour répondre à vos besoins et préférences uniques pour les meilleurs résultats.",
      },
    ],
  },
  video: {
    video_url: "",
    thumbnail_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=600&fit=crop",
  },
  pricing: {
    subtitle: "Nos Forfaits",
    title: "Choisissez le ",
    title_italic: "forfait parfait",
    description: "Que vous cherchiez une session de relaxation rapide ou une retraite spa complète, nos forfaits flexibles sont conçus pour répondre à vos besoins et budget.",
    plans: [
      {
        name: "Forfait Essentiel",
        price: "199,00 €",
        period: "mensuel",
        features: [
          "Thérapie Tête & Épaules",
          "Massage Corps Complet 60 Min",
          "Soin Visage Essentiel",
          "Accès Sauna & Hammam",
        ],
        popular: false,
      },
      {
        name: "Forfait Premium",
        price: "289,00 €",
        period: "mensuel",
        features: [
          "Thérapie Tête & Épaules",
          "Massage Corps Complet 90 Min",
          "Soin Visage Premium",
          "Accès à Toutes les Installations",
          "Session d'Aromathérapie",
        ],
        popular: true,
      },
    ],
  },
  contact: {
    subtitle: "Prenez Rendez-vous",
    title: "Détendez-vous & ",
    title_italic: "Ressourcez-vous",
    description: "Nos thérapeutes professionnels offrent des soins personnalisés qui vous aident à vous détendre, réduire le stress et rétablir l'équilibre de votre esprit et de votre corps.",
    phone: "0728729792",
    phone2: "",
    email: "contact@spadetente.com",
    address: "31.6393154, -8.0220954, Maroc",
    hours: "Tous les jours : 11h00 - 23h00",
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=400&fit=crop",
  },
  gallery: {
    show_gallery: true,
    items: [
      { image_url: "", alt: "Coloration balayage", label: "Coloration" },
      { image_url: "", alt: "Art floral sur ongles", label: "Manucure" },
      { image_url: "", alt: "Soin facial spa", label: "Rituel Spa" },
      { image_url: "", alt: "Coiffure de mariage", label: "Coiffure Mariage" },
      { image_url: "", alt: "Produits de maquillage", label: "Maquillage" },
      { image_url: "", alt: "Pédicure de luxe", label: "Pédicure" },
    ],
  },
  footer: {
    brand_description: "Là où l'élégance rencontre l'expertise. Un sanctuaire de beauté créé pour la femme moderne.",
    hours: ["Tous les jours : 11h00 - 23h00"],
    address: "31.6393154, -8.0220954, Maroc",
    phone: "0728729792",
    email: "contact@spadetente.com",
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // One-time migration: fix stale contact/footer values seeded before the real info was known.
        const fixRow = async (key: string, overrides: Record<string, any>) => {
          const row = await turso.execute("SELECT content FROM site_content WHERE section_key = ?", [key]);
          if (row.rows.length === 0) return;
          const parsed = JSON.parse((row.rows[0] as { content: string }).content);
        const updated = { ...parsed, ...overrides };
          await turso.execute(
            "UPDATE site_content SET content = ?, updated_at = ? WHERE section_key = ?",
            [JSON.stringify(updated), new Date().toISOString(), key]
          );
        };
        await fixRow("contact", { phone: "0728729792", email: "contact@spadetente.com", address: "31.6393154, -8.0220954, Maroc", hours: "Tous les jours : 11h00 - 23h00" });
        await fixRow("footer", { phone: "0728729792", email: "contact@spadetente.com", address: "31.6393154, -8.0220954, Maroc", hours: ["Tous les jours : 11h00 - 23h00"] });

        const result = await turso.execute("SELECT section_key, content FROM site_content");
        const data = result.rows as { section_key: string; content: string }[];
        if (data && data.length > 0) {
          const merged = JSON.parse(JSON.stringify(defaultSiteContent)) as SiteContent;
          data.forEach((row) => {
            const key = row.section_key as keyof SiteContent;
            if (key in merged) {
              const dbContent = JSON.parse(row.content);
              const target = merged[key] as Record<string, any>;
              for (const k of Object.keys(dbContent)) {
                if (dbContent[k] !== null && typeof dbContent[k] === "object" && !Array.isArray(dbContent[k]) && typeof target[k] === "object" && !Array.isArray(target[k])) {
                  target[k] = { ...target[k], ...dbContent[k] };
                } else {
                  target[k] = dbContent[k];
                }
              }
            }
          });
          setContent(merged);
        }
      } catch (e) {
        console.error("[useSiteContent] Failed to load from DB:", e);
        // Use defaults if DB unavailable
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { content, loading };
};

export const saveSectionContent = async (sectionKey: string, content: any) => {
  try {
    await turso.execute(
      "INSERT INTO site_content (section_key, content, updated_at) VALUES (?, ?, ?) ON CONFLICT(section_key) DO UPDATE SET content = ?, updated_at = ?",
      [sectionKey, JSON.stringify(content), new Date().toISOString(), JSON.stringify(content), new Date().toISOString()]
    );
    return { error: null };
  } catch (e) {
    return { error: e as Error };
  }
};

export const uploadSiteImage = async (file: File, _path: string) => {
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Échec de la lecture du fichier"));
      reader.readAsDataURL(file);
    });
    return { url: dataUrl, error: null };
  } catch (e) {
    return { url: null, error: e as Error };
  }
};

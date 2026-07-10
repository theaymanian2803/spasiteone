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
  image_url: string;
}

export interface GalleryItem {
  image_url: string;
  alt: string;
  label: string;
}

export interface GalleryContent {
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
    subtitle: "Premium Beauty Experience",
    title_line1: "Elevate Your",
    title_line2: "Everyday Beauty",
    description: "Step into a world of refined elegance. Our luxurious treatments are designed to reveal the most radiant version of you.",
    cta_text: "Book Your Appointment",
    image_url: "",
  },
  about: {
    subtitle: "About Us",
    title: "Bringing our, relaxation and ",
    title_italic: "care together",
    description: "We are passionate about helping people achieve a healthier and more balanced life style through professional spa treatments and holistic our therapies. Through personalized spa treatments.",
    feature1: "Spa treatments designed to relax your body and mind.",
    feature2: "A peaceful environment combined with expert care",
    stat1_number: "100+",
    stat1_label: "Luxury Spa Treatments & our Services",
    stat2_number: "40+",
    stat2_label: "Certified our Therapists and Spa Experts",
    image_url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=750&fit=crop",
    image2_url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
    image3_url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop",
  },
  services: {
    subtitle: "Our Services",
    title: "Discover our luxurious spa ",
    title_italic: "and our services",
    description: "From soothing massages to revitalizing facial treatments, our services are designed to enhance your beauty, promote healing, and improve overall well-being.",
    items: [
      {
        number: "01",
        icon: "Stone",
        title: "Hot Stone Therapy",
        description: "Warm stones are gently placed on key points of the body to relieve tension and promote deep relaxation.",
        image_url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
      },
      {
        number: "02",
        icon: "Face",
        title: "Facial Skin Treatment",
        description: "Rejuvenate your skin with our luxurious facial treatments that cleanse, exfoliate, and nourish.",
        image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      },
      {
        number: "03",
        icon: "Hands",
        title: "Swedish Massage",
        description: "Gentle yet effective massage that enhances blood flow, reduces stress, and promotes overall wellness.",
        image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      },
      {
        number: "04",
        icon: "Spa",
        title: "Aromatherapy",
        description: "Essential oils and gentle massage techniques to promote relaxation and emotional well-being.",
        image_url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      },
    ],
    rating: "4.8/5",
    users: "40,000+",
  },
  whyChooseUs: {
    subtitle: "Why Choose Us",
    title: "The perfect place to ",
    title_italic: "relaxation and rejuvenation",
    description: "Our team of professional therapists is committed to providing you with the highest quality spa treatments. We use only the finest products and techniques to ensure your complete satisfaction.",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=700&fit=crop",
    since_year: "2015",
    certified_title: "Certified Our Therapists",
    certified_description: "Our team of professional therapists is highly trained and certified to provide the best spa treatments.",
    experience_years: "25+",
    experience_description: "Years of experience in spa and wellness industry",
  },
  wellness: {
    subtitle: "Wellness Benefits",
    title: "Experience the ",
    title_italic: "difference",
    description: "From reducing stress and improving circulation to enhancing skin health and overall well-being, our treatments provide lasting benefits.",
    items: [
      {
        icon: "Sparkles",
        title: "Improved Skin Health",
        description: "Our treatments help improve skin texture, reduce signs of aging, and promote a healthy glow.",
        features: ["Deep cleansing & hydration", "Anti-aging treatments", "Skin rejuvenation"],
      },
      {
        icon: "Heart",
        title: "Deep Relaxation",
        description: "Our spa treatments help reduce stress, ease muscle tension, and promote overall well-being.",
        features: ["Stress relief therapy", "Muscle tension release", "Mental clarity"],
      },
    ],
    working_hours_image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    categories: ["Spa Treatments", "Beauty and Wellness", "Premium Spa Services", "Relaxing Massage"],
  },
  premiumFeatures: {
    subtitle: "Our Core Features",
    title: "Premium features ",
    title_italic: "that set us apart",
    description: "From skilled therapists to calming spa environments, our core features are designed to create a relaxing and rejuvenating experience for every client.",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=500&fit=crop",
    features: [
      {
        number: "01",
        title: "Professional & Certified Therapists",
        description: "Our experienced therapists provide expert care, ensuring each treatment is tailored to your specific needs.",
      },
      {
        number: "02",
        title: "Natural & Eco-Friendly Products",
        description: "We use only natural, organic, and eco-friendly products that are gentle on your skin and the environment.",
      },
      {
        number: "03",
        title: "Calm & Luxurious Environment",
        description: "Our spa is designed to provide a tranquil atmosphere where you can fully relax and unwind.",
      },
      {
        number: "04",
        title: "Personalized Our Treatments",
        description: "Every treatment is customized to meet your unique needs and preferences for the best results.",
      },
    ],
  },
  video: {
    video_url: "",
    thumbnail_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=600&fit=crop",
  },
  pricing: {
    subtitle: "Our Pricing Plans",
    title: "Choose the ",
    title_italic: "perfect plan",
    description: "Whether you're looking for a quick relaxation session or a complete spa retreat, our flexible packages are designed to suit your needs and budget.",
    plans: [
      {
        name: "Basic Package",
        price: "$199.00",
        period: "monthly",
        features: [
          "Head & Shoulder Therapy",
          "60 Minute Full Body Massage",
          "Basic Facial Treatment",
          "Access to Sauna & Steam Room",
        ],
        popular: false,
      },
      {
        name: "Premium Package",
        price: "$289.00",
        period: "monthly",
        features: [
          "Head & Shoulder Therapy",
          "90 Minute Full Body Massage",
          "Premium Facial Treatment",
          "Access to All Spa Facilities",
          "Aromatherapy Session",
        ],
        popular: true,
      },
    ],
  },
  contact: {
    subtitle: "Book An Appointment",
    title: "Relax & ",
    title_italic: "Refresh",
    description: "Our professional therapists provide personalized treatments that help you relax, reduce stress, and restore balance to your mind and body.",
    phone: "+012 456 789",
    phone2: "+012 456 789",
    email: "info@spasalon.com",
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=400&fit=crop",
  },
  gallery: {
    items: [
      { image_url: "", alt: "Balayage hair color", label: "Hair Color" },
      { image_url: "", alt: "Rose gold nail art", label: "Nail Art" },
      { image_url: "", alt: "Spa facial treatment", label: "Spa Ritual" },
      { image_url: "", alt: "Bridal updo hairstyle", label: "Bridal Hair" },
      { image_url: "", alt: "Makeup products flat lay", label: "Makeup" },
      { image_url: "", alt: "Luxury pedicure setup", label: "Pedicure" },
    ],
  },
  footer: {
    brand_description: "Where elegance meets expertise. A sanctuary of beauty crafted for the modern woman.",
    hours: ["Mon – Fri: 9:00 – 20:00", "Saturday: 10:00 – 18:00", "Sunday: Closed"],
    address: "128 Rue de la Beauté, Paris",
    phone: "+33 1 23 45 67 89",
    email: "hello@lumiere-salon.com",
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
        const result = await turso.execute("SELECT section_key, content FROM site_content");
        const data = result.rows as { section_key: string; content: string }[];
        if (data && data.length > 0) {
          const merged = { ...defaultSiteContent };
          data.forEach((row) => {
            const key = row.section_key as keyof SiteContent;
            if (key in merged) {
              merged[key] = { ...merged[key], ...JSON.parse(row.content) };
            }
          });
          setContent(merged);
        }
      } catch {
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
  const url = URL.createObjectURL(file);
  return { url, error: null };
};

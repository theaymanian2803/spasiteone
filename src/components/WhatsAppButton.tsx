import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "212728729792";
  const message = encodeURIComponent(
    "Bienvenue chez Pause Spa Détente, comment pouvons-nous vous aider ?"
  );
  const href = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300"
    >
      <MessageCircle size={26} className="fill-white" />
    </a>
  );
};

export default WhatsAppButton;
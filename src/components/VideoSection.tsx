import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { VideoContent } from "@/hooks/useSiteContent";

interface Props {
  content: VideoContent;
}

const VideoSection = ({ content }: Props) => {
  return (
    <section className="py-0">
      <motion.div
        className="relative h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={content.thumbnail_url}
          alt="Spa video"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={32} className="text-primary ml-1" fill="currentColor" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;

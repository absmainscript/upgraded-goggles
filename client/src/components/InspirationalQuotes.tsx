/**
 * InspirationalQuotes.tsx
 * 
 * Seção de frases inspiracionais sobre saúde mental
 * Carrossel automático com citações motivacionais
 * Efeitos de fade in/out suaves entre as frases
 * Contribui para engajamento emocional do usuário
 */

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteConfig } from "@shared/schema";
import { processTextWithGradient, processBadgeWithGradient } from "@/utils/textGradient";
import { apiRequest } from "@/lib/queryClient";

export function InspirationalQuotes() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Busca configurações das citações
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/config");
      return response.json();
    },
  });

  // Extrair configurações da seção inspiracional
  const inspirationalSection = configs?.find((c: any) => c.key === 'inspirational_section')?.value as any || {};

  // Obtém o gradiente dos badges
  const badgeGradient = configs?.find(c => c.key === 'badge_gradient')?.value?.gradient;

  // Extrair quote e author dos dados
  const quote = inspirationalSection.quote || "A transformação começa quando decidimos cuidar de nós mesmos.";
  const author = inspirationalSection.author || "Dra. Adrielle Benhossi";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="inspirational" data-section="inspirational" className="main-section relative overflow-hidden" ref={ref} style={{ margin: 0, padding: 0 }}>
      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="glass p-6 sm:p-12 rounded-3xl max-w-4xl mx-auto hover:scale-105 transition-all duration-300 cursor-pointer">
              <Quote className="text-4xl text-coral mb-6 mx-auto" size={48} />
              <blockquote className="font-display text-lg sm:text-2xl md:text-3xl text-gray-700 font-light leading-relaxed mb-6">
                "{quote}"
              </blockquote>
              <div className="w-16 h-1 bg-gradient-to-r from-coral to-purple-soft mx-auto mb-4"></div>
              <cite className="text-gray-500 text-lg">{author}</cite>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default InspirationalQuotes;
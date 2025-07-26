/**
 * AboutSection.tsx
 * 
 * Seção "Sobre a Psicóloga" do site
 * Apresenta informações profissionais, qualificações e abordagem terapêutica
 * Contém cards com especialidades e animações de entrada suave
 * Utiliza Intersection Observer para ativar animações ao rolar a página
 */

import { motion } from "framer-motion";
import { 
  Brain, 
  Heart, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  CheckCircle,
  Camera,
  Stethoscope, Activity, Zap, Shield, Target,
  UserPlus, UserCheck, UserX, UserCog, Sun, Moon, Sparkles,
  MessageCircle, MessageSquare, Mic, Volume2, TrendingUp, BarChart, PieChart, Gauge,
  Leaf, Flower, TreePine, Wind, Handshake, HelpCircle, LifeBuoy, Umbrella,
  Home, Gamepad2, Puzzle, Palette, Footprints, Waves, Mountain, Compass,
  Timer, Calendar, Hourglass
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { processTextWithGradient, processBadgeWithGradient } from "@/utils/textGradient";
import Avatar from "./Avatar";
import type { Specialty } from "@shared/schema";

export function AboutSection() {
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/config");
      return response.json();
    },
  });

  const heroImage = configs?.find((c: any) => c.key === "hero_image");
  const customImage = heroImage?.value?.path || null;

  const generalInfo = configs?.find((c: any) => c.key === "general_info")?.value as any || {};
  // Obtém dados das configurações
  const aboutSection = configs?.find((c: any) => c.key === 'about_section')?.value as any || {};
  const badgeGradient = configs?.find(c => c.key === 'badge_gradient')?.value?.gradient;
  const currentCrp = generalInfo.crp || "08/123456";
  const aboutText = aboutSection.description || "";

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <section 
      id="about" 
      data-section="about" 
      className="relative py-16 lg:py-24 bg-gradient-to-br from-white via-slate-50/30 to-white overflow-hidden" 
      style={{ margin: 0, padding: 0 }}
      ref={ref}
    >
      {/* Background elements ultra sutis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-rose-50/20 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-50/20 to-transparent rounded-full blur-3xl transform translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Container principal com design moderno */}
          <div className="max-w-5xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-16 lg:space-y-20"
            >

              {/* Header principal - design ultra clean */}
              <div className="text-center space-y-8">
                {/* Nome principal com tratamento tipográfico refinado */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="space-y-6"
                >
                  <h2 className="font-light text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-slate-800 tracking-tight leading-[0.9] mb-8">
                    {processTextWithGradient(generalInfo.name || "Dra. (Adrielle Benhossi)", badgeGradient)}
                  </h2>

                  {/* Linha divisória elegante */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-300 to-purple-300"></div>
                    <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  </div>

                  {/* Título profissional e CRP com layout refinado */}
                  <div className="space-y-2">
                    <p className="text-slate-700 font-medium text-xl sm:text-2xl lg:text-3xl tracking-wide">
                      {(() => {
                        const professionalTitleInfo = configs?.find((c: any) => c.key === "professional_title")?.value as any || {};
                        return professionalTitleInfo.title || "Psicóloga Clínica";
                      })()}
                    </p>
                    <p className="text-slate-500 text-lg sm:text-xl font-light tracking-widest uppercase">
                      CRP: {currentCrp}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Descrição com tipografia melhorada */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center space-y-6">
                  {(aboutText || "Este é o espaço para escrever sobre você no painel administrativo.")
                    .split('\n')
                    .map((paragraph, index) => (
                      <p key={index} className="text-slate-600 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed tracking-wide">
                        {paragraph}
                      </p>
                    ))
                  }
                </div>
              </motion.div>

              {/* Cards de credenciais - Design completamente novo */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
                className="space-y-8"
              >
                {/* Grid responsivo com espaçamento otimizado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {(() => {
                    const aboutCredentials = configs?.find((c: any) => c.key === "about_credentials")?.value as any[] || [];
                    const activeCredentials = aboutCredentials
                      .filter(cred => cred.isActive !== false)
                      .sort((a, b) => (a.order || 0) - (b.order || 0));

                    // Função para obter estilos do card baseado no gradiente configurado no painel
                    const getCardStyle = (credential: any, index: number) => {
                      if (credential && credential.gradient) {
                        // Mapear gradientes do painel para cores específicas
                        const gradientColorMap = {
                          "from-pink-50 to-purple-50": { backgroundColor: "#fdf2f8", borderColor: "#fbcfe8", accentColor: "#ec4899" },
                          "from-purple-50 to-indigo-50": { backgroundColor: "#faf5ff", borderColor: "#e9d5ff", accentColor: "#8b5cf6" },
                          "from-green-50 to-teal-50": { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", accentColor: "#10b981" },
                          "from-blue-50 to-cyan-50": { backgroundColor: "#eff6ff", borderColor: "#bfdbfe", accentColor: "#06b6d4" },
                          "from-orange-50 to-red-50": { backgroundColor: "#fff7ed", borderColor: "#fed7aa", accentColor: "#f97316" },
                          "from-yellow-50 to-orange-50": { backgroundColor: "#fffbeb", borderColor: "#fde68a", accentColor: "#f59e0b" },
                          "from-teal-50 to-green-50": { backgroundColor: "#f0fdfa", borderColor: "#99f6e4", accentColor: "#14b8a6" },
                          "from-indigo-50 to-purple-50": { backgroundColor: "#eef2ff", borderColor: "#c7d2fe", accentColor: "#6366f1" },
                          "from-gray-50 to-slate-50": { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", accentColor: "#6b7280" },
                          "from-pink-50 to-pink-100": { backgroundColor: "#fdf2f8", borderColor: "#fce7f3", accentColor: "#ec4899" }
                        };

                        return gradientColorMap[credential.gradient as keyof typeof gradientColorMap] || 
                               { backgroundColor: "#fefefe", borderColor: "#f1f5f9", accentColor: "#ec4899" };
                      }

                      // Cores padrão caso não tenha gradiente configurado
                      const defaultColors = [
                        { backgroundColor: "#fdf2f8", borderColor: "#fbcfe8", accentColor: "#ec4899" },
                        { backgroundColor: "#faf5ff", borderColor: "#e9d5ff", accentColor: "#8b5cf6" },
                        { backgroundColor: "#eff6ff", borderColor: "#bfdbfe", accentColor: "#06b6d4" },
                        { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", accentColor: "#10b981" },
                        { backgroundColor: "#fffbeb", borderColor: "#fde68a", accentColor: "#f59e0b" },
                        { backgroundColor: "#fff7ed", borderColor: "#fed7aa", accentColor: "#ef4444" }
                      ];
                      return defaultColors[index % defaultColors.length];
                    };

                    if (activeCredentials.length === 0) {
                      // Cards padrão com cores do painel
                      return (
                        <>
                          <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="group relative overflow-hidden backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center h-full flex flex-col"
                            style={{
                              backgroundColor: getCardStyle(null, 0).backgroundColor,
                              borderColor: getCardStyle(null, 0).borderColor,
                              border: `1px solid ${getCardStyle(null, 0).borderColor}`
                            }}
                          >
                            {/* Gradient accent */}
                            <div 
                              className="absolute top-0 left-0 w-full h-px"
                              style={{
                                background: `linear-gradient(to right, transparent, ${getCardStyle(null, 0).accentColor}, transparent)`
                              }}
                            ></div>
                            <div 
                              className="absolute top-4 right-4 w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: getCardStyle(null, 0).accentColor }}
                            ></div>

                            <div className="space-y-4 text-center flex-1 flex flex-col justify-between">
                              <h3 className="font-semibold text-slate-800 text-xl leading-tight">Centro Universitário Integrado</h3>
                              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-auto">Formação Acadêmica</p>
                            </div>
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="group relative overflow-hidden backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center h-full flex flex-col"
                            style={{
                              backgroundColor: getCardStyle(null, 1).backgroundColor,
                              borderColor: getCardStyle(null, 1).borderColor,
                              border: `1px solid ${getCardStyle(null, 1).borderColor}`
                            }}
                          >
                            {/* Gradient accent */}
                            <div 
                              className="absolute top-0 left-0 w-full h-px"
                              style={{
                                background: `linear-gradient(to right, transparent, ${getCardStyle(null, 1).accentColor}, transparent)`
                              }}
                            ></div>
                            <div 
                              className="absolute top-4 right-4 w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: getCardStyle(null, 1).accentColor }}
                            ></div>

                            <div className="space-y-4 text-center flex-1 flex flex-col justify-between">
                              <h3 className="font-semibold text-slate-800 text-xl leading-tight">Terapia Cognitivo-Comportamental</h3>
                              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-auto">Abordagem Terapêutica</p>
                            </div>
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="group relative overflow-hidden backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:col-span-2 lg:col-span-1 text-center h-full flex flex-col"
                            style={{
                              backgroundColor: getCardStyle(null, 2).backgroundColor,
                              borderColor: getCardStyle(null, 2).borderColor,
                              border: `1px solid ${getCardStyle(null, 2).borderColor}`
                            }}
                          >
                            {/* Gradient accent */}
                            <div 
                              className="absolute top-0 left-0 w-full h-px"
                              style={{
                                background: `linear-gradient(to right, transparent, ${getCardStyle(null, 2).accentColor}, transparent)`
                              }}
                            ></div>
                            <div 
                              className="absolute top-4 right-4 w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: getCardStyle(null, 2).accentColor }}
                            ></div>

                            <div className="space-y-4 text-center flex-1 flex flex-col justify-between">
                              <h3 className="font-semibold text-slate-800 text-xl leading-tight">Escuta clínica em Inglês</h3>
                              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-auto">Espaço terapêutico bilíngue</p>
                            </div>
                          </motion.div>
                        </>
                      );
                    }

                    return activeCredentials.map((credential: any, index: number) => (
                      <motion.div 
                        key={credential.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.7 + (index * 0.1) }}
                        className="group relative overflow-hidden backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center h-full flex flex-col"
                        style={{
                          backgroundColor: getCardStyle(credential, index).backgroundColor,
                          borderColor: getCardStyle(credential, index).borderColor,
                          border: `1px solid ${getCardStyle(credential, index).borderColor}`
                        }}
                      >
                        {/* Gradient accent */}
                        <div 
                          className="absolute top-0 left-0 w-full h-px"
                          style={{
                            background: `linear-gradient(to right, transparent, ${getCardStyle(credential, index).accentColor}, transparent)`
                          }}
                        ></div>
                        <div 
                          className="absolute top-4 right-4 w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: getCardStyle(credential, index).accentColor }}
                        ></div>

                        <div className="space-y-4 text-center flex-1 flex flex-col justify-between">
                          <h3 className="font-semibold text-slate-800 text-xl leading-tight">{credential.title}</h3>
                          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-auto">{credential.subtitle}</p>
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
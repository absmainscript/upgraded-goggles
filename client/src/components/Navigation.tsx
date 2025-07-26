/**
 * Navigation.tsx
 * 
 * Barra de navegação responsiva do site
 * Funcionalidades: menu fixo, navegação smooth scroll, menu mobile hambúrguer
 * Contém informações profissionais da psicóloga (nome, CRP, avatar)
 */

import { useState, useEffect } from "react"; // Hooks do React
import { AlignJustify, X, Mail, MapPin, Clock, MessageCircle } from "lucide-react"; // Ícones para menu mobile
import { Avatar } from "./Avatar"; // Componente do avatar
import { useQuery } from "@tanstack/react-query"; // Para buscar configurações
import { useSectionVisibility } from "@/hooks/useSectionVisibility"; // Para controlar visibilidade das seções

export function Navigation() {
  // Buscar configurações do site incluindo a imagem do hero
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/config");
      return response.json();
    },
  });

  // Hook para verificar visibilidade das seções
  const { 
    isAboutVisible, 
    isServicesVisible, 
    isTestimonialsVisible, 
    isContactVisible,
    isSpecialtiesVisible,
    isGalleryVisible,
    isFaqVisible,
    isInspirationalVisible
  } = useSectionVisibility();

  // Extrair a imagem personalizada do hero se disponível
  const heroImage = configs?.find((c: any) => c.key === 'hero_image');
  const customImage = heroImage?.value?.path || null;

  // Extrair CRP das configurações
  const generalInfo = configs?.find((c: any) => c.key === 'general_info')?.value as any || {};
  const currentCrp = generalInfo.crp || "08/123456";

  // Estado para controlar se a página foi rolada (muda aparência da nav)
  const [isScrolled, setIsScrolled] = useState(false);
  // Estado para controlar se menu mobile está aberto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect para detectar scroll da página
  useEffect(() => {
    const handleScroll = () => {
      // Ativa fundo opaco após rolar 100px
      setIsScrolled(window.scrollY > 100);
    };

    // Adiciona listener de scroll
    window.addEventListener("scroll", handleScroll);
    // Remove listener quando componente é desmontado
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/20 backdrop-blur-xl border-b border-gray-200/40 shadow-lg shadow-purple-100/20" 
            : "bg-white/10 backdrop-blur-md border-b border-gray-200/30"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 max-w-7xl relative">
          <div className="flex items-center justify-center sm:justify-between w-full">
            {/* Avatar no canto esquerdo - apenas mobile */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:hidden">
              {customImage ? (
                <img 
                  src={customImage} 
                  alt="Dra. Adrielle" 
                  className="w-7 h-7 rounded-full object-cover border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-300 shadow-sm flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                  <svg viewBox="0 0 40 40" className="w-5 h-5">
                    <path d="M 20 8 Q 25 8 28 12 Q 30 15 30 20 Q 30 24 28 26 Q 25 28 22 28 Q 20 30 18 28 Q 15 26 15 20 Q 15 15 18 12 Q 20 8 20 8 Z" 
                          fill="#9ca3af" opacity="0.7"/>
                    <path d="M 12 28 Q 15 26 20 26 Q 25 26 28 28 Q 30 30 30 34 L 10 34 Q 10 30 12 28 Z" 
                          fill="#9ca3af" opacity="0.7"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Nome centralizado */}
            {/* Avatar e nome para desktop - canto esquerdo com foto maior */}
            <div className="hidden sm:flex items-center space-x-4">
              {/* 
                SUBSTITUIÇÃO POR PNG - HEADER:
                Para usar foto PNG, substitua por:
                <img 
                  src="/sua-foto-header.png" 
                  alt="Dra. Adrielle" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                />
              */}
              {customImage ? (
                <img 
                  src={customImage} 
                  alt="Dra. Adrielle" 
                  className="w-14 h-14 rounded-full object-cover border-3 border-white/60 shadow-xl shadow-purple-200/30 ring-2 ring-purple-100/50"
                />
              ) : (
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-white/60 shadow-xl shadow-purple-200/30 ring-2 ring-purple-100/50 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <path d="M 20 8 Q 25 8 28 12 Q 30 15 30 20 Q 30 24 28 26 Q 25 28 22 28 Q 20 30 18 28 Q 15 26 15 20 Q 15 15 18 12 Q 20 8 20 8 Z" 
                          fill="#d1c4e9" opacity="0.8"/>
                    <path d="M 12 28 Q 15 26 20 26 Q 25 26 28 28 Q 30 30 30 34 L 10 34 Q 10 30 12 28 Z" 
                          fill="#d1c4e9" opacity="0.8"/>
                  </svg>
                </div>
              )}
              <div>
                <div className="font-display font-medium text-base md:text-lg text-gray-600 drop-shadow-sm">
                  {generalInfo?.headerName || "Dra. Adrielle Benhossi"}
                </div>
                <div className="text-xs text-gray-500 font-light drop-shadow-sm">
                  CRP {currentCrp}
                </div>
              </div>
            </div>

            {/* Apenas nome centralizado no mobile */}
            <div className="sm:hidden text-center">
              <div className="font-display font-medium text-base text-gray-500">
                {generalInfo?.headerName || "Dra. Adrielle Benhossi"}
              </div>
              <div className="text-xs text-gray-400 font-light">
                CRP {currentCrp}
              </div>
            </div>

            {/* Menu desktop - no canto direito */}
            <div className="hidden md:flex space-x-8 text-sm font-light text-gray-600">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-purple-soft transition-colors duration-300"
              >
                Início
              </button>
              {isAboutVisible && (
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-purple-soft transition-colors duration-300"
                >
                  Sobre
                </button>
              )}
              {isServicesVisible && (
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-purple-soft transition-colors duration-300"
                >
                  Serviços
                </button>
              )}
              {isTestimonialsVisible && (
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="hover:text-purple-soft transition-colors duration-300"
                >
                  Depoimentos
                </button>
              )}
              {isContactVisible && (
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-purple-soft transition-colors duration-300"
                >
                  Contato
                </button>
              )}
            </div>

            {/* Botão menu mobile aesthetic */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 md:hidden text-gray-600 hover:text-purple-500 transition-all duration-300 p-1.5 rounded-xl hover:bg-white/40 backdrop-blur-sm group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={16} className="transition-transform duration-300 rotate-90" />
              ) : (
                <div className="w-4 h-4 flex flex-col justify-center items-center space-y-1 transition-all duration-300">
                  <div className="w-4 h-0.5 bg-current rounded-full transform transition-all duration-300 group-hover:rotate-3 group-hover:w-3.5"></div>
                  <div className="w-4 h-0.5 bg-current rounded-full transform transition-all duration-300 group-hover:w-5"></div>
                  <div className="w-3 h-0.5 bg-current rounded-full transform transition-all duration-300 group-hover:-rotate-3 group-hover:w-3.5"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Enhanced */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-l border-white/30">
            <div className="p-6 pt-20">
              {/* Header do menu */}
              <div className="mb-8 text-center">
                <h3 className="font-display font-medium text-2xl text-gray-700 mb-2">Navegação</h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full"></div>
              </div>

              <nav className="space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                >
                  <span className="font-medium">Início</span>
                </button>

                {isAboutVisible && (
                  <button
                    onClick={() => scrollToSection("about")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Sobre</span>
                  </button>
                )}

                {isSpecialtiesVisible && (
                  <button
                    onClick={() => scrollToSection("specialties")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Especialidades</span>
                  </button>
                )}

                {isServicesVisible && (
                  <button
                    onClick={() => scrollToSection("services")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Serviços</span>
                  </button>
                )}

                {isGalleryVisible && (
                  <button
                    onClick={() => scrollToSection("gallery")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Galeria</span>
                  </button>
                )}

                {isTestimonialsVisible && (
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Depoimentos</span>
                  </button>
                )}

                {isInspirationalVisible && (
                  <button
                    onClick={() => scrollToSection("inspirational")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Inspirações</span>
                  </button>
                )}

                {isFaqVisible && (
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">FAQ</span>
                  </button>
                )}

                {isContactVisible && (
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="w-full text-left text-gray-600 hover:text-purple-500 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-purple-50/50 group border-l-2 border-transparent hover:border-purple-300"
                  >
                    <span className="font-medium">Contato</span>
                  </button>
                )}
              </nav>

              {/* Decoração no final do menu */}
              <div className="mt-8 text-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
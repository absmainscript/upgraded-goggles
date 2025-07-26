
/**
 * Footer.tsx
 * 
 * Rodapé do site com informações finais
 * Design moderno, minimalista e aesthetic com tema escuro
 * Layout em grid responsivo com glassmorphism e gradientes suaves
 * Avatar da psicóloga com indicador profissional
 */

import { FaWhatsapp, FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import { Star } from "lucide-react";
import { Avatar } from "./Avatar";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  // Buscar configurações do site incluindo a imagem do hero
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/config");
      return response.json();
    },
  });

  // Buscar configurações do footer
  const { data: footerSettings } = useQuery({
    queryKey: ["/api/footer-settings"],
    queryFn: async () => {
      const response = await fetch("/api/footer-settings");
      return response.json();
    },
  });

  // Extrair a imagem personalizada do hero se disponível
  const heroImage = configs?.find((c: any) => c.key === 'hero_image');
  const customImage = heroImage?.value?.path || null;

  // Extrair informações gerais das configurações
  const generalInfo = configs?.find((c: any) => c.key === 'general_info')?.value as any || {};
  const currentName = generalInfo.name || "Dra. Adrielle Benhossi";
  const currentCrp = generalInfo.crp || "08/123456";

  // Configurações do footer com fallbacks
  const footerData = footerSettings || {};
  const generalFooterInfo = footerData.general_info || {};
  const contactButtons = footerData.contact_buttons || [];
  const certificationItems = footerData.certification_items || [];
  const trustSeals = footerData.trust_seals || [];
  const bottomInfo = footerData.bottom_info || {};

  // Mapeamento de ícones
  const iconMap: Record<string, any> = {
    FaWhatsapp,
    FaInstagram, 
    FaLinkedin,
    FaFacebook,
    FaTwitter
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || FaWhatsapp;
  };

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-8 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-12 right-1/3 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Main content grid */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Brand section */}
            <div className="md:col-span-5 space-y-6">
              {/* Profile */}
              <div className="flex items-center space-x-4">
                {customImage ? (
                  <div className="relative">
                    <img 
                      src={customImage} 
                      alt={currentName} 
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10 shadow-2xl"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-2 h-2 text-slate-900" fill="currentColor" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10 shadow-2xl flex items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm">
                    <svg viewBox="0 0 48 48" className="w-10 h-10">
                      <path d="M 24 10 Q 30 10 34 15 Q 36 18 36 24 Q 36 28 34 31 Q 30 34 26 34 Q 24 36 22 34 Q 18 31 18 24 Q 18 18 22 15 Q 24 10 24 10 Z" 
                            fill="rgba(255,255,255,0.8)"/>
                      <path d="M 14 34 Q 18 32 24 32 Q 30 32 34 34 Q 36 36 36 42 L 12 42 Q 12 36 14 34 Z" 
                            fill="rgba(255,255,255,0.8)"/>
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-2 h-2 text-slate-900" fill="currentColor" />
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-xl text-white/95 mb-1">
                    {currentName}
                  </h3>
                  <p className="text-sm text-gray-400">CRP: {currentCrp}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                {generalFooterInfo.description || "Cuidando da sua saúde mental com carinho e dedicação"}
              </p>
            </div>

            {/* Contact section */}
            <div className="md:col-span-4 space-y-6">
              <h4 className="text-white/90 font-medium text-lg">Contato</h4>
              
              <div className="space-y-3">
                {contactButtons
                  .filter((button: any) => button.isActive)
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((button: any) => {
                    const IconComponent = getIconComponent(button.icon);
                    return (
                      <a
                        key={button.id}
                        href={button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${button.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                          <IconComponent className="text-white text-lg" />
                        </div>
                        <span className="text-sm font-medium">{button.label}</span>
                      </a>
                    );
                  })}
              </div>
            </div>

            {/* Trust seals and certifications */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-white/90 font-medium text-lg">Certificações</h4>
              
              {/* Trust seals */}
              <div className="flex flex-wrap gap-3">
                {trustSeals
                  .filter((seal: any) => seal.isActive)
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((seal: any) => (
                    <div 
                      key={seal.id}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ${
                        seal.label === "🔒" ? "bg-emerald-600" : `bg-gradient-to-r ${seal.gradient}`
                      }`}
                    >
                      <span className="text-white text-sm font-bold">{seal.label}</span>
                    </div>
                  ))}
              </div>

              {/* Certification text */}
              {bottomInfo.certificationText && (
                <div 
                  className="text-xs text-gray-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bottomInfo.certificationText }}
                />
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                {bottomInfo.copyright || `© 2024 ${currentName} • Todos os direitos reservados`}
              </p>
              
              {generalFooterInfo.showCnpj && generalFooterInfo.cnpj && (
                <p className="text-xs text-gray-400">
                  CNPJ: {generalFooterInfo.cnpj}
                </p>
              )}
            </div>

            {/* Made with love */}
            <div className="text-xs text-gray-400 flex items-center space-x-1">
              <span>Made with</span>
              <span className="text-pink-400 animate-pulse">♥</span>
              <span>and ☕ by</span>
              <span className="text-purple-400 font-medium">∞</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

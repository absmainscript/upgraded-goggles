/**
 * ContactSection.tsx
 * 
 * Seção de contato e agendamento do site
 * Contém botões para WhatsApp, Instagram e informações de localização
 * Links diretos para agendamento e redes sociais profissionais
 * Design moderno e minimalista com dois cards principais
 */

import { motion } from "framer-motion"; // Animações dos elementos de contato
import { FaWhatsapp, FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaTelegram, FaDiscord, FaSkype } from "react-icons/fa"; // Ícones das redes sociais
import { FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin, Clock } from "lucide-react"; // Ícones de contato
import { useEffect, useRef, useState } from "react"; // Controle de visibilidade
import { processTextWithGradient, processBadgeWithGradient, BADGE_GRADIENTS } from "@/utils/textGradient";
import { useQuery } from "@tanstack/react-query";

const iconMap: { [key: string]: any } = {
  FaWhatsapp: FaWhatsapp,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
  FaXTwitter: FaXTwitter,
  FaTwitter: FaTwitter,
  FaFacebook: FaFacebook,
  FaTelegram: FaTelegram,
  FaDiscord: FaDiscord,
  FaSkype: FaSkype,
  Mail: Mail,
  MapPin: MapPin,
  Clock: Clock,
};

interface ContactSettings {
  contact_items: any[];
  schedule_info: any;
  location_info: any;
}

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Buscar configurações do site
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
  });

  // Buscar configurações de contato
  const { data: contactSettings } = useQuery({
    queryKey: ["/api/contact-settings"],
  });

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

  // Extrair dados das configurações
  const contactItems = contactSettings?.contact_items || [];
  const scheduleInfo = contactSettings?.schedule_info || {};
  const locationInfo = contactSettings?.location_info || {};

  // Obter configuração da seção de contato
  const contactConfig = configs?.find((c: any) => c.key === 'contact_section')?.value || {
    title: "Vamos conversar?",
    description: "Se algo dentro de você pede cuidado, atenção ou simplesmente um espaço para respirar — estou aqui.",
    badge: "AGENDAMENTO"
  };

  // Obter gradiente do badge
  const badgeGradient = configs?.find(c => c.key === 'badge_gradient')?.value?.gradient || 'pink-purple';

  // Obter cor do botão de agendamento
  const generalInfo = configs?.find((c: any) => c.key === 'general_info')?.value || {};
  const schedulingButtonColor = generalInfo.schedulingButtonColor || "#25D366";

  // Verificar se cards secundários estão ativos
  const scheduleActive = scheduleInfo.isActive !== false;
  const locationActive = locationInfo.isActive !== false;
  const showSecondCard = scheduleActive || locationActive;

  return (
    <section id="contact" data-section="contact" className="py-8 sm:py-12" ref={ref}>
      <div className="container mx-auto mobile-container max-w-6xl px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4">
            <span className={`text-xs font-medium text-white px-4 py-1.5 rounded-full bg-gradient-to-r ${badgeGradient ? BADGE_GRADIENTS[badgeGradient as keyof typeof BADGE_GRADIENTS] || 'from-pink-500 to-purple-600' : 'from-pink-500 to-purple-600'}`}>
              {contactConfig.badge || "AGENDAMENTO"}
            </span>
          </div>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-6 tracking-tight">
            {processTextWithGradient(contactConfig.title || "Vamos conversar?", badgeGradient)}
          </h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            {contactConfig.description || "Se algo dentro de você pede cuidado, atenção ou simplesmente um espaço para respirar — estou aqui."}
          </p>
        </motion.div>

        <div className={`grid gap-8 ${showSecondCard ? 'md:grid-cols-2' : 'md:grid-cols-1 place-items-center'} max-w-5xl mx-auto`}>
          {/* Card Principal de Contato */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-3">
                  Entre em contato
                </h3>
                <p className="text-gray-600 font-light">
                  Escolha a forma mais conveniente para você
                </p>
              </div>

              <div className="space-y-6 flex-1">
                {contactItems
                  .filter((item: any) => item.isActive)
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((item: any, index: number) => {
                    const IconComponent = iconMap[item.icon] || Mail;
                    return (
                      <motion.a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        className="flex items-center p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100/50 group/item"
                      >
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center mr-5 group-hover/item:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: item.color }}
                        >
                          <IconComponent className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover/item:bg-gray-300 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.a>
                    );
                  })}
              </div>
            </div>
          </motion.div>

          {/* Card de Horários e Localização (se algum estiver ativo) */}
          {showSecondCard && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {scheduleActive && locationActive ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : scheduleActive ? (
                      <Clock className="w-8 h-8 text-white" />
                    ) : (
                      <MapPin className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-3">
                    {scheduleActive && locationActive ? "Horários & Localização" : 
                     scheduleActive ? "Horários de atendimento" : "Localização"}
                  </h3>
                  <p className="text-gray-600 font-light">
                    {scheduleActive && locationActive ? "Informações práticas para seu atendimento" :
                     scheduleActive ? "Confira nossa disponibilidade" : "Onde nos encontrar"}
                  </p>
                </div>

                <div className="space-y-6 flex-1">
                  {/* Horários */}
                  {scheduleActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100/50"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="text-blue-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-3">Horários</h4>
                          <div className="text-gray-600 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Segunda à Sexta:</span>
                              <span>{scheduleInfo.weekdays?.replace("Segunda à Sexta: ", "") || "8h às 18h"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Sábado:</span>
                              <span>{scheduleInfo.saturday?.replace("Sábado: ", "") || "8h às 12h"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Domingo:</span>
                              <span>{scheduleInfo.sunday?.replace("Domingo: ", "") || "Fechado"}</span>
                            </div>
                          </div>
                          {scheduleInfo.additional_info && (
                            <p className="text-gray-500 text-sm mt-3 italic">{scheduleInfo.additional_info}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Localização */}
                  {locationActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-lg transition-all duration-300 group/location"
                    >
                      <a
                        href={locationInfo.maps_link || "https://maps.google.com/search/Campo+Mourão+Paraná"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start space-x-4"
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/location:scale-110 transition-transform duration-300">
                          <MapPin className="text-purple-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">Localização</h4>
                          <p className="text-gray-600 group-hover/location:text-purple-600 transition-colors duration-300">
                            {locationInfo.city || "Campo Mourão, Paraná"}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">Clique para abrir no Google Maps</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover/location:bg-purple-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-600 group-hover/location:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
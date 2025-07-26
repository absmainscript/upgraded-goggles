/**
 * useSectionVisibility.ts
 * 
 * Hook personalizado para controlar a visibilidade das seções do site
 * Verifica configurações do admin e retorna se cada seção deve ser exibida
 * Permite ativar/desativar seções inteiras através do painel administrativo
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SiteConfig } from "@shared/schema";
import { useMemo } from "react";

interface SectionVisibilityConfig {
  hero?: boolean;
  about?: boolean;
  services?: boolean;
  testimonials?: boolean;
  faq?: boolean;
  contact?: boolean;
}

export function useSectionVisibility() {
  const { data: configs } = useQuery({
    queryKey: ['/api/admin/config'],
    queryFn: async () => {
      const response = await fetch('/api/admin/config');
      return response.json();
    },
  });

  const sectionVisibility = configs?.find((c: any) => c.key === 'section_visibility')?.value || {};

  const isGalleryVisible = useMemo(() => {
    // Sempre mostrar galeria se houver fotos ativas
    const shouldShowGallery = configs?.some((config: any) => 
      config.key === 'photo_carousel_section' || 
      config.key === 'carousel_section'
    ) ?? true;

    return shouldShowGallery;
  }, [configs]);

  return {
    isAboutVisible: sectionVisibility.about !== false,
    isSpecialtiesVisible: sectionVisibility.specialties !== false,
    isServicesVisible: sectionVisibility.services !== false,
    isGalleryVisible: isGalleryVisible,
    isTestimonialsVisible: sectionVisibility.testimonials !== false,
    isInspirationalVisible: sectionVisibility.inspirational !== false,
    isFaqVisible: sectionVisibility.faq !== false,
    isContactVisible: sectionVisibility.contact !== false,
  };
}
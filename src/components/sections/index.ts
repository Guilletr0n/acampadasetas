import SingleColumn from './SingleColumn.astro';
import MultiColumn from './MultiColumn.astro';
import NuevaPlantilla from './nuevaPlantilla.astro';
import ScheduleActivities from './ScheduleActivities.astro';
import type { SectionContent } from '../../lib/types';
import FondoTrigo from './FondoTrigo.astro';
import FondoCarmin from './FondoCarmin.astro'

export interface SectionTemplateProps {
  slug: string;
  content: SectionContent;
  isAlternate?: boolean;
  renderedMarkdown?: string;
}

export interface SectionTemplateMeta {
  id: string;
  label: string;
  description?: string;
  component: (_props: SectionTemplateProps) => any;
}

/**
 * Registro central de plantillas de secciones.
 * Para añadir una nueva plantilla:
 * 1. Crea el componente Astro en `src/components/sections/TuPlantilla.astro`.
 * 2. Impórtalo aquí y añádelo al objeto `TEMPLATES`.
 * Automáticamente estará disponible en el CMS y en la renderización de la home.
 */
export const TEMPLATES: Record<string, SectionTemplateMeta> = {
  'single-column': {
    id: 'single-column',
    label: 'Columna Única (Manifiesto / Centrado)',
    description: 'Diseño centrado con foco de lectura, idóneo para manifiestos o textos declarativos.',
    component: SingleColumn,
  },
  'multi-column': {
    id: 'multi-column',
    label: 'Multi-Columna (Agenda / Horarios)',
    description: 'Diseño en dos columnas con cabecera e ilustración lateral pegajosa.',
    component: MultiColumn,
  },
  'schedule': {
    id: 'schedule',
    label: 'Horario de Actividades',
    description: 'Diseño cartel con fecha automática del día y listado horario de actividades.',
    component: ScheduleActivities,
  },
  'horario-actividades': {
    id: 'horario-actividades',
    label: 'Horario de Actividades (Alias)',
    description: 'Alias de Horario de Actividades.',
    component: ScheduleActivities,
  },
  'nueva-plantilla': {
    id: 'nueva-plantilla',
    label: 'Nueva Plantilla',
    description: 'Una nueva plantilla para sections.',
    component: NuevaPlantilla,
  },
  'fondo-trigo': {
    id: 'fondo-trigo',
    label: 'Fondo Trigo',
    description: 'Nueva plantilla con fondo de trigo.',
    component: FondoTrigo,
  },
  'fondo-carmin': {
    id: 'fondo-carmin',
    label: 'Fondo carmin',
    description: 'Nueva plantilla con fondo de carmin.',
    component: FondoCarmin,
  }
};

export const DEFAULT_TEMPLATE_ID = 'single-column';

export const AVAILABLE_TEMPLATES = Object.values(TEMPLATES).filter(t => t.id !== 'horario-actividades');

export function getTemplateComponent(templateId: string) {
  return TEMPLATES[templateId]?.component || TEMPLATES[DEFAULT_TEMPLATE_ID].component;
}

export function getTemplateLabel(templateId: string): string {
  return TEMPLATES[templateId]?.label || templateId;
}

import { z } from 'zod';

export const SECTION_TYPES = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'publications',
  'languages',
  'custom',
] as const;

export const skillCategorySchema = z.object({
  category: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export const entrySchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.string()).default({}),
  rawText: z.string().optional(),
});

export const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(SECTION_TYPES),
  content: z.string().optional(),
  entries: z.array(entrySchema).default([]),
  skillCategories: z.array(skillCategorySchema).default([]),
  rawText: z.string().optional(),
});

export const parsedResumeSchema = z.object({
  contact: z.object({
    name: z.string().min(1),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
  sections: z.array(sectionSchema).default([]),
  rawText: z.string().optional().default(''),
  templateId: z.enum([
    'professional-classic',
    'modern-clean',
    'executive',
    'creative',
    'minimalist',
  ]).default('professional-classic'),
  density: z.enum(['auto', 'compact', 'spacious']).default('auto'),
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;

const zodJsonSchemaApi = z as typeof z & {
  toJSONSchema?: (schema: unknown) => Record<string, unknown>;
};

export const PARSED_RESUME_JSON_SCHEMA = (() => {
  try {
    if (typeof zodJsonSchemaApi.toJSONSchema === 'function') {
      return zodJsonSchemaApi.toJSONSchema(parsedResumeSchema);
    }
  } catch {
    // Zod in this project does not expose a native JSON Schema helper.
  }

  return {};
})();

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

// Shape the model is asked to return. Deliberately excludes rawText, templateId,
// density and metadata: the app sets those itself, so the model never touches them.
export const modelEntrySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const modelSkillCategorySchema = z.object({
  category: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export const modelSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  type: z.enum(SECTION_TYPES).catch('custom'),
  content: z.string().optional(),
  entries: z.array(modelEntrySchema).default([]),
  skillCategories: z.array(modelSkillCategorySchema).default([]),
});

export const parsedResumeSchema = z.object({
  contact: z.object({
    name: z.string().default(''),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
  sections: z.array(modelSectionSchema).default([]),
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;

import {z} from 'zod/v4';

// Only plain questionnaire content is stored; no executable scripts or HTML.
export const assessmentTemplateSchema=z.object({
 title:z.string().trim().min(1).max(160),
 description:z.string().trim().max(1500).default(''),
 instructions:z.string().trim().min(1).max(1500),
 anchors:z.array(z.string().trim().min(1).max(80)).length(5),
 questions:z.array(z.object({
  id:z.string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  domain:z.string().trim().min(1).max(80),
  text:z.string().trim().min(1).max(500)
 }).strict()).min(1).max(50)
}).strict().refine(t=>new Set(t.questions.map(q=>q.id)).size===t.questions.length,{message:'Each question needs a unique ID.',path:['questions']});

export type AssessmentTemplate=z.infer<typeof assessmentTemplateSchema>;

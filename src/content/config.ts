import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().default('/og-image.png'),
    date: z.coerce.date(),
    author: z.string().default('Calculadora IVA'),
    category: z.string().default('Tax & Invoicing'),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};

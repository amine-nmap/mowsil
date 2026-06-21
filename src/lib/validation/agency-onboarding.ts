import { z } from "zod";

const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;

export const step1Schema = z.object({
  companyName: z.string().min(2, "Raison sociale requise (min 2 caractères)"),
  city: z.literal("Oujda"),
  phone: z.string().regex(phoneRegex, "Numéro de téléphone marocain invalide (+2126XXXXXX)"),
  email: z.string().email("Email professionnel invalide"),
});

export const step2Schema = z.object({
  address: z.string().min(5, "Adresse précise requise"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  openingHours: z.string().min(1, "Horaires requis"),
  fleetSize: z.coerce.number().int().min(1, "Minimum 1 véhicule"),
  facadePhoto: z.instanceof(File).optional().or(z.null()),
});

export const step3Schema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
    passwordConfirm: z.string(),
    acceptCgu: z.boolean().refine((v) => v === true, "Vous devez accepter les CGU"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirm"],
  });

export const onboardingSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;

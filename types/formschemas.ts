import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const PharmacyRegisterFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, {
      message: "Pharmacy name must be at least 2 characters.",
    }),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ProductFormSchema = z.object({
  imageUrl: z.string().url(),
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
  description: z.string().min(50, {
    message: "description must be at least 50 characters.",
  }),
  sideEffects: z.string().min(30, {
    message: "Side effects must be at least 30 characters.",
  }),
  details: z.string().min(30, {
    message: "Details must be at least 30 characters.",
  }),
  usage: z.string().min(20, {
    message: "Usage instructions must be at least 20 characters.",
  }),
  imageBlob: z.custom<File[]>().refine((files) => {
    return files.length > 0;
  }, "Please Upload a Image"),
});

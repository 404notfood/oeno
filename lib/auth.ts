import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Configuration email/password
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false, // Mettre true en production
  },

  // Configuration de session
  // GAR/Education: Session courte qui expire a la fermeture du navigateur
  session: {
    expiresIn: 60 * 60 * 8, // 8 heures max (journee scolaire)
    updateAge: 60 * 60, // Mise a jour toutes les heures
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Configuration utilisateur
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        defaultValue: "STUDENT",
      },
      establishmentId: {
        type: "string",
        required: false,
      },
      garId: {
        type: "string",
        required: false,
      },
    },
  },

  // URLs de redirection
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/login",
  },

  // Configuration avancee
  advanced: {
    cookiePrefix: "oenoclass",
    useSecureCookies: process.env.NODE_ENV === "production",
    // GAR/Education: Cookie de session (expire a la fermeture du navigateur)
    // En omettant maxAge, le cookie devient un cookie de session
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      // Pas de maxAge = cookie de session qui expire a la fermeture du navigateur
    },
  },

  // Trusted origins
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://192.168.1.36:3000",
    "https://oenoclass.404notfood.fr",
  ],
});

// Types pour l'utilisateur
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export type IntentionCategory =
  | 'Negocios/Servicios'
  | 'Citas'
  | 'Emprendimiento/Ventas'
  | 'Amigos';

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  x?: string;
  whatsapp?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  shortBio?: string;
  socialLinks?: SocialLinks;
  intentions: IntentionCategory[];
  isGhostMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

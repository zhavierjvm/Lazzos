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

export interface CatalogItem {
  id: string;
  title: string;
  price: string;
  imageUrl?: string;
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
  isPremium: boolean;
  catalogItems?: CatalogItem[];
  blockedUsers?: string[]; // Array of blocked user IDs
  createdAt: Date;
  updatedAt: Date;
}

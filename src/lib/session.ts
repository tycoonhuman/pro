import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

/**
 * L'espace Tycoon du site pro : un mot de passe (`PRO_ADMIN_PASSWORD`) ouvre
 * une session signée de 12 heures (`PRO_SESSION_SECRET`). Sans ces deux
 * variables, l'espace reste fermé.
 */

const COOKIE = "tycoon_pro";
const DUREE_S = 12 * 60 * 60;

function signer(valeur: string, secret: string): string {
  return createHmac("sha256", secret).update(valeur).digest("base64url");
}

function egal(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Ce qui manque à la configuration, pour le dire à l'écran plutôt que « mot de passe incorrect ». */
export function configurationManquante(): string | null {
  const attendu = process.env.PRO_ADMIN_PASSWORD?.trim();
  if (!process.env.PRO_SESSION_SECRET?.trim()) return "PRO_SESSION_SECRET manque sur Vercel.";
  if (!attendu) return "PRO_ADMIN_PASSWORD manque sur Vercel.";
  if (attendu.length < 12) return "PRO_ADMIN_PASSWORD fait moins de 12 caractères.";
  return null;
}

export function motDePasseValide(saisi: string): boolean {
  // Les espaces au début et à la fin sont ignorés des deux côtés : un copier-coller en ajoute souvent.
  const attendu = process.env.PRO_ADMIN_PASSWORD?.trim();
  const secret = process.env.PRO_SESSION_SECRET?.trim();
  if (!attendu || !secret || attendu.length < 12) return false;
  return egal(signer(saisi.trim(), secret), signer(attendu, secret));
}

export async function ouvrirSession(): Promise<void> {
  const secret = process.env.PRO_SESSION_SECRET?.trim();
  if (!secret) return;
  const fin = String(Math.floor(Date.now() / 1000) + DUREE_S);
  (await cookies()).set(COOKIE, `${fin}.${signer(fin, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_S,
  });
}

export async function fermerSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function sessionTycoon(): Promise<boolean> {
  const secret = process.env.PRO_SESSION_SECRET?.trim();
  const valeur = (await cookies()).get(COOKIE)?.value;
  if (!secret || !valeur) return false;
  const [fin, signature] = valeur.split(".");
  if (!fin || !signature || !egal(signature, signer(fin, secret))) return false;
  return Number(fin) > Date.now() / 1000;
}

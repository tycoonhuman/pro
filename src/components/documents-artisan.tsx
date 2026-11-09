import type { DocumentsArtisan } from "@/lib/gmao";

/** Les photos et documents que Tycoon a choisi de montrer (D-129). Rien s'il n'y en a pas. */
export function DocumentsMission({ documents }: { documents?: DocumentsArtisan }) {
  if (!documents || (documents.photos.length === 0 && documents.textes.length === 0)) return null;
  return (
    <section className="space-y-3 rounded-2xl border border-trait bg-white p-4">
      <h2 className="text-base font-semibold">Photos et documents</h2>
      {documents.photos.length ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {documents.photos.map((photo) => (
            <li key={photo.id}>
              <a href={photo.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-trait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.nom} loading="lazy" className="aspect-square w-full object-cover" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {documents.textes.map((doc) => (
        <details key={doc.id} className="rounded-xl border border-trait p-3">
          <summary className="cursor-pointer text-sm font-semibold">{doc.titre}</summary>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">{doc.texte}</p>
        </details>
      ))}
      <p className="text-xs text-slate-500">Ces éléments vous aident à chiffrer. Ils restent confidentiels.</p>
    </section>
  );
}

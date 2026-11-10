import Script from "next/script";

/**
 * Microsoft Clarity : comment les écrans sont utilisés (clics morts, clics de
 * rage, pages abandonnées), pour les propositions d'amélioration de NORMAN.
 * Rien ne se charge sans `NEXT_PUBLIC_CLARITY_ID`. Mode sans cookie
 * (consentement « denied ») : aucune session suivie d'une page à l'autre, et
 * le masquage strict se règle dans le projet Clarity.
 */
/**
 * L'identifiant du projet Clarity. Il n'est pas secret (il figure dans chaque
 * page servie), donc il vit dans le code ; la variable Vercel, si elle existe,
 * reste prioritaire.
 */
const CLARITY_ID = "";

export function Clarity() {
  const id = (process.env.NEXT_PUBLIC_CLARITY_ID || CLARITY_ID).trim();
  if (!id || !/^[a-z0-9]{6,20}$/i.test(id)) return null;
  return (
    <Script id="clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"denied"});`}
    </Script>
  );
}

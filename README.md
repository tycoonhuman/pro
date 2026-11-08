# Tycoon Pro — pro.tycoonapp.fr

Le tunnel avant la GMAO (D-116, D-117 dans le dépôt `gmao`).

- `/offre/[jeton]` : l'artisan lit la demande, discute avec NORMAN dans son salon privé et envoie sa réponse officielle.
- `/tycoon` : Tycoon compare les réponses, lit les salons, reprend la main, demande le point de NORMAN et retient un artisan.
- Une fois l'artisan retenu, l'intervention lui est assignée dans la GMAO, qui lui envoie son bon d'intervention.

Aucune donnée n'est stockée ici : tout passe par la porte `/api/pro/v1` de la GMAO, de serveur à serveur, avec `PRO_GMAO_KEY`.
Variables : voir `.env.example`.

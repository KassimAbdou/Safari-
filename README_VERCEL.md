# Déploiement Node.js sur Vercel (mode serverless)

- Place tous tes endpoints dans le dossier `api/` à la racine du projet.
- Chaque fichier `.js` dans `api/` devient une route accessible via `/api/nom-du-fichier`.
- Pas besoin de serveur Express : chaque handler exporte une fonction par défaut (voir les exemples déjà créés).
- Les variables d'environnement se mettent dans le dashboard Vercel (onglet Environment Variables).
- Les dépendances (prisma, bcrypt, jsonwebtoken, etc.) doivent être listées dans `package.json`.
- Pour utiliser Prisma, assure-toi que le dossier `prisma/` et le fichier `schema.prisma` sont bien présents à la racine.
- Pour déployer, connecte ton repo à Vercel et lance le déploiement.

Tu peux maintenant supprimer le fichier `server.js` et le dossier `routes/` si tu n’en as plus besoin.

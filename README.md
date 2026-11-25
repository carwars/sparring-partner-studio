# Sparring Partner Studio — V0.5.1 (locale)

Ouvrir `index.html` dans Chrome, Edge ou Firefox après décompression. Aucun serveur ni connexion nécessaire.

## Correction export PNG

La V0.5 chargeait les images en `file://` puis les dessinait sur un canvas. Certains navigateurs appliquent alors une restriction d’origine et bloquent `canvas.toBlob()`. Dans cette version, les images sont aussi intégrées sous forme de données dans `assets.js`, afin de préserver l’export depuis un fichier local. `img/` reste la bibliothèque de sources graphiques. Un message annonce la réussite ou la cause d’un échec.

Fichiers : `index.html`, `style.css`, `app.js`, `assets.js`, `img/`.

Aucune publication sur GitHub.

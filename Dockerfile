# Utilise une image Node.js officielle
FROM node:18

# Crée le dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers nécessaires à l'installation des dépendances
COPY Back/package*.json ./Back/

# Installe les dépendances
RUN cd Back && npm install

# Copie tout le backend et le frontend dans l'image
COPY Back ./Back
COPY Front ./Front

# Se positionner dans le dossier Back pour lancer le serveur
WORKDIR /app/Back

# Expose le port utilisé par le backend
EXPOSE 3000

# Lancer le serveur
CMD ["node", "server.js"]

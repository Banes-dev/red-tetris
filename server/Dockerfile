FROM node:18-alpine

WORKDIR /app

# Optimisation du cache Docker en copiant d'abord les fichiers de dépendances
COPY package*.json ./
RUN npm ci --omit=dev

# Copie du reste du code source
COPY . .

# Port utilisé par src/server.js
EXPOSE 3000

# Commande de démarrage (ajuste si ton point d'entrée n'est pas src/server.js)
CMD ["node", "src/server.js"]

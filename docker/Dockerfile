FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Expose le port par défaut de Vite en mode dev
EXPOSE 5173

# Lance Vite en forçant l'écoute sur toutes les interfaces (0.0.0.0) 
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

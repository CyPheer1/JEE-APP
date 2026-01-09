#!/bin/bash

# Script de démarrage PFEHub
# Ce script réinstalle les dépendances et démarre l'application

echo "🚀 PFEHub - Script de démarrage"
echo "================================"

# Aller dans le dossier frontend
cd "$(dirname "$0")"

# Toujours réinstaller les types manquants
echo "📦 Installation des dépendances TypeScript..."
npm install @types/react@18.3.0 @types/react-dom@18.3.0 --save-dev

# Vérifier si node_modules est complet
if [ ! -d "node_modules/react" ]; then
    echo "📦 Installation complète des dépendances..."
    npm install
fi

echo "✅ Dépendances installées"
echo ""
echo "🌐 Démarrage du serveur de développement..."
echo "   URL: http://localhost:3000"
echo ""

# Démarrer le serveur de développement
npm run dev

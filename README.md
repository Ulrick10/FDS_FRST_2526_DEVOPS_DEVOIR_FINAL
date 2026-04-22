# Gestionnaire de Dépenses — Node.js
### Projet Capstone DevOps

Application Node.js pour gérer et suivre les dépenses personnelles.

---

## 🚀 Installation Locale

### Prérequis
- Node.js 18+
- PostgreSQL 15+
- npm

### Étapes d'installation

```bash
# Cloner le repository
git clone https://github.com/lpognon-edu/FDS_FRST_2526_DEVOPS_DEVOIR_FINAL.git
cd expense-tracker-nodejs

# Installer les dépendances
npm install

# Créer le fichier .env
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=password
NODE_ENV=development
EOF

# Lancer les tests
npm test

# Démarrer le serveur (mode développement)
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

---

## 📂 Structure du Projet

```
├── src/                          # Code principal de l'application
│   ├── server.js                 # Serveur Express
│   ├── config/
│   │   └── database.js           # Configuration PostgreSQL
│   ├── public/
│   │   ├── expenses.html         # Page principale
│   │   └── css/
│   │       └── style.css         # Styles
│   ├── routes/
│   │   ├── dashboard.js          # Route tableau de bord
│   │   └── expenses.js           # Route dépenses
│   ├── views/
│   │   ├── dashboard.ejs         # Template tableau de bord
│   │   ├── expenses.ejs          # Template dépenses
│   │   ├── layout.ejs            # Template principal
│   │   └── database-unavailable.ejs
│   └── utils/
│       └── template.js           # Utilitaires
│
├── tests/                        # Tests unitaires
│   ├── server.test.js
│   ├── dashboard.test.js
│   ├── expenses.test.js
│   └── __mocks__/
│       └── database.js
│
├── jest.config.js                # Configuration Jest
├── jest.setup.js                 # Setup tests
├── jest.teardown.js              # Teardown tests
├── package.json                  # Dépendances Node.js
└── README.md                     # Documentation
```

---

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests avec couverture
npm test -- --coverage
```

---

## 📝 Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DB_HOST` | Hôte de la base de données | `localhost` ou `db` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nom de la base | `expense_tracker` |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `password` |
| `NODE_ENV` | Environnement | `development` ou `production` |
| `PORT` | Port du serveur | `3000` |

---

## 🔧 Commandes Utiles

```bash
# Mode développement avec rechargement automatique
npm run dev

# Lancer le serveur en production
npm start

# Lancer tous les tests
npm test
```

---

## 📖 Fonctionnalités

- ✅ Ajouter une nouvelle dépense
- ✅ Consulter l'historique des dépenses
- ✅ Voir le tableau de bord avec les statistiques
- ✅ Supprimer une dépense
- ✅ Interface utilisateur simple et intuitive

---

## 👤 Auteur

Créé par Ulrick Wadson BENOIT pour le cours DevOps - Session 2025-2026

---

## 📄 Licence

MIT

# 🎓 PFEHub - Plateforme de Gestion des Projets de Fin d'Études

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen?style=for-the-badge&logo=spring" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" alt="Java"/>
  <img src="https://img.shields.io/badge/H2-Database-yellow?style=for-the-badge" alt="H2"/>
</p>

<p align="center">
  <strong>Projet réalisé dans le cadre du module JEE (Java Enterprise Edition)</strong><br>
  <em>École Nationale Supérieure d'Arts et Métiers - ENSAM Casablanca</em>
</p>

---

## 📋 Description

**PFEHub** est une application web complète de gestion des Projets PFE,  développée pour faciliter le processus de soumission, d'encadrement et de soutenance des projets académiques.

Cette plateforme permet de gérer efficacement :
- 📝 La soumission des sujets de PFE par les étudiants
- 👨‍🏫 L'assignation intelligente des encadrants
- 📅 La planification et validation des soutenances
- 📊 Le suivi des évaluations et des notes

---

## 🖼️ Captures d'écran

### 🔐 Interface Administrateur

#### Vue d'ensemble du Dashboard
![Dashboard Admin](./screenshots/admin-dashboard.png)
*Statistiques globales : étudiants, encadrants, PFEs actifs et soutenances*

#### Gestion de la Structure Académique
![Structure](./screenshots/admin-structure.png)
*Gestion des départements (IAGI, GIM, GMM, GEE) et spécialisations*

#### Configuration de l'Année Académique
![Année Académique](./screenshots/admin-academic-year.png)
*Définition des périodes de soumission et de soutenances*

#### Gestion des Assignations
![Assignations](./screenshots/admin-assignments.png)
*Recommandations intelligentes d'encadrants avec pourcentage de match*

#### Validation des Soutenances
![Soutenances](./screenshots/admin-defenses.png)
*Propositions de soutenances, calendrier et composition du jury*

#### Rapports d'Évaluation
![Évaluations](./screenshots/admin-evaluations.png)
*Consultation des notes et rapports détaillés des soutenances*

---

### 👨‍🏫 Interface Professeur/Encadrant

#### Dashboard et Statistiques
![Prof Dashboard](./screenshots/prof-dashboard.png)
*Vue d'ensemble : projets supervisés (3), actifs (2), en révision (1), note moyenne (16.2/20)*

#### Gestion des Projets Assignés
![Prof Projets](./screenshots/prof-projects.png)
*Liste des projets avec progression, livrables, actions (Accepter/Refuser/Voir détails)*

#### Gestion des Soutenances
![Prof Soutenances](./screenshots/prof-soutenances.png)
*Proposition de dates, composition du jury, validation par l'administration*

#### Évaluation des Soutenances
![Prof Evaluation](./screenshots/prof-evaluation.png)
*Formulaire d'évaluation : qualité présentation, maîtrise du sujet, réponses aux questions, respect du temps, note finale*

---

### 👨‍🎓 Interface Étudiant

#### Dashboard et Vue d'ensemble du Projet
![Student Dashboard](./screenshots/student-dashboard.png)
*Projet "Système de recommandation intelligent basé sur l'IA" - Statut Accepté, progression 65%*

#### Détails du Projet
![Student Details](./screenshots/student-details.png)
*Description, objectifs, méthodologie et résultats attendus du PFE*

#### Gestion des Livrables
![Student Livrables](./screenshots/student-livrables.png)
*Liste des livrables soumis : Cahier des charges, Rapports d'avancement, Code source*

#### Soumission de Livrable
![Student Submit](./screenshots/student-submit-livrable.png)
*Formulaire d'upload : titre, type, description, fichier (PDF, ZIP, DOCX - Max 10MB)*

#### Soumission Finale du Projet
![Student Final](./screenshots/student-final-submission.png)
*Soumission définitive du rapport final (PDF - Max 50MB)*

#### Informations sur la Soutenance
![Student Soutenance](./screenshots/student-soutenance.png)
*Date, heure, salle, composition du jury et rappels importants*

#### Rapport d'Évaluation
![Student Evaluation](./screenshots/student-evaluation.png)
*Note finale 17.5/20 avec détail des critères : présentation (18), maîtrise (17), questions (16), temps (19)*

#### Profil Étudiant
![Student Profile](./screenshots/student-profile.png)
*Informations personnelles : département IAGI, spécialisation Systèmes d'Information, encadrant assigné*

---

### 🗄️ Base de Données H2

#### Console H2 - Tables de la Base de Données
![H2 Console](./screenshots/h2-database.png)
*Structure de la base de données avec tables : ADMINS, APP_USERS, DEPARTEMENTS, ENCADRANTS, ETUDIANTS, PFES, SOUTENANCES, SPECIALITES, etc.*

#### Table ETUDIANTS
![H2 Etudiants](./screenshots/h2-etudiants.png)
*8 étudiants enregistrés avec numéro étudiant (ENSAM2025XXX), promotion 2025, année universitaire*

---

## 🏗️ Architecture du Projet

```
PFEHub/
├── pfehub_backend/            # Backend Spring Boot
│   ├── src/main/java/ma/xproce/pfehub/
│   │   ├── config/           # Configuration (Security, CORS)
│   │   ├── controller/       # REST Controllers
│   │   ├── model/            # Entités JPA
│   │   ├── repository/       # Repositories Spring Data
│   │   ├── service/          # Services métier
│   │   └── dto/              # Data Transfer Objects
│   └── src/main/resources/
│       └── application.properties
│
└── PFEHub_frontend/           # Frontend React
    ├── src/
    │   ├── components/       # Composants React
    │   ├── hooks/            # Custom Hooks
    │   ├── services/         # Services API
    │   └── styles/           # Styles CSS
    └── package.json
```

---

## 🛠️ Technologies Utilisées

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Java | 21 | Langage de programmation |
| Spring Boot | 3.5.7 | Framework backend |
| Spring Security | 6.x | Sécurité et authentification |
| Spring Data JPA | 3.x | Persistence des données |
| H2 Database | 2.x | Base de données embarquée |
| Maven | 3.x | Gestion des dépendances |

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 18.3 | Bibliothèque UI |
| TypeScript | 5.6 | Typage statique |
| Vite | 6.3 | Build tool |
| Tailwind CSS | 3.x | Framework CSS |
| Shadcn/UI | - | Composants UI |
| Lucide React | - | Icônes |

---

## ⚙️ Installation et Configuration

### Prérequis
- Java 21 ou supérieur
- Node.js 18 ou supérieur
- Maven 3.x
- Git

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/PFEHub.git
cd PFEHub
```

### 2. Lancer le Backend
```bash
cd pfehub_backend
./mvnw spring-boot:run
```
Le serveur démarre sur `http://localhost:8080`

### 3. Lancer le Frontend
```bash
cd PFEHub_frontend
npm install
npm run dev
```
L'application est accessible sur `http://localhost:5173`

### 4. Accéder à la Console H2 (Base de données)
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/pfehub_db`
- Username: `sa`
- Password: *(vide)*

---

## 👥 Comptes de Démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Administrateur** | h.elmoussaoui@ensam-casa.ma | admin123 |
| **Professeur** | b.hirchoua@ensam-casa.ma | prof123 |
| **Professeur** | m.azmi@ensam-casa.ma | prof123 |
| **Étudiant** | m.elouardi@etudiant.ensam-casa.ma | etud123 |

---

## 🎯 Fonctionnalités

### 👨‍💼 Administrateur
- ✅ Tableau de bord avec statistiques en temps réel
- ✅ Gestion des départements et spécialisations
- ✅ Gestion des utilisateurs (étudiants et encadrants)
- ✅ Configuration de l'année académique
- ✅ Assignation des encadrants aux projets
- ✅ Validation des propositions de soutenances
- ✅ Consultation des rapports d'évaluation

### 👨‍🏫 Encadrant/Professeur
- ✅ Dashboard avec statistiques personnelles (projets, note moyenne)
- ✅ Liste des projets assignés avec barre de progression
- ✅ Consultation des livrables soumis par les étudiants
- ✅ Validation/Refus des sujets de PFE
- ✅ Proposition de dates de soutenance
- ✅ Composition du jury (Président, Examinateurs)
- ✅ Évaluation multicritères des soutenances :
  - Qualité de la présentation orale (/20)
  - Maîtrise du sujet (/20)
  - Réponses aux questions du jury (/20)
  - Respect du temps imparti (/20)
  - Note finale de soutenance (/20)
- ✅ Rédaction des commentaires détaillés

### 👨‍🎓 Étudiant
- ✅ Dashboard avec vue d'ensemble du projet et progression
- ✅ Soumission de sujet de PFE (description, objectifs, méthodologie, résultats attendus)
- ✅ Suivi de l'état du projet (Soumis → Assigné → Accepté → En cours → Terminé)
- ✅ Gestion des livrables :
  - Cahier des charges
  - Rapports d'avancement par chapitre
  - Code source (ZIP)
  - Documentation
- ✅ Upload de fichiers (PDF, ZIP, DOCX - Max 10MB par livrable)
- ✅ Soumission finale du rapport (PDF - Max 50MB)
- ✅ Consultation des informations de soutenance :
  - Date, heure, salle
  - Composition du jury (Président, Examinateurs)
  - Rappels importants (arriver 15 min avant, etc.)
- ✅ Visualisation du rapport d'évaluation détaillé :
  - Note finale de soutenance
  - Notes par critère avec barres de progression
  - Commentaires détaillés de l'encadrant
- ✅ Profil avec informations académiques

---

## 📁 Structure des Départements ENSAM Casablanca

| Code | Département | Spécialisations |
|------|-------------|-----------------|
| **IAGI** | Ingénierie en Automatique et Génie Informatique | IA & Big Data, Systèmes d'Information, Systèmes Embarqués |
| **GIM** | Génie Industriel et Maintenance | Génie Industriel |
| **GMM** | Génie Mécanique et Matériaux | Conception Mécanique |
| **GEE** | Génie Électrique et Énergétique | Énergies Renouvelables |

---

## 🔌 API REST Endpoints

### Authentification
```
POST /api/auth/login          # Connexion
POST /api/auth/register       # Inscription
```

### Administration
```
GET  /api/admin/dashboard     # Statistiques
GET  /api/admin/departments   # Liste des départements
POST /api/admin/departments   # Créer un département
GET  /api/admin/specializations  # Liste des spécialisations
```

### Utilisateurs
```
GET  /api/users/students      # Liste des étudiants
GET  /api/users/professors    # Liste des encadrants
```

### Projets (PFE)
```
GET  /api/pfes                # Liste des projets
POST /api/pfes                # Soumettre un projet
PUT  /api/pfes/{id}/assign    # Assigner un encadrant
```

### Soutenances
```
GET  /api/soutenances         # Liste des soutenances
POST /api/soutenances/propose # Proposer une soutenance
PUT  /api/soutenances/{id}/validate  # Valider
```

---

## 📝 Diagramme de Classes (Simplifié)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   AppUser   │     │ Departement │     │  Specialite │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ firstName   │     │ name        │     │ name        │
│ lastName    │     │ code        │     │ code        │
│ email       │◄────│ description │◄────│ departement │
│ password    │     └─────────────┘     └─────────────┘
│ role        │
└──────┬──────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Admin     │ │  Encadrant  │ │  Etudiant   │
├─────────────┤ ├─────────────┤ ├─────────────┤
│ permissions │ │ expertise   │ │ numEtudiant │
└─────────────┘ │ maxCapacity │ │ promotion   │
                └──────┬──────┘ └──────┬──────┘
                       │               │
                       ▼               ▼
                ┌─────────────────────────┐
                │          PFE            │
                ├─────────────────────────┤
                │ id, title, description  │
                │ status, etudiant        │
                │ encadrant, soutenance   │
                └───────────┬─────────────┘
                            │
                            ▼
                ┌─────────────────────────┐
                │      Soutenance         │
                ├─────────────────────────┤
                │ date, time, room        │
                │ status, finalGrade      │
                │ jury members            │
                └─────────────────────────┘
```

---

## 🚀 Améliorations Futures

- [ ] Notification par email
- [ ] Export PDF des rapports
- [ ] Système de messagerie interne
- [ ] Intégration calendrier Google
- [ ] Application mobile

---

## 👨‍💻 Auteur

**Mohamed El Ouardi**
- 🎓 Étudiant en 2ème année cycle ingénieur
- 🏫 ENSAM Casablanca - Département IAGI

---

## 📄 Licence

Ce projet est réalisé dans un cadre académique pour le module **JEE (Java Enterprise Edition)** à l'ENSAM Casablanca.

---

## 🙏 Remerciements

- **ENSAM Casablanca** - École Nationale Supérieure d'Arts et Métiers
- **Département IAGI** - Ingénierie en Automatique et Génie Informatique
- Professeurs encadrants du module JEE

---

<p align="center">
  <strong>🎓 ENSAM Casablanca - Année Universitaire 2025-2026</strong>
</p>

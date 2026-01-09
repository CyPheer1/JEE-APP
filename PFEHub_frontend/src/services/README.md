# Services API - PFEHub

## 📋 Vue d'ensemble

Cette architecture de services fournit une couche d'abstraction complète pour communiquer avec le backend Spring Boot de PFEHub. Elle suit le workflow corrigé où **l'entité Soutenance est créée uniquement lors de la proposition par l'encadrant**.

## 🏗️ Architecture

```
/services
├── apiClient.ts          # Client HTTP générique avec gestion des tokens
├── types.ts             # Définitions TypeScript de toutes les entités
├── defenseService.ts    # Service de gestion des Soutenances
├── projectService.ts    # Service de gestion des Projets
├── index.ts            # Point d'entrée centralisé
└── README.md           # Cette documentation
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### Authentification

Le client API gère automatiquement le token JWT stocké dans `localStorage` :

```typescript
import { apiClient } from '@/services';

// Définir le token après login
apiClient.setToken(jwtToken);

// Supprimer le token après logout
apiClient.clearToken();
```

## 📚 Utilisation des Services

### 1. Defense Service (Gestion des Soutenances)

#### Workflow Corrigé : Création de la Soutenance

**IMPORTANT** : L'entité `Soutenance` n'existe PAS au début du projet. Elle est créée **uniquement** quand l'encadrant propose une soutenance.

```typescript
import { defenseService } from '@/services';

// ÉTAPE 6 : L'encadrant propose une soutenance
// C'EST ICI que l'entité Soutenance est CRÉÉE dans la base de données
const proposal = {
  projectId: 123,                    // ID du projet en statut SOUMISSION_FINALE
  proposedDate: '2025-06-15',        // Format YYYY-MM-DD
  proposedTime: '14:00',             // Format HH:mm
  proposedRoom: 'Salle A203',
  juryMembers: [
    { name: 'Dr. Karim Alaoui', email: 'karim@univ.ma', role: 'EXAMINATEUR' },
    { name: 'Dr. Samira Bennis', email: 'samira@univ.ma', role: 'EXAMINATEUR' }
  ],
  notes: 'Projet excellent, prêt pour soutenance'
};

// Cette méthode crée l'entité Soutenance dans la DB
const defense = await defenseService.proposeDefense(proposal);
console.log('Soutenance créée avec ID:', defense.id);
```

#### Validation par l'Admin

```typescript
// ÉTAPE 7 : L'admin valide la soutenance (qui existe déjà)
const validation = {
  defenseId: defense.id,
  finalDate: '2025-06-15',    // Peut être différente de proposedDate
  finalTime: '14:00',
  finalRoom: 'Salle A203',
  notes: 'Validé'
};

const validatedDefense = await defenseService.validateDefense(validation);
```

#### Modification par l'Admin

```typescript
// L'admin modifie en cas de conflit
const modification = {
  defenseId: defense.id,
  finalDate: '2025-06-16',           // Nouvelle date
  finalTime: '10:00',                // Nouvelle heure
  finalRoom: 'Salle B105',           // Nouvelle salle
  modificationReason: 'Conflit de salle avec une autre soutenance'
};

const modifiedDefense = await defenseService.modifyDefense(modification);
```

#### Report par l'Admin

```typescript
// L'admin reporte la soutenance
const rejection = {
  defenseId: defense.id,
  rejectionReason: 'Membre du jury indisponible à cette date'
};

const rejectedDefense = await defenseService.rejectDefense(rejection);
```

#### Évaluation par l'Encadrant

```typescript
// ÉTAPE 9 : Après la soutenance, l'encadrant évalue
const evaluation = {
  defenseId: defense.id,
  presentationQuality: 16,      // Note sur 20
  subjectMastery: 17,           // Note sur 20
  questionAnswers: 15,          // Note sur 20
  timeRespect: 18,              // Note sur 20
  finalGrade: 16.5,             // Note finale (résultat de délibération)
  comments: 'Excellente présentation, maîtrise du sujet...',
  strengths: 'Innovation, clarté de présentation',
  improvements: 'Approfondir certains aspects techniques'
};

const result = await defenseService.evaluateDefense(evaluation);
```

#### Récupération de données

```typescript
// Propositions en attente (pour Admin)
const pending = await defenseService.getPendingProposals();

// Soutenances d'un professeur
const professorDefenses = await defenseService.getDefensesByProfessor(professorId);

// Soutenance d'un étudiant
const studentDefense = await defenseService.getDefenseByStudent(studentId);

// Soutenances à venir
const upcoming = await defenseService.getUpcomingDefenses();

// Vérifier les conflits
const hasConflict = await defenseService.checkConflicts('2025-06-15', '14:00', 'Salle A203');
```

---

### 2. Project Service (Gestion des Projets)

#### Soumission par l'Étudiant

```typescript
import { projectService } from '@/services';

// ÉTAPE 1 : L'étudiant soumet son projet
const submission = {
  title: 'Système de recommandation basé sur l\'IA',
  description: 'Description détaillée du projet...',
  objectives: 'Objectifs principaux...',
  context: 'Contexte du projet...',
  methodology: 'Méthodologie employée...',
  expectedResults: 'Résultats attendus...',
  keywords: ['IA', 'Machine Learning', 'Recommandation'],
  proposalFile: pdfFile  // File object
};

const project = await projectService.submitProject(submission);
```

#### Acceptation/Refus par l'Encadrant

```typescript
// ÉTAPE 3 : Accepter un projet
const acceptedProject = await projectService.acceptProject(
  projectId,
  'Excellent sujet, bien structuré'
);

// ÉTAPE 3 : Refuser un projet
const rejectedProject = await projectService.rejectProject(
  projectId,
  'Manque de clarté dans les objectifs',
  'Veuillez préciser la méthodologie et redéfinir les objectifs'
);
```

#### Assignation par l'Admin

```typescript
// ÉTAPE 2 : Récupérer les recommandations
const recommendations = await projectService.getAssignmentRecommendations(projectId);

recommendations.forEach(rec => {
  console.log(`${rec.professor.firstName} ${rec.professor.lastName}`);
  console.log(`Match: ${rec.matchPercentage}%`);
  console.log(`Charge: ${rec.workload} projets`);
  console.log(`Expertise: ${rec.expertise.join(', ')}`);
});

// ÉTAPE 2 : Assigner un encadrant
const assignment = {
  projectId: projectId,
  professorId: recommendations[0].professor.id,
  notes: 'Recommandation automatique acceptée'
};

const assignedProject = await projectService.assignProfessor(assignment);
```

#### Soumission de Livrables

```typescript
// ÉTAPE 4 : L'étudiant soumet un livrable
const deliverableSubmission = {
  projectId: project.id,
  title: 'Rapport d\'avancement - Mois 1',
  description: 'État d\'avancement du projet après un mois',
  type: 'RAPPORT_AVANCEMENT',
  file: reportFile,
  notes: 'Première version du rapport'
};

const deliverable = await projectService.submitDeliverable(deliverableSubmission);

// Récupérer tous les livrables
const deliverables = await projectService.getDeliverables(projectId);
```

#### Soumission Finale

```typescript
// ÉTAPE 5 : L'étudiant soumet son rapport final
const finalProject = await projectService.submitFinalReport(projectId, finalReportFile);

console.log(finalProject.status); // "SOUMISSION_FINALE"
// À ce stade, le projet est prêt pour que l'encadrant propose une soutenance
```

#### Récupération de données

```typescript
// Projets d'un professeur
const professorProjects = await projectService.getProjectsByProfessor(professorId);

// Projet d'un étudiant
const studentProject = await projectService.getProjectByStudent(studentId);

// Projets en attente d'assignation (Admin)
const pendingProjects = await projectService.getPendingAssignments();

// Projets prêts pour soutenance
const readyProjects = await projectService.getProjectsReadyForDefense(professorId);
```

---

## 🎣 Utilisation avec les Hooks React

Pour une intégration React plus facile, utilisez les hooks personnalisés :

### useDefense Hook

```typescript
import { useDefense } from '@/hooks/useDefense';

function ProfessorSoutenances() {
  const {
    defenses,
    loading,
    error,
    success,
    proposeDefense,
    evaluateDefense,
    fetchProfessorDefenses
  } = useDefense();

  useEffect(() => {
    fetchProfessorDefenses(professorId);
  }, [professorId]);

  const handlePropose = async (formData) => {
    try {
      await proposeDefense({
        projectId: formData.projectId,
        proposedDate: formData.date,
        proposedTime: formData.time,
        proposedRoom: formData.room,
        juryMembers: formData.juryMembers
      });
      // success message is automatically set in state
    } catch (err) {
      // error message is automatically set in state
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert variant="destructive">{error}</Alert>;

  return (
    <div>
      {success && <Alert variant="success">{success}</Alert>}
      {/* Render defenses */}
    </div>
  );
}
```

### useProject Hook

```typescript
import { useProject } from '@/hooks/useProject';

function StudentProject() {
  const {
    currentProject,
    loading,
    error,
    success,
    submitProject,
    submitFinalReport
  } = useProject();

  const handleSubmit = async (formData) => {
    try {
      await submitProject({
        title: formData.title,
        description: formData.description,
        objectives: formData.objectives,
        proposalFile: formData.file
      });
    } catch (err) {
      // Error is handled automatically
    }
  };

  // ...
}
```

---

## 🔄 Workflow Complet Illustré

```
┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 1-5 : Le projet existe, mais PAS de Soutenance       │
├─────────────────────────────────────────────────────────────┤
│ 1. Étudiant soumet PFE          → projectService.submitProject()        │
│ 2. Admin assigne encadrant      → projectService.assignProfessor()      │
│ 3. Encadrant accepte/refuse     → projectService.acceptProject()        │
│ 4. Étudiant soumet livrables    → projectService.submitDeliverable()    │
│ 5. Étudiant soumet final        → projectService.submitFinalReport()    │
│                                                              │
│ Statut du projet: SOUMISSION_FINALE                        │
│ Entité Soutenance: N'EXISTE PAS ENCORE ❌                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 6 : CRÉATION DE LA SOUTENANCE ⚡                     │
├─────────────────────────────────────────────────────────────┤
│ L'encadrant clique "Proposer une soutenance"               │
│                                                              │
│ → defenseService.proposeDefense(proposal)                   │
│                                                              │
│ Backend (SoutenanceController):                             │
│   1. Crée new Soutenance()                                  │
│   2. Lie au projet (soutenance.setPfe(projet))             │
│   3. Remplit date/heure/salle                               │
│   4. Crée JuryMembers                                       │
│   5. Statut = "PROPOSEE"                                    │
│   6. Sauvegarde dans la DB                                  │
│                                                              │
│ Entité Soutenance: EXISTE MAINTENANT ✅                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 7-10 : Modification de la Soutenance existante       │
├─────────────────────────────────────────────────────────────┤
│ 7. Admin valide/modifie/reporte  → defenseService.validateDefense()   │
│ 8. Soutenance se déroule         → (hors application)                  │
│ 9. Encadrant évalue              → defenseService.evaluateDefense()    │
│ 10. Clôture du projet            → Visible par tous                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Tests et Mode Mock

Pour tester sans backend :

```typescript
// Dans votre composant, utilisez des données mock
const mockProjects = [
  { id: 1, title: 'Projet Test', status: 'SOUMISSION_FINALE', /* ... */ }
];

// Ou créez un mock service pour les tests
if (process.env.NODE_ENV === 'development') {
  // Utiliser mock data
} else {
  // Utiliser vrais services
}
```

---

## 📊 Types Principaux

### Defense (Soutenance)

```typescript
interface Defense {
  id: number;
  project: Project;
  proposedDate: string;
  proposedTime: string;
  proposedRoom: string;
  finalDate?: string;
  finalTime?: string;
  finalRoom?: string;
  status: 'PROPOSEE' | 'VALIDEE' | 'REPORTEE' | 'MODIFIEE';
  juryMembers: JuryMember[];
  proposedAt: string;
  validatedAt?: string;
  evaluation?: DefenseEvaluation;
}
```

### Project

```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  status: 'EN_ATTENTE_ASSIGNATION' | 'EN_REVISION' | 'REFUSE' | 
          'ACCEPTE' | 'EN_COURS' | 'SOUMISSION_FINALE' | 
          'SOUTENANCE_PLANIFIEE' | 'EVALUE';
  student: Student;
  professor?: Professor;
  proposalFile?: string;
  submittedAt: string;
}
```

---

## 🚀 Endpoints Backend Requis

### Defense Endpoints

```
POST   /api/defenses/propose              # Créer proposition (Professeur)
PUT    /api/defenses/{id}/validate        # Valider (Admin)
PUT    /api/defenses/{id}/modify          # Modifier (Admin)
PUT    /api/defenses/{id}/reject          # Reporter (Admin)
POST   /api/defenses/{id}/evaluate        # Évaluer (Professeur)
GET    /api/defenses/pending              # Propositions en attente
GET    /api/defenses/professor/{id}       # Soutenances d'un prof
GET    /api/defenses/student/{id}         # Soutenance d'un étudiant
GET    /api/defenses/upcoming             # Soutenances à venir
GET    /api/defenses/check-conflicts      # Vérifier conflits
```

### Project Endpoints

```
POST   /api/projects/submit               # Soumettre projet (Étudiant)
PUT    /api/projects/{id}/accept          # Accepter (Professeur)
PUT    /api/projects/{id}/reject          # Refuser (Professeur)
POST   /api/projects/{id}/assign          # Assigner encadrant (Admin)
POST   /api/projects/{id}/final-submission # Soumission finale (Étudiant)
GET    /api/projects/professor/{id}       # Projets d'un prof
GET    /api/projects/student/{id}         # Projet d'un étudiant
GET    /api/projects/pending-assignments  # Projets non assignés
GET    /api/projects/{id}/recommendations # Recommandations encadrants
GET    /api/projects/ready-for-defense    # Projets prêts pour soutenance
POST   /api/projects/deliverables         # Soumettre livrable
GET    /api/projects/{id}/deliverables    # Livrables d'un projet
```

---

## 🛡️ Gestion des Erreurs

Tous les services gèrent automatiquement les erreurs :

```typescript
try {
  const defense = await defenseService.proposeDefense(proposal);
} catch (error) {
  if (error.status === 400) {
    // Erreur de validation
    console.error('Données invalides:', error.errors);
  } else if (error.status === 404) {
    // Ressource non trouvée
    console.error('Projet non trouvé');
  } else if (error.status === 401) {
    // Non authentifié
    // Rediriger vers login
  } else {
    // Erreur générique
    console.error('Erreur:', error.message);
  }
}
```

---

## 📝 Notes Importantes

1. **La Soutenance n'est créée qu'une seule fois** : Lors de la proposition par l'encadrant
2. **Toujours vérifier le statut du projet** : Avant de permettre la proposition de soutenance
3. **Gestion des tokens** : Le token JWT est géré automatiquement par `apiClient`
4. **FormData pour les fichiers** : Utilisé automatiquement par les méthodes `upload()`
5. **Pagination** : Supportée par les méthodes `getProjects()` et `getDefenses()`

---

## 🎯 Conclusion

Cette architecture de services fournit :
- ✅ Une couche d'abstraction propre et type-safe
- ✅ Un workflow clair et documenté
- ✅ Une gestion automatique des erreurs
- ✅ Des hooks React pour faciliter l'intégration
- ✅ Une compatibilité 100% avec le backend Spring Boot

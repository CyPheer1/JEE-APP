import { useState } from 'react';
import { User } from '../App';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  FileText,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  User as UserIcon,
  Send,
  FileUp,
  Eye,
  Award,
  BookOpen,
  Info,
} from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSubmitProjectDialog, setShowSubmitProjectDialog] = useState(false);
  const [showSubmitFinalDialog, setShowSubmitFinalDialog] = useState(false);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);

  // Mock data - En production, ces données viendraient de l'API
  const project = {
    id: 1,
    title: "Système de recommandation intelligent basé sur l'IA",
    description: "Développement d'un système de recommandation personnalisé...",
    objectives: "Créer un algorithme de recommandation efficace...",
    methodology: "Utilisation de techniques de machine learning...",
    expectedResults: "Un système fonctionnel avec une précision >85%...",
    status: 'ACCEPTE', // EN_ATTENTE_ASSIGNATION, EN_REVISION, REFUSE, ACCEPTE, SOUMISSION_FINALE, SOUTENANCE_PLANIFIEE, EVALUE
    progress: 65,
    professor: {
      id: 10,
      name: 'Prof. Ahmed Bennani',
      email: 'ahmed.bennani@university.ma',
    },
    submittedAt: '15 Jan 2025',
    assignedAt: '16 Jan 2025',
    approvedAt: '18 Jan 2025',
    professorComments: 'Excellent sujet ! Très pertinent pour votre spécialisation. N\'oubliez pas de bien documenter votre méthodologie.',
    hasProject: true, // Pour savoir si l'étudiant a déjà soumis
    finalSubmittedAt: null,
  };

  const projectStatuses = {
    EN_ATTENTE_ASSIGNATION: { label: 'En attente d\'assignation', color: 'bg-yellow-100 text-yellow-800' },
    EN_REVISION: { label: 'En révision', color: 'bg-blue-100 text-blue-800' },
    REFUSE: { label: 'Refusé', color: 'bg-red-100 text-red-800' },
    ACCEPTE: { label: 'Accepté', color: 'bg-green-100 text-green-800' },
    SOUMISSION_FINALE: { label: 'Soumission finale', color: 'bg-purple-100 text-purple-800' },
    SOUTENANCE_PLANIFIEE: { label: 'Soutenance planifiée', color: 'bg-indigo-100 text-indigo-800' },
    EVALUE: { label: 'Évalué', color: 'bg-teal-100 text-teal-800' },
  };

  // Livrables soumis
  const deliverables = [
    {
      id: 1,
      title: 'Cahier des charges',
      description: 'Document définissant les spécifications du projet',
      type: 'RAPPORT_AVANCEMENT',
      fileName: 'cahier_des_charges.pdf',
      fileSize: 2048000,
      notes: 'Version initiale du cahier des charges',
      isFinal: false,
      submittedAt: '05 Fév 2025',
    },
    {
      id: 2,
      title: 'Rapport d\'avancement - Chapitre 1',
      description: 'État de l\'art et étude bibliographique',
      type: 'RAPPORT_AVANCEMENT',
      fileName: 'rapport_chapitre1.pdf',
      fileSize: 3500000,
      notes: 'Première partie du rapport',
      isFinal: false,
      submittedAt: '15 Mar 2025',
    },
    {
      id: 3,
      title: 'Code source - Version Alpha',
      description: 'Implémentation initiale de l\'algorithme',
      type: 'CODE',
      fileName: 'code_v1.zip',
      fileSize: 5120000,
      notes: 'Premier prototype fonctionnel',
      isFinal: false,
      submittedAt: '10 Avr 2025',
    },
  ];

  // Informations sur la soutenance (visible uniquement si validée par admin)
  const defense = {
    scheduled: true, // true si soutenance validée par admin
    status: 'VALIDEE', // PROPOSITION, VALIDEE, REPORTEE, MODIFIEE, TERMINEE
    scheduledDate: '15 Juin 2025',
    scheduledTime: '14:00',
    scheduledRoom: 'Salle A203',
    juryMembers: [
      { name: 'Prof. Ahmed Bennani', role: 'Président' },
      { name: 'Dr. Karim Alaoui', role: 'Examinateur' },
      { name: 'Dr. Samira Bennis', role: 'Examinateur' },
    ],
    reminders: [
      'Arriver 15 minutes avant l\'heure',
      'Préparer une présentation de 20 minutes maximum',
      'Apporter une clé USB de secours avec la présentation',
      'Prévoir 15-20 minutes pour les questions du jury',
    ],
  };

  // Évaluation de la soutenance (visible après évaluation par le professeur)
  const evaluation = {
    evaluated: false, // true si professeur a évalué
    presentationQuality: null, // 18,
    subjectMastery: null, // 17,
    questionsAnswers: null, // 16,
    timeRespect: null, // 19,
    finalGrade: null, // 17.5,
    evaluationComments: null, // 'Excellente présentation...',
    evaluatedAt: null, // '15 Juin 2025 16:30',
  };

  // Pour l'exemple, simulons une évaluation
  const evaluatedExample = {
    evaluated: true,
    presentationQuality: 18,
    subjectMastery: 17,
    questionsAnswers: 16,
    timeRespect: 19,
    finalGrade: 17.5,
    evaluationComments: 'Excellente présentation orale avec une très bonne maîtrise du sujet. Les réponses aux questions du jury étaient claires et pertinentes. Le temps a été parfaitement respecté. Félicitations pour ce travail de qualité !',
    evaluatedAt: '15 Juin 2025 16:30',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTE':
      case 'EVALUE':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'EN_REVISION':
      case 'SOUMISSION_FINALE':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'REFUSE':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout} title="Mon Projet de Fin d'Études" notificationCount={3}>
      <div className="space-y-6">
        {/* Project Header or Submit Project Prompt */}
        {project.hasProject ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                  <CardDescription>
                    {user.department} - {user.specialization}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={projectStatuses[project.status as keyof typeof projectStatuses].color}>
                    {projectStatuses[project.status as keyof typeof projectStatuses].label}
                  </Badge>
                  {getStatusIcon(project.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Afficher les commentaires si le projet est refusé */}
              {project.status === 'REFUSE' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Projet refusé - Révision nécessaire</AlertTitle>
                  <AlertDescription>
                    {project.professorComments}
                    <div className="mt-3">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Resoumettre une révision
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Afficher les commentaires si le projet est accepté */}
              {project.status === 'ACCEPTE' && project.professorComments && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Projet accepté</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {project.professorComments}
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Progression globale</span>
                  <span className="text-sm">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-1">Encadrant</p>
                  <p className="font-medium">{project.professor.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-1">Soumis le</p>
                  <p className="font-medium">{project.submittedAt}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-1">Assigné le</p>
                  <p className="font-medium">{project.assignedAt || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-1">Approuvé le</p>
                  <p className="font-medium">{project.approvedAt || '-'}</p>
                </div>
              </div>

              {/* Bouton Soumission Finale (visible uniquement si statut = ACCEPTE) */}
              {project.status === 'ACCEPTE' && (
                <div className="pt-2">
                  <Dialog open={showSubmitFinalDialog} onOpenChange={setShowSubmitFinalDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        <Send className="w-5 h-5 mr-2" />
                        Soumettre le Rapport Final
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Soumission Finale du Projet</DialogTitle>
                        <DialogDescription>
                          Cette soumission marque la fin de votre projet. Assurez-vous que tous vos documents sont complets.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Important</AlertTitle>
                          <AlertDescription>
                            Après la soumission finale, vous ne pourrez plus modifier vos documents. Votre encadrant pourra ensuite proposer une date de soutenance.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <Label htmlFor="final-title">Titre du document final *</Label>
                          <Input 
                            id="final-title"
                            placeholder="Rapport Final - PFE"
                            defaultValue="Rapport Final - PFE"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="final-description">Description</Label>
                          <Textarea 
                            id="final-description"
                            placeholder="Version finale du rapport avec tous les chapitres..."
                            className="min-h-24"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="final-file">Fichier PDF du rapport final *</Label>
                          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <FileUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Cliquez pour sélectionner votre rapport final
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF uniquement (Max 50MB)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          Soumettre définitivement
                        </Button>
                        <Button variant="outline" onClick={() => setShowSubmitFinalDialog(false)}>
                          Annuler
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl mb-2">Aucun projet soumis</h3>
              <p className="text-gray-600 mb-2">
                Commencez par soumettre votre sujet de PFE
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Un seul projet est autorisé par étudiant. Votre spécialisation : <strong>{user.specialization}</strong>
              </p>
              <Dialog open={showSubmitProjectDialog} onOpenChange={setShowSubmitProjectDialog}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Send className="w-5 h-5 mr-2" />
                    Soumettre mon sujet de PFE
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Soumettre un sujet de PFE</DialogTitle>
                    <DialogDescription>
                      Remplissez tous les champs requis. Votre projet sera automatiquement lié à votre département ({user.department}) et votre spécialisation ({user.specialization}).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="project-title">Titre du projet *</Label>
                      <Input 
                        id="project-title"
                        placeholder="Ex: Système de recommandation intelligent basé sur l'IA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Description *</Label>
                      <Textarea 
                        id="project-description"
                        placeholder="Décrivez votre projet de manière détaillée..."
                        className="min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-objectives">Objectifs *</Label>
                      <Textarea 
                        id="project-objectives"
                        placeholder="Listez les objectifs principaux de votre projet..."
                        className="min-h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-methodology">Méthodologie *</Label>
                      <Textarea 
                        id="project-methodology"
                        placeholder="Décrivez la méthodologie que vous comptez utiliser..."
                        className="min-h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-results">Résultats attendus *</Label>
                      <Textarea 
                        id="project-results"
                        placeholder="Quels sont les résultats que vous espérez obtenir..."
                        className="min-h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposal-file">Fichier PDF de proposition *</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <FileUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Cliquez pour sélectionner ou glissez-déposez votre fichier
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF uniquement (Max 5MB)
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Département</Label>
                        <Input value={user.department} disabled className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Spécialisation</Label>
                        <Input value={user.specialization} disabled className="bg-gray-50" />
                      </div>
                    </div>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Tous les champs marqués d'un astérisque (*) sont obligatoires. Votre projet sera examiné par l'administration avant d'être assigné à un encadrant.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Soumettre pour validation
                    </Button>
                    <Button variant="outline" onClick={() => setShowSubmitProjectDialog(false)}>
                      Annuler
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        {project.hasProject && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="deliverables">Livrables</TabsTrigger>
              <TabsTrigger value="defense">Soutenance</TabsTrigger>
              <TabsTrigger value="evaluation">Évaluation</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détails du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-500">Description</Label>
                    <p className="mt-1">{project.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-gray-500">Objectifs</Label>
                    <p className="mt-1">{project.objectives}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-gray-500">Méthodologie</Label>
                    <p className="mt-1">{project.methodology}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-gray-500">Résultats attendus</Label>
                    <p className="mt-1">{project.expectedResults}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Statut</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {projectStatuses[project.status as keyof typeof projectStatuses].label}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Livrables soumis</p>
                      <p className="text-2xl font-bold text-green-900">{deliverables.length}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-1">Progression</p>
                      <p className="text-2xl font-bold text-purple-900">{project.progress}%</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 mb-1">Soutenance</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {defense.scheduled ? 'Planifiée' : 'En attente'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Livrables */}
            <TabsContent value="deliverables" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Mes livrables</CardTitle>
                      <CardDescription>Rapports d'avancement, code source et documentation</CardDescription>
                    </div>
                    {project.status === 'ACCEPTE' && (
                      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                        <DialogTrigger asChild>
                          <Button>
                            <Upload className="w-4 h-4 mr-2" />
                            Soumettre un livrable
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Soumettre un nouveau livrable</DialogTitle>
                            <DialogDescription>
                              Ajoutez un rapport d'avancement, du code source ou de la documentation
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="deliverable-title">Titre du livrable *</Label>
                              <Input 
                                id="deliverable-title"
                                placeholder="Ex: Rapport d'avancement - Chapitre 2"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="deliverable-type">Type de livrable *</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="RAPPORT_AVANCEMENT">Rapport d'avancement</SelectItem>
                                  <SelectItem value="CODE">Code source</SelectItem>
                                  <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="deliverable-description">Description</Label>
                              <Textarea 
                                id="deliverable-description"
                                placeholder="Décrivez brièvement le contenu de ce livrable..."
                                className="min-h-24"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="deliverable-notes">Notes personnelles</Label>
                              <Textarea 
                                id="deliverable-notes"
                                placeholder="Ajoutez des notes ou commentaires pour votre encadrant..."
                                className="min-h-20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="file-upload">Fichier *</Label>
                              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <FileUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  Cliquez pour sélectionner ou glissez-déposez votre fichier
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PDF, ZIP, DOCX (Max 10MB)
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button className="flex-1">
                              <Upload className="w-4 h-4 mr-2" />
                              Soumettre
                            </Button>
                            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                              Annuler
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {deliverables.length > 0 ? (
                    <div className="space-y-3">
                      {deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <FileText className="w-5 h-5 text-gray-600 mt-1" />
                              <div className="flex-1">
                                <p className="font-medium">{deliverable.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span>Type: {deliverable.type}</span>
                                  <span>•</span>
                                  <span>{deliverable.fileName}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(deliverable.fileSize)}</span>
                                  <span>•</span>
                                  <span>Soumis le {deliverable.submittedAt}</span>
                                </div>
                                {deliverable.notes && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                    <p className="text-gray-600"><strong>Notes:</strong> {deliverable.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Aucun livrable soumis pour le moment</p>
                      <p className="text-sm mt-1">Commencez par soumettre votre premier livrable</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Soutenance */}
            <TabsContent value="defense" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations sur la soutenance</CardTitle>
                  <CardDescription>Détails de votre jury et planning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {defense.scheduled ? (
                    <>
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Soutenance confirmée</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Votre soutenance a été validée par l'administration. Tous les détails sont disponibles ci-dessous.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-gray-500 text-sm mb-1">Date</p>
                          <p className="font-medium text-lg">{defense.scheduledDate}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-gray-500 text-sm mb-1">Heure</p>
                          <p className="font-medium text-lg">{defense.scheduledTime}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-gray-500 text-sm mb-1">Lieu</p>
                          <p className="font-medium text-lg">{defense.scheduledRoom}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-gray-500 text-sm mb-1">Durée prévue</p>
                          <p className="font-medium text-lg">45 minutes</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Composition du jury</h4>
                        <div className="space-y-2">
                          {defense.juryMembers.map((member, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <UserIcon className="w-5 h-5 text-gray-600" />
                              <div className="flex-1">
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Rappels importants</h4>
                        <div className="space-y-2">
                          {defense.reminders.map((reminder, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1" />
                              <p className="text-sm text-gray-700">{reminder}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Alert>
                        <Calendar className="h-4 w-4" />
                        <AlertTitle>Préparez-vous bien</AlertTitle>
                        <AlertDescription>
                          N'hésitez pas à contacter votre encadrant pour toute question concernant la préparation de votre soutenance.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">Soutenance non planifiée</h3>
                      <p className="text-gray-600 mb-4">
                        {project.status === 'SOUMISSION_FINALE'
                          ? "Votre encadrant va bientôt proposer une date de soutenance à l'administration."
                          : "Vous devez d'abord soumettre votre rapport final pour que votre encadrant puisse planifier la soutenance."}
                      </p>
                      {project.status !== 'SOUMISSION_FINALE' && project.status === 'ACCEPTE' && (
                        <Button onClick={() => setShowSubmitFinalDialog(true)}>
                          <Send className="w-4 h-4 mr-2" />
                          Soumettre le rapport final
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Évaluation */}
            <TabsContent value="evaluation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rapport d'évaluation de la soutenance</CardTitle>
                  <CardDescription>Note finale et commentaires détaillés de votre encadrant</CardDescription>
                </CardHeader>
                <CardContent>
                  {evaluatedExample.evaluated ? (
                    <div className="space-y-6">
                      <Alert className="border-green-200 bg-green-50">
                        <Award className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Évaluation disponible</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Votre soutenance a été évaluée le {evaluatedExample.evaluatedAt}
                        </AlertDescription>
                      </Alert>

                      {/* Note finale */}
                      <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                        <p className="text-gray-600 mb-2">Note finale de soutenance</p>
                        <p className="text-6xl font-bold text-blue-600">{evaluatedExample.finalGrade}/20</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Note résultant de la délibération du jury
                        </p>
                      </div>

                      <Separator />

                      {/* Critères d'évaluation détaillés */}
                      <div>
                        <h4 className="font-medium mb-4">Critères d'évaluation détaillés</h4>
                        <div className="grid gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Qualité de la présentation orale</span>
                              <Badge className="bg-blue-100 text-blue-800">{evaluatedExample.presentationQuality}/20</Badge>
                            </div>
                            <Progress value={(evaluatedExample.presentationQuality / 20) * 100} className="h-2" />
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Maîtrise du sujet</span>
                              <Badge className="bg-blue-100 text-blue-800">{evaluatedExample.subjectMastery}/20</Badge>
                            </div>
                            <Progress value={(evaluatedExample.subjectMastery / 20) * 100} className="h-2" />
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Réponses aux questions du jury</span>
                              <Badge className="bg-blue-100 text-blue-800">{evaluatedExample.questionsAnswers}/20</Badge>
                            </div>
                            <Progress value={(evaluatedExample.questionsAnswers / 20) * 100} className="h-2" />
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Respect du temps imparti</span>
                              <Badge className="bg-blue-100 text-blue-800">{evaluatedExample.timeRespect}/20</Badge>
                            </div>
                            <Progress value={(evaluatedExample.timeRespect / 20) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Commentaires détaillés */}
                      <div>
                        <h4 className="font-medium mb-3">Commentaires détaillés de l'encadrant</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <p className="text-gray-700 leading-relaxed">{evaluatedExample.evaluationComments}</p>
                        </div>
                      </div>

                      <Alert>
                        <BookOpen className="h-4 w-4" />
                        <AlertTitle>Note importante</AlertTitle>
                        <AlertDescription>
                          Cette note est le résultat d'une délibération entre l'encadrant (Président du jury) et les membres du jury. Elle reflète votre performance globale lors de la soutenance.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">Évaluation non disponible</h3>
                      <p className="text-gray-600 mb-4">
                        {defense.scheduled
                          ? "Votre encadrant évaluera votre soutenance après sa réalisation."
                          : "Vous devez d'abord passer votre soutenance pour recevoir une évaluation."}
                      </p>
                      <p className="text-sm text-gray-500">
                        L'évaluation comprendra une note finale ainsi que des commentaires détaillés sur votre présentation.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profil */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mon profil</CardTitle>
                  <CardDescription>Informations personnelles et académiques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Étudiant</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Département</Label>
                      <p className="font-medium">{user.department}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Spécialisation</Label>
                      <p className="font-medium">{user.specialization}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Année académique</Label>
                      <p className="font-medium">2024-2025</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Statut</Label>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-gray-500">Encadrant assigné</Label>
                    {project.professor ? (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{project.professor.name}</p>
                        <p className="text-sm text-gray-600">{project.professor.email}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Non assigné</p>
                    )}
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Votre département et spécialisation ne peuvent pas être modifiés. Contactez l'administration pour toute modification.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}

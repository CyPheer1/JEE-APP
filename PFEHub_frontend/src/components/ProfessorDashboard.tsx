import { useState } from 'react';
import { User } from '../App';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Download,
  MessageSquare,
  Award,
  BarChart3,
  Users,
  Filter,
  AlertCircle,
  Send,
  Plus,
  Edit,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';

interface ProfessorDashboardProps {
  user: User;
  onLogout: () => void;
}

export function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectDetailsDialog, setShowProjectDetailsDialog] = useState(false);
  const [showDeliverablesDialog, setShowDeliverablesDialog] = useState(false);
  const [showProposeDefenseDialog, setShowProposeDefenseDialog] = useState(false);
  const [showEvaluateDefenseDialog, setShowEvaluateDefenseDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - En production, ces données viendraient de l'API
  const projects = [
    {
      id: 1,
      title: "Système de recommandation intelligent basé sur l'IA",
      student: {
        id: 101,
        name: 'Leila Amrani',
        email: 'leila.amrani@student.ma',
        specialization: 'Intelligence Artificielle',
      },
      status: 'EN_REVISION', // EN_REVISION, REFUSE, ACCEPTE, SOUMISSION_FINALE, SOUTENANCE_PLANIFIEE, EVALUE
      submittedAt: '15 Jan 2025',
      assignedAt: '16 Jan 2025',
      progress: 35,
      deliverablesCount: 2,
      proposalFile: 'proposition_projet.pdf',
    },
    {
      id: 2,
      title: "Optimisation des réseaux de neurones profonds",
      student: {
        id: 102,
        name: 'Youssef Benkirane',
        email: 'youssef.benkirane@student.ma',
        specialization: 'Intelligence Artificielle',
      },
      status: 'ACCEPTE',
      submittedAt: '12 Jan 2025',
      assignedAt: '14 Jan 2025',
      approvedAt: '17 Jan 2025',
      progress: 65,
      deliverablesCount: 4,
      proposalFile: 'proposition_projet.pdf',
    },
    {
      id: 3,
      title: "Application de détection de fraude par machine learning",
      student: {
        id: 103,
        name: 'Sara Idrissi',
        email: 'sara.idrissi@student.ma',
        specialization: 'Cybersécurité',
      },
      status: 'SOUMISSION_FINALE',
      submittedAt: '10 Jan 2025',
      assignedAt: '12 Jan 2025',
      approvedAt: '15 Jan 2025',
      finalSubmittedAt: '10 Avr 2025',
      progress: 100,
      deliverablesCount: 6,
      proposalFile: 'proposition_projet.pdf',
    },
  ];

  const projectStatuses = {
    EN_REVISION: { label: 'En révision', color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" /> },
    REFUSE: { label: 'Refusé', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
    ACCEPTE: { label: 'Accepté', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-4 h-4" /> },
    SOUMISSION_FINALE: { label: 'Soumission finale', color: 'bg-purple-100 text-purple-800', icon: <Send className="w-4 h-4" /> },
    SOUTENANCE_PLANIFIEE: { label: 'Soutenance planifiée', color: 'bg-indigo-100 text-indigo-800', icon: <Calendar className="w-4 h-4" /> },
    EVALUE: { label: 'Évalué', color: 'bg-teal-100 text-teal-800', icon: <Award className="w-4 h-4" /> },
  };

  // Statistiques
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => ['ACCEPTE', 'SOUMISSION_FINALE'].includes(p.status)).length,
    pendingReview: projects.filter(p => p.status === 'EN_REVISION').length,
    completed: projects.filter(p => p.status === 'EVALUE').length,
    averageGrade: 16.2,
    upcomingDefenses: 2,
  };

  // Soutenances
  const defenses = [
    {
      id: 1,
      project: {
        id: 3,
        title: "Application de détection de fraude par machine learning",
        student: { name: 'Sara Idrissi' },
      },
      proposedDate: '15 Juin 2025',
      proposedTime: '14:00',
      proposedRoom: 'Salle A203',
      status: 'PROPOSITION', // PROPOSITION, VALIDEE, REPORTEE, MODIFIEE, TERMINEE
      juryMembers: [
        { name: 'Dr. Karim Alaoui', role: 'Examinateur' },
        { name: 'Dr. Samira Bennis', role: 'Examinateur' },
      ],
      proposedAt: '11 Avr 2025',
    },
    {
      id: 2,
      project: {
        id: 4,
        title: "Blockchain pour la sécurité des données médicales",
        student: { name: 'Hassan Tazi' },
      },
      proposedDate: '18 Juin 2025',
      proposedTime: '10:00',
      proposedRoom: 'Salle B105',
      scheduledDate: '18 Juin 2025',
      scheduledTime: '10:00',
      scheduledRoom: 'Salle B105',
      status: 'VALIDEE',
      juryMembers: [
        { name: 'Dr. Nadia Benjelloun', role: 'Examinateur' },
        { name: 'Prof. Omar Fassi', role: 'Examinateur' },
      ],
      validatedAt: '12 Avr 2025',
    },
  ];

  const defenseStatuses = {
    PROPOSITION: { label: 'En attente de validation', color: 'bg-yellow-100 text-yellow-800' },
    VALIDEE: { label: 'Validée', color: 'bg-green-100 text-green-800' },
    REPORTEE: { label: 'Reportée', color: 'bg-orange-100 text-orange-800' },
    MODIFIEE: { label: 'Modifiée', color: 'bg-blue-100 text-blue-800' },
    TERMINEE: { label: 'Terminée', color: 'bg-gray-100 text-gray-800' },
  };

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  const handleApproveProject = (projectId: number) => {
    // Logique pour approuver le projet
    console.log('Approuver projet:', projectId);
  };

  const handleRejectProject = (projectId: number) => {
    // Logique pour refuser le projet
    console.log('Refuser projet:', projectId);
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout} title="Espace Professeur" notificationCount={5}>
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total projets</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Actifs</p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">En révision</p>
                  <p className="text-2xl font-bold">{stats.pendingReview}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Terminés</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Note moyenne</p>
                  <p className="text-2xl font-bold">{stats.averageGrade}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Soutenances</p>
                  <p className="text-2xl font-bold">{stats.upcomingDefenses}</p>
                </div>
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Mes projets</TabsTrigger>
            <TabsTrigger value="defenses">Soutenances</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          {/* Onglet Projets */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Projets assignés</CardTitle>
                    <CardDescription>Supervisez et validez les projets de vos étudiants</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="EN_REVISION">En révision</SelectItem>
                        <SelectItem value="ACCEPTE">Accepté</SelectItem>
                        <SelectItem value="SOUMISSION_FINALE">Soumission finale</SelectItem>
                        <SelectItem value="SOUTENANCE_PLANIFIEE">Soutenance planifiée</SelectItem>
                        <SelectItem value="EVALUE">Évalué</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{project.title}</h3>
                            <Badge className={projectStatuses[project.status as keyof typeof projectStatuses].color}>
                              {projectStatuses[project.status as keyof typeof projectStatuses].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.student.name}
                            </span>
                            <span>•</span>
                            <span>{project.student.specialization}</span>
                            <span>•</span>
                            <span>Soumis le {project.submittedAt}</span>
                            <span>•</span>
                            <span>{project.deliverablesCount} livrables</span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progression</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowProjectDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowDeliverablesDialog(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Livrables ({project.deliverablesCount})
                        </Button>
                        {project.status === 'EN_REVISION' && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Accepter
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Accepter le projet</DialogTitle>
                                  <DialogDescription>
                                    Vous vous apprêtez à accepter le sujet de {project.student.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800">Validation du sujet</AlertTitle>
                                    <AlertDescription className="text-green-700">
                                      En acceptant ce projet, l'étudiant pourra commencer à travailler sur son PFE et soumettre des livrables.
                                    </AlertDescription>
                                  </Alert>
                                  <div className="space-y-2">
                                    <Label htmlFor="approval-comments">Commentaires et recommandations</Label>
                                    <Textarea 
                                      id="approval-comments"
                                      placeholder="Excellent sujet ! Quelques recommandations pour la suite..."
                                      className="min-h-32"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <Button className="flex-1" onClick={() => handleApproveProject(project.id)}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Confirmer l'acceptation
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Refuser
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Refuser le projet</DialogTitle>
                                  <DialogDescription>
                                    Expliquez les raisons du refus pour que l'étudiant puisse réviser sa proposition
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Refus du sujet</AlertTitle>
                                    <AlertDescription>
                                      L'étudiant recevra vos commentaires et pourra resoumettre une version révisée de sa proposition.
                                    </AlertDescription>
                                  </Alert>
                                  <div className="space-y-2">
                                    <Label htmlFor="rejection-reason">Raison principale du refus *</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une raison" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="scope">Périmètre du projet trop large/petit</SelectItem>
                                        <SelectItem value="methodology">Méthodologie insuffisante</SelectItem>
                                        <SelectItem value="objectives">Objectifs pas assez clairs</SelectItem>
                                        <SelectItem value="feasibility">Faisabilité douteuse</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="rejection-comments">Commentaires détaillés *</Label>
                                    <Textarea 
                                      id="rejection-comments"
                                      placeholder="Veuillez préciser les points à améliorer : méthodologie, objectifs, faisabilité..."
                                      className="min-h-32"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <Button variant="destructive" className="flex-1" onClick={() => handleRejectProject(project.id)}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Confirmer le refus
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        {project.status === 'SOUMISSION_FINALE' && (
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedProject(project);
                              setShowProposeDefenseDialog(true);
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Proposer une soutenance
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Soutenances */}
          <TabsContent value="defenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des soutenances</CardTitle>
                <CardDescription>Proposez et évaluez les soutenances de vos étudiants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defenses.map((defense) => (
                    <div key={defense.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-1">{defense.project.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">Étudiant: {defense.project.student.name}</p>
                          <Badge className={defenseStatuses[defense.status as keyof typeof defenseStatuses].color}>
                            {defenseStatuses[defense.status as keyof typeof defenseStatuses].label}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Date proposée</p>
                          <p className="font-medium">{defense.proposedDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Heure</p>
                          <p className="font-medium">{defense.proposedTime}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Salle</p>
                          <p className="font-medium">{defense.proposedRoom}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Membres du jury proposés:</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">Président</Badge>
                            <span>Vous-même</span>
                          </div>
                          {defense.juryMembers.map((member, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">{member.role}</Badge>
                              <span>{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {defense.status === 'PROPOSITION' && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier la proposition
                            </Button>
                            <Alert className="flex-1">
                              <Clock className="h-4 w-4" />
                              <AlertDescription>
                                En attente de validation par l'administration
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                        {defense.status === 'VALIDEE' && (
                          <>
                            <Button 
                              onClick={() => {
                                setSelectedProject(defense.project);
                                setShowEvaluateDefenseDialog(true);
                              }}
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Évaluer la soutenance
                            </Button>
                            <Alert className="flex-1 border-green-200 bg-green-50">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-700">
                                Soutenance confirmée le {defense.scheduledDate} à {defense.scheduledTime}
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques personnelles</CardTitle>
                <CardDescription>Vue d'ensemble de vos projets supervisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-2">Projets supervisés actuellement</p>
                      <p className="text-4xl font-bold text-blue-900">{stats.totalProjects}</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-2">Projets terminés</p>
                      <p className="text-4xl font-bold text-green-900">{stats.completed}</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-2">Note moyenne attribuée</p>
                      <p className="text-4xl font-bold text-purple-900">{stats.averageGrade}/20</p>
                    </div>
                    <div className="p-6 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 mb-2">Projets en attente de révision</p>
                      <p className="text-4xl font-bold text-orange-900">{stats.pendingReview}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Répartition par statut</h3>
                    <div className="space-y-3">
                      {Object.entries(projectStatuses).map(([status, config]) => {
                        const count = projects.filter(p => p.status === status).length;
                        const percentage = (count / projects.length) * 100;
                        return (
                          <div key={status}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">{config.label}</span>
                              <span className="text-sm font-medium">{count} projet(s)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog: Proposer une soutenance */}
        <Dialog open={showProposeDefenseDialog} onOpenChange={setShowProposeDefenseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Proposer une soutenance</DialogTitle>
              <DialogDescription>
                Planifiez la soutenance pour {selectedProject?.student.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Votre proposition sera soumise à l'administration pour validation. L'admin pourra accepter, modifier ou reporter cette planification.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defense-date">Date proposée *</Label>
                  <Input type="date" id="defense-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defense-time">Heure *</Label>
                  <Input type="time" id="defense-time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defense-room">Salle *</Label>
                <Input 
                  id="defense-room"
                  placeholder="Ex: Salle A203"
                />
              </div>
              <div className="space-y-2">
                <Label>Membres du jury (2 membres requis)</Label>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                    <Badge variant="outline">Président</Badge>
                    <span className="text-sm">Vous-même (encadrant)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Nom du 1er examinateur" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="examinateur">Examinateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Nom du 2ème examinateur" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="examinateur">Examinateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Envoyer la proposition
              </Button>
              <Button variant="outline" onClick={() => setShowProposeDefenseDialog(false)}>
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Évaluer la soutenance */}
        <Dialog open={showEvaluateDefenseDialog} onOpenChange={setShowEvaluateDefenseDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Évaluer la soutenance</DialogTitle>
              <DialogDescription>
                Saisissez la note finale et les commentaires après délibération du jury
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Important</AlertTitle>
                <AlertDescription className="text-blue-700">
                  La note finale est le résultat d'une délibération entre vous (Président du jury) et les membres du jury. Cette note reflète la performance globale de l'étudiant lors de la soutenance.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-medium">Critères d'évaluation de la présentation</h3>
                <p className="text-sm text-gray-600">
                  Évaluez chaque critère sur 20. Ces notes vous aideront à déterminer la note finale.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="presentation-quality">Qualité de la présentation orale (/ 20)</Label>
                    <Input 
                      id="presentation-quality"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      placeholder="Ex: 18"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-mastery">Maîtrise du sujet (/ 20)</Label>
                    <Input 
                      id="subject-mastery"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      placeholder="Ex: 17"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="questions-answers">Réponses aux questions du jury (/ 20)</Label>
                    <Input 
                      id="questions-answers"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      placeholder="Ex: 16"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-respect">Respect du temps imparti (/ 20)</Label>
                    <Input 
                      id="time-respect"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      placeholder="Ex: 19"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="final-grade">Note finale de soutenance (/ 20) *</Label>
                  <Input 
                    id="final-grade"
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    placeholder="Ex: 17.5"
                    className="text-lg font-medium"
                  />
                  <p className="text-sm text-gray-500">
                    Cette note est le résultat de votre délibération avec les membres du jury
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evaluation-comments">Commentaires détaillés *</Label>
                  <Textarea 
                    id="evaluation-comments"
                    placeholder="Rédigez vos commentaires détaillés sur la soutenance : points forts, points à améliorer, appréciation générale..."
                    className="min-h-40"
                  />
                  <p className="text-sm text-gray-500">
                    Minimum 20 caractères. Ces commentaires seront visibles par l'étudiant et l'administration.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1">
                <Award className="w-4 h-4 mr-2" />
                Confirmer l'évaluation
              </Button>
              <Button variant="outline" onClick={() => setShowEvaluateDefenseDialog(false)}>
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Détails du projet */}
        <Dialog open={showProjectDetailsDialog} onOpenChange={setShowProjectDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du projet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedProject && (
                <>
                  <div>
                    <Label className="text-gray-500">Titre</Label>
                    <p className="mt-1 font-medium">{selectedProject.title}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-gray-500">Étudiant</Label>
                    <p className="mt-1">{selectedProject.student.name} ({selectedProject.student.email})</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-gray-500">Fichier de proposition</Label>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger {selectedProject.proposalFile}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Livrables */}
        <Dialog open={showDeliverablesDialog} onOpenChange={setShowDeliverablesDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Livrables de l'étudiant</DialogTitle>
              <DialogDescription>
                {selectedProject?.student.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-gray-600">Aucun livrable disponible pour le moment.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
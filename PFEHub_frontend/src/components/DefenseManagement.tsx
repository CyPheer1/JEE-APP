import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Calendar, CheckCircle2, Clock, AlertCircle, User, GraduationCap, FileText, Plus, Search, Edit, X } from 'lucide-react';
import { Separator } from './ui/separator';

interface Project {
  id: number;
  title: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
  professor: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
  submittedAt: string;
}

interface Defense {
  id: number;
  project: Project;
  proposedDate: string;
  proposedTime: string;
  proposedRoom: string;
  status: 'PROPOSITION' | 'VALIDEE' | 'REPORTEE' | 'MODIFIEE';
  juryMembers: Array<{
    name: string;
    role: string;
  }>;
  proposedAt: string;
  validatedAt?: string;
}

// Mock data - En production, viendraient de l'API
const mockProjects: Project[] = [
  {
    id: 1,
    title: "Système de recommandation intelligent basé sur l'IA",
    student: { id: 101, name: 'Leila Amrani', email: 'leila.amrani@student.ma' },
    professor: { id: 1, name: 'Prof. Ahmed Bennani', email: 'ahmed.bennani@prof.ma' },
    status: 'SOUMISSION_FINALE',
    submittedAt: '15 Mai 2025',
  },
  {
    id: 2,
    title: "Application mobile de gestion de tâches avec IA",
    student: { id: 102, name: 'Youssef Benkirane', email: 'youssef.b@student.ma' },
    professor: { id: 1, name: 'Prof. Ahmed Bennani', email: 'ahmed.bennani@prof.ma' },
    status: 'SOUMISSION_FINALE',
    submittedAt: '12 Mai 2025',
  },
  {
    id: 3,
    title: "Blockchain pour la sécurité des données médicales",
    student: { id: 103, name: 'Sara Idrissi', email: 'sara.idrissi@student.ma' },
    professor: { id: 2, name: 'Prof. Samira Bennis', email: 'samira.bennis@prof.ma' },
    status: 'SOUMISSION_FINALE',
    submittedAt: '10 Mai 2025',
  },
];

const mockDefenses: Defense[] = [
  {
    id: 1,
    project: mockProjects[0],
    proposedDate: '15 Juin 2025',
    proposedTime: '14:00',
    proposedRoom: 'Salle A203',
    status: 'PROPOSITION',
    juryMembers: [
      { name: 'Dr. Karim Alaoui', role: 'Examinateur' },
      { name: 'Dr. Samira Bennis', role: 'Examinateur' },
    ],
    proposedAt: '20 Mai 2025',
  },
];

interface DefenseManagementProps {
  role: 'professor' | 'admin';
  userId?: number;
}

export function DefenseManagement({ role, userId }: DefenseManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State pour le formulaire de création
  const [defenseForm, setDefenseForm] = useState({
    date: '',
    time: '',
    room: '',
    juryMember1: '',
    juryMember2: '',
  });

  // Filtrer les projets selon le rôle
  const availableProjects = role === 'professor' 
    ? mockProjects.filter(p => p.professor.id === userId && p.status === 'SOUMISSION_FINALE')
    : mockProjects.filter(p => p.status === 'SOUMISSION_FINALE');

  const filteredProjects = availableProjects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDefense = () => {
    console.log('Creating defense:', {
      project: selectedProject,
      ...defenseForm,
    });
    // En production: appel API pour créer la soutenance
    setShowCreateDialog(false);
    setDefenseForm({ date: '', time: '', room: '', juryMember1: '', juryMember2: '' });
    setSelectedProject(null);
  };

  const handleValidateDefense = (action: 'validate' | 'modify' | 'reject') => {
    console.log(`${action} defense:`, selectedDefense);
    // En production: appel API
    setShowValidateDialog(false);
    setSelectedDefense(null);
  };

  const defenseStatuses = {
    PROPOSITION: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    VALIDEE: { label: 'Validée', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    REPORTEE: { label: 'Reportée', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    MODIFIEE: { label: 'Modifiée', color: 'bg-blue-100 text-blue-800', icon: Edit },
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Créer une nouvelle proposition de soutenance */}
      {role === 'professor' && (
        <Card>
          <CardHeader>
            <CardTitle>Proposer une soutenance</CardTitle>
            <CardDescription>
              Sélectionnez un projet avec soumission finale pour proposer une date de soutenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un étudiant ou un projet..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Liste des projets éligibles */}
              <div className="space-y-3">
                {filteredProjects.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Aucun projet en attente de soutenance. Les étudiants doivent d'abord soumettre leur rapport final.
                    </AlertDescription>
                  </Alert>
                ) : (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{project.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              <span>{project.student.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>Soumis le {project.submittedAt}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Soumission finale
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowCreateDialog(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Proposer une soutenance
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Propositions en attente (pour Admin) */}
      {role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Propositions de soutenances en attente</CardTitle>
            <CardDescription>
              {mockDefenses.length} proposition(s) à valider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDefenses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucune proposition de soutenance en attente de validation.
                  </AlertDescription>
                </Alert>
              ) : (
                mockDefenses.map((defense) => {
                  const StatusIcon = defenseStatuses[defense.status].icon;
                  return (
                    <div key={defense.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-2">{defense.project.title}</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <GraduationCap className="w-4 h-4" />
                              <div>
                                <p className="font-medium text-gray-900">{defense.project.student.name}</p>
                                <p className="text-xs">{defense.project.student.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <div>
                                <p className="font-medium text-gray-900">{defense.project.professor.name}</p>
                                <p className="text-xs">{defense.project.professor.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className={defenseStatuses[defense.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {defenseStatuses[defense.status].label}
                        </Badge>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Date proposée</p>
                          <p className="font-medium text-sm">{defense.proposedDate}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Heure</p>
                          <p className="font-medium text-sm">{defense.proposedTime}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Salle proposée</p>
                          <p className="font-medium text-sm">{defense.proposedRoom}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Composition du jury proposée :</p>
                        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                              Président
                            </Badge>
                            <span className="font-medium">{defense.project.professor.name}</span>
                            <span className="text-gray-500">(Encadrant)</span>
                          </div>
                          {defense.juryMembers.map((member, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">
                                {member.role}
                              </Badge>
                              <span>{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedDefense(defense);
                            setShowValidateDialog(true);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Valider
                        </Button>
                        <Button variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Reporter
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog: Créer une proposition de soutenance */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proposer une soutenance</DialogTitle>
            <DialogDescription>
              Planifiez la soutenance pour le projet de {selectedProject?.student.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Informations du projet */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-blue-900">Informations du projet</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Titre :</span>
                  <span className="font-medium text-blue-900">{selectedProject?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Étudiant :</span>
                  <span className="font-medium text-blue-900">{selectedProject?.student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Email étudiant :</span>
                  <span className="text-blue-900">{selectedProject?.student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Encadrant :</span>
                  <span className="font-medium text-blue-900">{selectedProject?.professor.name}</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Votre proposition sera envoyée à l'administration pour validation. L'admin pourra accepter, modifier ou reporter cette planification.
              </AlertDescription>
            </Alert>

            {/* Planification */}
            <div className="space-y-4">
              <h4 className="font-medium">Planification de la soutenance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defense-date">Date proposée *</Label>
                  <Input
                    type="date"
                    id="defense-date"
                    value={defenseForm.date}
                    onChange={(e) => setDefenseForm({ ...defenseForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defense-time">Heure *</Label>
                  <Input
                    type="time"
                    id="defense-time"
                    value={defenseForm.time}
                    onChange={(e) => setDefenseForm({ ...defenseForm, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defense-room">Salle proposée *</Label>
                <Input
                  id="defense-room"
                  placeholder="Ex: Salle A203, Amphithéâtre B..."
                  value={defenseForm.room}
                  onChange={(e) => setDefenseForm({ ...defenseForm, room: e.target.value })}
                />
              </div>
            </div>

            {/* Composition du jury */}
            <div className="space-y-4">
              <h4 className="font-medium">Composition du jury</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    Président
                  </Badge>
                  <span className="text-sm font-medium">{selectedProject?.professor.name}</span>
                  <span className="text-sm text-gray-500">(Vous - Encadrant)</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jury-member-1">1er Examinateur *</Label>
                  <Input
                    id="jury-member-1"
                    placeholder="Nom complet (ex: Dr. Karim Alaoui)"
                    value={defenseForm.juryMember1}
                    onChange={(e) => setDefenseForm({ ...defenseForm, juryMember1: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jury-member-2">2ème Examinateur *</Label>
                  <Input
                    id="jury-member-2"
                    placeholder="Nom complet (ex: Prof. Samira Bennis)"
                    value={defenseForm.juryMember2}
                    onChange={(e) => setDefenseForm({ ...defenseForm, juryMember2: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleCreateDefense}
              disabled={!defenseForm.date || !defenseForm.time || !defenseForm.room || !defenseForm.juryMember1 || !defenseForm.juryMember2}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Envoyer la proposition
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setDefenseForm({ date: '', time: '', room: '', juryMember1: '', juryMember2: '' });
              }}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Valider une soutenance (Admin) */}
      <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Valider la proposition de soutenance</DialogTitle>
            <DialogDescription>
              Vérifiez et validez la soutenance proposée par {selectedDefense?.project.professor.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Récapitulatif */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 mb-2">Récapitulatif de la soutenance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-green-700">Projet :</span>
                        <p className="font-medium text-green-900">{selectedDefense?.project.title}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Étudiant :</span>
                        <p className="font-medium text-green-900">{selectedDefense?.project.student.name}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Encadrant :</span>
                        <p className="font-medium text-green-900">{selectedDefense?.project.professor.name}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Date/Heure :</span>
                        <p className="font-medium text-green-900">
                          {selectedDefense?.proposedDate} à {selectedDefense?.proposedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Validation</AlertTitle>
              <AlertDescription>
                En validant, la soutenance sera confirmée. L'étudiant et l'encadrant recevront une notification par email.
              </AlertDescription>
            </Alert>

            {/* Modification possible */}
            <div className="space-y-4">
              <h4 className="font-medium">Ajustements (optionnel)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date finale</Label>
                  <Input type="date" defaultValue={selectedDefense?.proposedDate} />
                </div>
                <div className="space-y-2">
                  <Label>Heure finale</Label>
                  <Input type="time" defaultValue={selectedDefense?.proposedTime} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Salle</Label>
                <Input defaultValue={selectedDefense?.proposedRoom} />
              </div>
            </div>

            {/* Jury */}
            <div className="space-y-2">
              <Label>Composition du jury</Label>
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Président</Badge>
                  <span className="font-medium">{selectedDefense?.project.professor.name}</span>
                </div>
                {selectedDefense?.juryMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{member.role}</Badge>
                    <Input defaultValue={member.name} className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => handleValidateDefense('validate')}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmer la validation
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowValidateDialog(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

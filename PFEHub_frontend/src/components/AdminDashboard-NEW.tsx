import { useState, useEffect } from 'react';
import { User } from '../App';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Users,
  Building2,
  GraduationCap,
  Calendar,
  UserPlus,
  Plus,
  Search,
  FileText,
  Edit,
  Trash2,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Clock,
  Settings,
  Eye,
  X,
  Check,
  Award,
  BarChart3,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { useAdminData } from '../hooks/useAdminData';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDeptDialog, setShowCreateDeptDialog] = useState(false);
  const [showCreateSpecDialog, setShowCreateSpecDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showConfigYearDialog, setShowConfigYearDialog] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showDefenseValidationDialog, setShowDefenseValidationDialog] = useState(false);
  const [showEvaluationReportDialog, setShowEvaluationReportDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedDefense, setSelectedDefense] = useState<any>(null);
  
  // Form state for creating/editing
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDescription, setNewDeptDescription] = useState('');
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecCode, setNewSpecCode] = useState('');
  const [newSpecDescription, setNewSpecDescription] = useState('');
  const [newSpecDeptId, setNewSpecDeptId] = useState<number | null>(null);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [editingSpec, setEditingSpec] = useState<any>(null);

  // Hook for fetching real data from API
  const {
    loading,
    error,
    stats,
    departments,
    specializations,
    academicYears,
    currentAcademicYear,
    students,
    professors,
    refreshDepartments,
    refreshSpecializations,
    refreshAcademicYears,
    refreshStudents,
    refreshProfessors,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    deleteUser,
  } = useAdminData();

  // Compute stats from real data
  const computedStats = {
    totalStudents: stats?.totalStudents || students.length,
    totalProfessors: stats?.totalProfessors || professors.length,
    activePFEs: stats?.activeProjects || 0,
    upcomingDefenses: stats?.upcomingDefenses || 0,
  };

  // Handle department creation
  const handleCreateDepartment = async () => {
    if (!newDeptName || !newDeptCode) return;
    const success = await createDepartment({
      name: newDeptName,
      code: newDeptCode,
      description: newDeptDescription,
    });
    if (success) {
      setShowCreateDeptDialog(false);
      setNewDeptName('');
      setNewDeptCode('');
      setNewDeptDescription('');
    }
  };

  // Handle department deletion
  const handleDeleteDepartment = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      await deleteDepartment(id);
    }
  };

  // Handle specialization creation
  const handleCreateSpecialization = async () => {
    if (!newSpecName || !newSpecCode || !newSpecDeptId) return;
    const success = await createSpecialization({
      name: newSpecName,
      code: newSpecCode,
      description: newSpecDescription,
      departmentId: newSpecDeptId,
    });
    if (success) {
      setShowCreateSpecDialog(false);
      setNewSpecName('');
      setNewSpecCode('');
      setNewSpecDescription('');
      setNewSpecDeptId(null);
    }
  };

  // Handle specialization deletion
  const handleDeleteSpecialization = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette spécialisation ?')) {
      await deleteSpecialization(id);
    }
  };

  // Map backend data to UI format
  const academicYear = currentAcademicYear ? {
    year: currentAcademicYear.year,
    active: currentAcademicYear.isCurrent,
    submissionStartDate: currentAcademicYear.submissionStartDate,
    submissionEndDate: currentAcademicYear.submissionEndDate,
    defenseStartDate: currentAcademicYear.defenseStartDate,
    defenseEndDate: currentAcademicYear.defenseEndDate,
  } : {
    year: '2024-2025',
    active: false,
    submissionStartDate: '',
    submissionEndDate: '',
    defenseStartDate: '',
    defenseEndDate: '',
  };

  const pendingAssignments = [
    {
      id: 1,
      title: "Système de recommandation intelligent basé sur l'IA",
      student: {
        id: 101,
        name: 'Leila Amrani',
        email: 'leila.amrani@student.ma',
        specialization: 'Intelligence Artificielle',
      },
      submittedAt: '15 Jan 2025',
      recommendedProfessors: [
        {
          id: 1,
          name: 'Prof. Ahmed Bennani',
          matchPercentage: 95,
          currentWorkload: 3,
          maxWorkload: 5,
          expertise: ['IA', 'Machine Learning'],
        },
        {
          id: 2,
          name: 'Prof. Fatima Idrissi',
          matchPercentage: 85,
          currentWorkload: 2,
          maxWorkload: 5,
          expertise: ['IA', 'Deep Learning'],
        },
      ],
    },
    {
      id: 2,
      title: "Application de détection de fraude par machine learning",
      student: {
        id: 102,
        name: 'Sara Idrissi',
        email: 'sara.idrissi@student.ma',
        specialization: 'Cybersécurité',
      },
      submittedAt: '12 Jan 2025',
      recommendedProfessors: [
        {
          id: 3,
          name: 'Prof. Samira Bennis',
          matchPercentage: 90,
          currentWorkload: 2,
          maxWorkload: 5,
          expertise: ['Cybersécurité', 'IA'],
        },
      ],
    },
  ];

  const defenseProposals = [
    {
      id: 1,
      project: {
        id: 5,
        title: "Système de recommandation intelligent",
        student: { name: 'Leila Amrani' },
      },
      professor: { name: 'Prof. Ahmed Bennani' },
      proposedDate: '15 Juin 2025',
      proposedTime: '14:00',
      proposedRoom: 'Salle A203',
      status: 'PROPOSITION', // PROPOSITION, VALIDEE, REPORTEE, MODIFIEE
      juryMembers: [
        { name: 'Dr. Karim Alaoui', role: 'Examinateur' },
        { name: 'Dr. Samira Bennis', role: 'Examinateur' },
      ],
      proposedAt: '10 Avr 2025',
    },
    {
      id: 2,
      project: {
        id: 6,
        title: "Blockchain pour la sécurité des données",
        student: { name: 'Hassan Tazi' },
      },
      professor: { name: 'Prof. Omar Fassi' },
      proposedDate: '18 Juin 2025',
      proposedTime: '10:00',
      proposedRoom: 'Salle B105',
      status: 'PROPOSITION',
      juryMembers: [
        { name: 'Dr. Nadia Benjelloun', role: 'Examinateur' },
        { name: 'Prof. Youssef Alami', role: 'Examinateur' },
      ],
      proposedAt: '11 Avr 2025',
    },
  ];

  const evaluatedDefenses = [
    {
      id: 1,
      project: {
        title: "Optimisation des réseaux de neurones",
        student: { name: 'Youssef Benkirane' },
      },
      professor: { name: 'Prof. Ahmed Bennani' },
      defenseDate: '10 Juin 2025',
      presentationQuality: 18,
      subjectMastery: 17,
      questionsAnswers: 16,
      timeRespect: 19,
      finalGrade: 17.5,
      evaluationComments: 'Excellente présentation avec une très bonne maîtrise du sujet...',
      evaluatedAt: '10 Juin 2025 16:30',
    },
  ];

  const calendarDefenses = [
    {
      date: '15 Juin 2025',
      time: '14:00',
      room: 'Salle A203',
      student: 'Leila Amrani',
      professor: 'Prof. Ahmed Bennani',
      status: 'VALIDEE',
    },
    {
      date: '15 Juin 2025',
      time: '16:00',
      room: 'Salle B105',
      student: 'Sara Idrissi',
      professor: 'Prof. Samira Bennis',
      status: 'VALIDEE',
    },
    {
      date: '18 Juin 2025',
      time: '10:00',
      room: 'Salle A203',
      student: 'Hassan Tazi',
      professor: 'Prof. Omar Fassi',
      status: 'PROPOSITION',
    },
  ];

  const defenseStatuses = {
    PROPOSITION: { label: 'Proposition', color: 'bg-yellow-100 text-yellow-800' },
    VALIDEE: { label: 'Validée', color: 'bg-green-100 text-green-800' },
    REPORTEE: { label: 'Reportée', color: 'bg-orange-100 text-orange-800' },
    MODIFIEE: { label: 'Modifiée', color: 'bg-blue-100 text-blue-800' },
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout} title="Administration PFEHub" notificationCount={8}>
      <div className="space-y-6">
        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total étudiants</p>
                  <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : computedStats.totalStudents}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total encadrants</p>
                  <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : computedStats.totalProfessors}</p>
                </div>
                <GraduationCap className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">PFEs actifs</p>
                  <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : computedStats.activePFEs}</p>
                </div>
                <FileText className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Soutenances</p>
                  <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : computedStats.upcomingDefenses}</p>
                </div>
                <Calendar className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="academic-year">Année Acad.</TabsTrigger>
            <TabsTrigger value="assignments">Assignations</TabsTrigger>
            <TabsTrigger value="defenses">Soutenances</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Soumissions récentes en attente</CardTitle>
                  <CardDescription>{pendingAssignments.length} projets à assigner</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingAssignments.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-sm">{project.student.name}</p>
                          <p className="text-xs text-gray-600">{project.title.substring(0, 50)}...</p>
                        </div>
                        <Button size="sm" onClick={() => {
                          setSelectedProject(project);
                          setShowAssignmentDialog(true);
                        }}>
                          Assigner
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Propositions de soutenances</CardTitle>
                  <CardDescription>{defenseProposals.length} propositions en attente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {defenseProposals.slice(0, 3).map((defense) => (
                      <div key={defense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-sm">{defense.project.student.name}</p>
                          <p className="text-xs text-gray-600">{defense.proposedDate} à {defense.proposedTime}</p>
                        </div>
                        <Button size="sm" onClick={() => {
                          setSelectedDefense(defense);
                          setShowDefenseValidationDialog(true);
                        }}>
                          Valider
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptStudentCount = students.filter(s => s.departement?.id === dept.id).length;
                    return (
                      <div key={dept.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{dept.name}</span>
                          <span className="text-sm text-gray-600">{deptStudentCount} étudiants</span>
                        </div>
                        <Progress value={computedStats.totalStudents > 0 ? (deptStudentCount / computedStats.totalStudents) * 100 : 0} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Structure Académique */}
          <TabsContent value="structure" className="space-y-6">
            {/* Départements */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Départements</CardTitle>
                    <CardDescription>Gérez les départements de votre établissement ({departments.length} départements)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={refreshDepartments} disabled={loading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                    <Dialog open={showCreateDeptDialog} onOpenChange={setShowCreateDeptDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Nouveau département
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Créer un département</DialogTitle>
                          <DialogDescription>
                            Ajoutez un nouveau département à votre établissement
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="dept-name">Nom du département *</Label>
                            <Input 
                              id="dept-name" 
                              placeholder="Ex: Génie Informatique" 
                              value={newDeptName}
                              onChange={(e) => setNewDeptName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dept-code">Code *</Label>
                            <Input 
                              id="dept-code" 
                              placeholder="Ex: INFO" 
                              maxLength={10}
                              value={newDeptCode}
                              onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dept-description">Description</Label>
                            <Textarea 
                              id="dept-description"
                              placeholder="Description du département..."
                              className="min-h-24"
                              value={newDeptDescription}
                              onChange={(e) => setNewDeptDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1" 
                            onClick={handleCreateDepartment}
                            disabled={loading || !newDeptName || !newDeptCode}
                          >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Créer
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateDeptDialog(false)}>
                            Annuler
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && departments.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : departments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun département trouvé. Créez-en un nouveau.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium">{dept.name}</p>
                              <p className="text-sm text-gray-600">
                                {specializations.filter(s => s.departement?.id === dept.id).length} spécialisations
                                {dept.description && ` • ${dept.description}`}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{dept.code}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDepartment(dept.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Spécialisations */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Spécialisations</CardTitle>
                    <CardDescription>Gérez les spécialisations par département ({specializations.length} spécialisations)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={refreshSpecializations} disabled={loading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                    <Dialog open={showCreateSpecDialog} onOpenChange={setShowCreateSpecDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Nouvelle spécialisation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Créer une spécialisation</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="spec-dept">Département *</Label>
                            <Select onValueChange={(value: string) => setNewSpecDeptId(Number(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un département" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.id.toString()}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="spec-name">Nom de la spécialisation *</Label>
                            <Input 
                              id="spec-name" 
                              placeholder="Ex: Intelligence Artificielle" 
                              value={newSpecName}
                              onChange={(e) => setNewSpecName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="spec-code">Code *</Label>
                            <Input 
                              id="spec-code" 
                              placeholder="Ex: IA" 
                              maxLength={10}
                              value={newSpecCode}
                              onChange={(e) => setNewSpecCode(e.target.value.toUpperCase())}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="spec-description">Description</Label>
                            <Textarea 
                              id="spec-description"
                              placeholder="Description de la spécialisation..."
                              className="min-h-24"
                              value={newSpecDescription}
                              onChange={(e) => setNewSpecDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1" 
                            onClick={handleCreateSpecialization}
                            disabled={loading || !newSpecName || !newSpecCode || !newSpecDeptId}
                          >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Créer
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateSpecDialog(false)}>
                            Annuler
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && specializations.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : specializations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune spécialisation trouvée. Créez-en une nouvelle.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {specializations.map((spec) => (
                      <div key={spec.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{spec.name}</p>
                          <p className="text-sm text-gray-600">
                            {spec.departement?.name || 'Sans département'}
                            {spec.description && ` • ${spec.description}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{spec.code}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteSpecialization(spec.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            {/* Étudiants */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Étudiants</CardTitle>
                    <CardDescription>{students.length} étudiants enregistrés</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-9 w-64" placeholder="Rechercher un étudiant..." />
                    </div>
                    <Button variant="outline" size="sm" onClick={refreshStudents} disabled={loading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Nouvel étudiant
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Créer un compte étudiant</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="student-firstname">Prénom *</Label>
                              <Input id="student-firstname" placeholder="Prénom" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="student-lastname">Nom *</Label>
                              <Input id="student-lastname" placeholder="Nom" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-email">Email *</Label>
                            <Input id="student-email" type="email" placeholder="email@student.ma" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-password">Mot de passe temporaire *</Label>
                            <Input id="student-password" type="password" placeholder="Mot de passe" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="student-dept">Département *</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="student-spec">Spécialisation *</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                                <SelectContent>
                                  {specializations.map((spec) => (
                                    <SelectItem key={spec.id} value={spec.id.toString()}>
                                      {spec.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Créer le compte
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
                            Annuler
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && students.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun étudiant trouvé.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-600">
                              {student.email} • {student.specialite?.name || 'Sans spécialisation'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={student.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {student.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (confirm('Supprimer cet étudiant ?')) {
                                deleteUser(student.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Encadrants */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Encadrants / Professeurs</CardTitle>
                    <CardDescription>{professors.length} encadrants enregistrés</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={refreshProfessors} disabled={loading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nouvel encadrant
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && professors.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : professors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun encadrant trouvé.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {professors.map((prof) => (
                      <div key={prof.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{prof.firstName} {prof.lastName}</p>
                            <p className="text-sm text-gray-600">
                              {prof.email} • {prof.departement?.name || 'Sans département'} 
                              {prof.expertise && ` • ${Array.isArray(prof.expertise) ? prof.expertise.join(', ') : prof.expertise}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {prof.currentProjectsCount || 0}/{prof.maxProjectCapacity || 5} projets
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (confirm('Supprimer cet encadrant ?')) {
                                deleteUser(prof.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Année Académique */}
          <TabsContent value="academic-year" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Configuration de l'année académique</CardTitle>
                    <CardDescription>Définissez les périodes de soumission et de soutenances</CardDescription>
                  </div>
                  <Dialog open={showConfigYearDialog} onOpenChange={setShowConfigYearDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Settings className="w-4 h-4 mr-2" />
                        Configurer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Configurer l'année académique</DialogTitle>
                        <DialogDescription>
                          Définissez l'année en cours et les périodes importantes
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Année académique *</Label>
                          <Input 
                            id="year"
                            placeholder="Ex: 2024-2025"
                            defaultValue={academicYear.year}
                          />
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-4">Période de soumission des sujets</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="submission-start">Date de début *</Label>
                              <Input id="submission-start" type="date" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="submission-end">Date de fin *</Label>
                              <Input id="submission-end" type="date" />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-4">Période des soutenances</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="defense-start">Date de début *</Label>
                              <Input id="defense-start" type="date" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="defense-end">Date de fin *</Label>
                              <Input id="defense-end" type="date" />
                            </div>
                          </div>
                        </div>

                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Important</AlertTitle>
                          <AlertDescription>
                            Une seule année académique peut être active à la fois. L'activation de cette année désactivera automatiquement les autres.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <div className="flex gap-3">
                        <Button className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Enregistrer
                        </Button>
                        <Button variant="outline" onClick={() => setShowConfigYearDialog(false)}>
                          Annuler
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {academicYear.active ? (
                  <>
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="font-medium text-green-900">Année active: {academicYear.year}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-green-700 mb-2">Période de soumission</p>
                          <p className="font-medium text-green-900">
                            {academicYear.submissionStartDate} → {academicYear.submissionEndDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-2">Période des soutenances</p>
                          <p className="font-medium text-green-900">
                            {academicYear.defenseStartDate} → {academicYear.defenseEndDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Aucune année académique active</AlertTitle>
                    <AlertDescription>
                      Veuillez configurer une année académique pour permettre aux étudiants de soumettre leurs projets.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignations */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projets en attente d'assignation</CardTitle>
                <CardDescription>
                  {pendingAssignments.length} projets en attente • Recommandations intelligentes d'encadrants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAssignments.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Étudiant: {project.student.name} • {project.student.specialization}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Soumis le {project.submittedAt}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium">Encadrants recommandés</h4>
                        </div>
                        <div className="space-y-2">
                          {project.recommendedProfessors.map((prof) => (
                            <div key={prof.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex-1">
                                <p className="font-medium">{prof.name}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                  <span>Match: {prof.matchPercentage}%</span>
                                  <span>•</span>
                                  <span>Charge: {prof.currentWorkload}/{prof.maxWorkload}</span>
                                  <span>•</span>
                                  <span>Expertise: {Array.isArray(prof.expertise) ? prof.expertise.join(', ') : (prof.expertise || 'N/A')}</span>
                                </div>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  // Assigner directement
                                  console.log('Assigner', project.id, 'à', prof.id);
                                }}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Assigner
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir les détails
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowAssignmentDialog(true);
                          }}
                        >
                          Assigner manuellement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Soutenances */}
          <TabsContent value="defenses" className="space-y-6">
            {/* Propositions en attente */}
            <Card>
              <CardHeader>
                <CardTitle>Propositions de soutenances</CardTitle>
                <CardDescription>{defenseProposals.length} propositions en attente de validation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defenseProposals.map((defense) => (
                    <div key={defense.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{defense.project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Étudiant: {defense.project.student.name} • Encadrant: {defense.professor.name}
                          </p>
                        </div>
                        <Badge className={defenseStatuses[defense.status as keyof typeof defenseStatuses].color}>
                          {defenseStatuses[defense.status as keyof typeof defenseStatuses].label}
                        </Badge>
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
                        <p className="text-sm font-medium mb-2">Composition du jury proposée:</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">Président</Badge>
                            <span>{defense.professor.name}</span>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedDefense(defense)}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Valider
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Valider la proposition de soutenance</DialogTitle>
                              <DialogDescription>
                                Pour {defense.project.student.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Alert className="border-green-200 bg-green-50">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Validation</AlertTitle>
                                <AlertDescription className="text-green-700">
                                  En validant, la soutenance sera confirmée. L'étudiant et l'encadrant recevront une notification.
                                </AlertDescription>
                              </Alert>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Date finale</Label>
                                  <Input type="date" defaultValue="2025-06-15" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Heure</Label>
                                  <Input type="time" defaultValue="14:00" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Salle</Label>
                                <Input defaultValue={defense.proposedRoom} />
                              </div>
                              <div className="space-y-2">
                                <Label>Composition du jury (modifiable)</Label>
                                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                                  {defense.juryMembers.map((member, index) => (
                                    <Input key={index} defaultValue={member.name} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button className="flex-1">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirmer la validation
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier la planification</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Modifiez les détails (ex: conflit de salle). L'encadrant sera notifié des changements.
                                </AlertDescription>
                              </Alert>
                              <div className="grid grid-cols-2 gap-4">
                                <Input type="date" />
                                <Input type="time" />
                              </div>
                              <Input placeholder="Nouvelle salle" />
                              <Textarea placeholder="Raison de la modification..." />
                            </div>
                            <Button className="w-full">
                              <Edit className="w-4 h-4 mr-2" />
                              Enregistrer les modifications
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <X className="w-4 h-4 mr-2" />
                              Reporter
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reporter la soutenance</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  La soutenance sera reportée. L'encadrant devra proposer une nouvelle date.
                                </AlertDescription>
                              </Alert>
                              <Textarea placeholder="Raison du report (conflit, indisponibilité...)..." />
                            </div>
                            <Button variant="destructive" className="w-full">
                              <X className="w-4 h-4 mr-2" />
                              Confirmer le report
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Calendrier */}
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des soutenances</CardTitle>
                <CardDescription>Vue d'ensemble des soutenances planifiées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calendarDefenses.map((defense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{defense.student}</p>
                          <p className="text-sm text-gray-600">
                            {defense.date} à {defense.time} • {defense.room} • {defense.professor}
                          </p>
                        </div>
                      </div>
                      <Badge className={defenseStatuses[defense.status as keyof typeof defenseStatuses].color}>
                        {defenseStatuses[defense.status as keyof typeof defenseStatuses].label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rapports d'évaluation */}
            <Card>
              <CardHeader>
                <CardTitle>Rapports d'évaluation des soutenances</CardTitle>
                <CardDescription>Consultez les évaluations complètes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evaluatedDefenses.map((defense) => (
                    <div key={defense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium">{defense.project.student.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {defense.project.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Évalué le {defense.evaluatedAt} par {defense.professor.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{defense.finalGrade}/20</p>
                          <p className="text-xs text-gray-500">Note finale</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir le rapport
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Rapport d'évaluation de la soutenance</DialogTitle>
                              <DialogDescription>
                                {defense.project.student.name} • {defense.defenseDate}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                                <p className="text-gray-600 mb-2">Note finale de soutenance</p>
                                <p className="text-5xl font-bold text-blue-600">{defense.finalGrade}/20</p>
                              </div>

                              <Separator />

                              <div>
                                <h4 className="font-medium mb-4">Critères d'évaluation détaillés</h4>
                                <div className="grid gap-4">
                                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span>Qualité de la présentation orale</span>
                                    <Badge className="bg-blue-100 text-blue-800">{defense.presentationQuality}/20</Badge>
                                  </div>
                                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span>Maîtrise du sujet</span>
                                    <Badge className="bg-blue-100 text-blue-800">{defense.subjectMastery}/20</Badge>
                                  </div>
                                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span>Réponses aux questions du jury</span>
                                    <Badge className="bg-blue-100 text-blue-800">{defense.questionsAnswers}/20</Badge>
                                  </div>
                                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span>Respect du temps imparti</span>
                                    <Badge className="bg-blue-100 text-blue-800">{defense.timeRespect}/20</Badge>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <h4 className="font-medium mb-3">Commentaires détaillés de l'encadrant</h4>
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                  <p className="text-gray-700 leading-relaxed">{defense.evaluationComments}</p>
                                </div>
                              </div>

                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Encadrant évaluateur:</strong> {defense.professor.name}
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                  Note saisie le {defense.evaluatedAt} (résultat de la délibération du jury)
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

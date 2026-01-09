import { useState } from 'react';
import { User, UserRole } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { GraduationCap, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { apiClient } from '../services/apiClient';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Mock users pour démonstration (fallback si Backend non disponible)
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Leila Amrani',
    email: 'leila.amrani@etudiant.ma',
    role: 'student',
    department: 'Génie Mécanique',
    specialization: 'Conception Aéronautique',
  },
  {
    id: '2',
    name: 'Prof. Mohammed Idrissi',
    email: 'm.idrissi@ensa.ma',
    role: 'professor',
    department: 'Génie Mécanique',
    specialization: 'Conception Aéronautique',
  },
  {
    id: '3',
    name: 'Dr. Fatima Bennani',
    email: 'f.bennani@ensa.ma',
    role: 'admin',
    department: 'Administration',
  },
];

// Comptes de démonstration pour le mode démo rapide
const DEMO_ACCOUNTS = [
  { role: 'admin' as UserRole, email: 'f.bennani@ensa.ma', password: 'admin123', label: '👨‍💼 Admin' },
  { role: 'professor' as UserRole, email: 'm.idrissi@ensa.ma', password: 'prof123', label: '👨‍🏫 Encadrant' },
  { role: 'student' as UserRole, email: 'leila.amrani@etudiant.ma', password: 'etud123', label: '👨‍🎓 Étudiant' },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoMode, setShowDemoMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Login via API Backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post<{ user: any; token?: string }>('/auth/login', {
        email,
        password,
      });

      const userData = response.user;
      const user: User = {
        id: userData.id.toString(),
        name: `${userData.prenom} ${userData.nom}`,
        email: userData.email,
        role: mapRole(userData.role),
        department: userData.departementNom,
        specialization: userData.specialiteNom,
      };

      // Stocker le token si présent
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      onLogin(user);
    } catch (err: any) {
      console.error('Login error:', err);
      // Si le backend n'est pas disponible, proposer le mode démo
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Network') || err.message?.includes('fetch')) {
        setError('Backend non disponible. Utilisez le mode démonstration ci-dessous.');
        setShowDemoMode(true);
      } else {
        setError(err.message || 'Identifiants incorrects');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mapper les rôles backend vers frontend
  const mapRole = (backendRole: string): UserRole => {
    const roleMap: Record<string, UserRole> = {
      'ADMIN': 'admin',
      'ENCADRANT': 'professor',
      'ETUDIANT': 'student',
    };
    return roleMap[backendRole] || 'student';
  };

  // Login rapide avec compte démo
  const handleDemoLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  // Login en mode démonstration (sans backend)
  const handleQuickDemoLogin = () => {
    const user = MOCK_USERS.find((u) => u.role === selectedRole);
    if (user) {
      onLogin(user);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    student: '👨‍🎓 Étudiant',
    professor: '👨‍🏫 Encadrant',
    admin: '👨‍💼 Admin',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl">PFEHub</CardTitle>
            <CardDescription className="mt-2">
              Plateforme Intégrée de Gestion des Projets de Fin d'Études
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulaire de connexion réel */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@ensa.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Se connecter
            </Button>
          </form>

          {/* Boutons de connexion rapide démo */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Comptes de démonstration
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(account)}
                  className="text-xs"
                >
                  {account.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mode démonstration sans backend */}
          {showDemoMode && (
            <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 font-medium">
                Mode démonstration (sans backend)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-lg border-2 transition-all text-center text-sm ${
                      selectedRole === role
                        ? 'border-amber-600 bg-amber-100'
                        : 'border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <div>{roleLabels[role]}</div>
                  </button>
                ))}
              </div>
              <Button 
                onClick={handleQuickDemoLogin} 
                className="w-full bg-amber-600 hover:bg-amber-700" 
                size="sm"
              >
                Entrer en mode démo
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            ENSA - Gestion des PFE
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
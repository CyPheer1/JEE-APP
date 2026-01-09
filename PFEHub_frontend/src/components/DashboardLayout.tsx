import { ReactNode } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { LogOut, GraduationCap, Bell } from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  children: ReactNode;
  title: string;
  notificationCount?: number;
}

export function DashboardLayout({
  user,
  onLogout,
  children,
  title,
  notificationCount = 0,
}: DashboardLayoutProps) {
  const roleLabels = {
    student: 'Étudiant',
    professor: 'Encadrant',
    jury: 'Membre du Jury',
    admin: 'Administrateur',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">PFEHub</h1>
                <p className="text-xs text-gray-500">{title}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{roleLabels[user.role]}</p>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

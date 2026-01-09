import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { AdminDashboard } from './components/AdminDashboard-NEW';

export type UserRole = 'student' | 'professor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  specialization?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === 'student' && (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'professor' && (
        <ProfessorDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
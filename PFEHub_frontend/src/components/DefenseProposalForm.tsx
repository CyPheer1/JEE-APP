/**
 * Formulaire de proposition de soutenance (Encadrant)
 * 
 * Ce composant est utilisé par l'encadrant pour CRÉER une soutenance.
 * C'est à ce moment que l'entité Soutenance est créée dans la base de données.
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { Project } from '../services/types';

interface DefenseProposalFormProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DefenseProposalForm({
  project,
  open,
  onOpenChange,
  onSuccess,
}: DefenseProposalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    room: '',
    juryMember1Name: '',
    juryMember1Email: '',
    juryMember2Name: '',
    juryMember2Email: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { defenseService } = await import('../services');
      
      // Préparer les données de proposition
      const proposal = {
        projectId: project.id,
        proposedDate: formData.date,
        proposedTime: formData.time,
        proposedRoom: formData.room,
        juryMembers: [
          {
            name: formData.juryMember1Name,
            email: formData.juryMember1Email,
            role: 'EXAMINATEUR' as const,
          },
          {
            name: formData.juryMember2Name,
            email: formData.juryMember2Email,
            role: 'EXAMINATEUR' as const,
          },
        ],
        notes: formData.notes || undefined,
      };

      // ÉTAPE 6 : Créer l'entité Soutenance
      await defenseService.proposeDefense(proposal);
      
      // Réinitialiser le formulaire
      setFormData({
        date: '',
        time: '',
        room: '',
        juryMember1Name: '',
        juryMember1Email: '',
        juryMember2Name: '',
        juryMember2Email: '',
        notes: '',
      });
      
      // Fermer le dialog et notifier le parent
      onOpenChange(false);
      onSuccess?.();
      
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la proposition de soutenance');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.date &&
      formData.time &&
      formData.room &&
      formData.juryMember1Name &&
      formData.juryMember1Email &&
      formData.juryMember2Name &&
      formData.juryMember2Email
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposer une soutenance</DialogTitle>
          <DialogDescription>
            Planifiez la soutenance pour le projet de {project.student.firstName} {project.student.lastName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Informations du projet */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-blue-900">Informations du projet</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Titre :</span>
                <span className="font-medium text-blue-900 text-right max-w-md">
                  {project.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Étudiant :</span>
                <span className="font-medium text-blue-900">
                  {project.student.firstName} {project.student.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Email étudiant :</span>
                <span className="text-blue-900">{project.student.email}</span>
              </div>
              {project.professor && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Encadrant :</span>
                  <span className="font-medium text-blue-900">
                    {project.professor.firstName} {project.professor.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Votre proposition sera envoyée à l'administration pour validation. L'admin pourra 
              accepter, modifier ou reporter cette planification.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Planification */}
          <div className="space-y-4">
            <h4 className="font-medium">Planification de la soutenance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defense-date">Date proposée *</Label>
                <Input
                  type="date"
                  id="defense-date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defense-time">Heure *</Label>
                <Input
                  type="time"
                  id="defense-time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defense-room">Salle proposée *</Label>
              <Input
                id="defense-room"
                placeholder="Ex: Salle A203, Amphithéâtre B..."
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Composition du jury */}
          <div className="space-y-4">
            <h4 className="font-medium">Composition du jury</h4>
            <div className="space-y-3">
              {project.professor && (
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    Président
                  </Badge>
                  <span className="text-sm font-medium">
                    {project.professor.firstName} {project.professor.lastName}
                  </span>
                  <span className="text-sm text-gray-500">(Vous - Encadrant)</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>1er Examinateur *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nom complet (ex: Dr. Karim Alaoui)"
                    value={formData.juryMember1Name}
                    onChange={(e) => setFormData({ ...formData, juryMember1Name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.juryMember1Email}
                    onChange={(e) => setFormData({ ...formData, juryMember1Email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>2ème Examinateur *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nom complet (ex: Prof. Samira Bennis)"
                    value={formData.juryMember2Name}
                    onChange={(e) => setFormData({ ...formData, juryMember2Name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.juryMember2Email}
                    onChange={(e) => setFormData({ ...formData, juryMember2Email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes optionnelles */}
          <div className="space-y-2">
            <Label htmlFor="defense-notes">Notes complémentaires (optionnel)</Label>
            <Input
              id="defense-notes"
              placeholder="Remarques ou informations supplémentaires..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Envoyer la proposition
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

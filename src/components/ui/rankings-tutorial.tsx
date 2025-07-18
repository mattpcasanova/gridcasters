'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ChevronLeft, ChevronRight, HelpCircle, Save, BarChart3, Target } from 'lucide-react';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { toast } from 'sonner';

interface RankingsTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "OVR & FLX Rankings",
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300">
          When you make changes to <strong>OVR</strong> or <strong>FLX</strong> rankings, those changes are automatically applied to the individual position rankings (QB, RB, WR, TE).
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Saving an OVR or FLX ranking will create or update rankings for all positions included in that ranking.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Example:</strong> Saving your OVR ranking will save QB, RB, WR, and TE rankings automatically.
          </p>
        </div>
      </div>
    ),
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />
  },
  {
    title: "Saving Rankings",
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300">
          Every time you save a ranking, it either gets created (if it's your first time) or updated (if one already exists for that position and week).
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Your rankings are automatically saved when you click the save button, and you can always come back to edit them later.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Tip:</strong> You can save multiple versions of rankings for different weeks and scoring formats.
          </p>
        </div>
      </div>
    ),
    icon: <Save className="w-6 h-6 text-green-600" />
  },
  {
    title: "Scoring & Percentiles",
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300">
          Your rankings are compared against actual player performance to calculate accuracy scores and percentiles.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Higher accuracy scores mean your rankings were more accurate compared to other users and projection systems.
        </p>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            <strong>Need more details?</strong> Click the help icon in the top right corner for comprehensive information about scoring and percentiles.
          </p>
        </div>
      </div>
    ),
    icon: <Target className="w-6 h-6 text-purple-600" />
  },
  {
    title: "Ranking Flexibility",
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300">
          You don't have to make rankings for ALL positions if you don't want to. For example, the OVR ranking might include more QBs than you care to rank, unless you're playing in superflex or 2-QB leagues.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Focus on the positions that matter most to your league format and scoring system.
        </p>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            <strong>Remember:</strong> Quality over quantity. It's better to rank fewer players accurately than to rank many players poorly.
          </p>
        </div>
      </div>
    ),
    icon: <HelpCircle className="w-6 h-6 text-orange-600" />
  }
];

export function RankingsTutorial({ isOpen, onClose }: RankingsTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = useSupabase();

  const handleClose = async () => {
    if (dontShowAgain) {
      setIsSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ tutorial_dismissed: true })
            .eq('id', user.id);
          
          if (error) {
            console.error('Error updating tutorial dismissed:', error);
            toast.error('Failed to save preference');
          }
        }
      } catch (error) {
        console.error('Error saving tutorial preference:', error);
        // Don't show error toast if user is not authenticated
        if (error && typeof error === 'object' && 'message' in error && error.message !== 'User not authenticated') {
          toast.error('Failed to save preference');
        }
      } finally {
        setIsSaving(false);
      }
    }
    onClose();
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="relative pb-4">
          <div className="flex items-center gap-3">
            {currentTutorialStep.icon}
            <CardTitle className="text-xl">{currentTutorialStep.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 p-0"
            disabled={isSaving}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="min-h-[200px]">
            {currentTutorialStep.content}
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation and controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
                disabled={currentStep === tutorialSteps.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dont-show-again"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              />
              <label
                htmlFor="dont-show-again"
                className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Don't show this again
              </label>
            </div>
          </div>
          
          {/* Step indicator */}
          <div className="text-center text-sm text-slate-500">
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
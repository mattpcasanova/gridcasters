'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ChevronLeft, ChevronRight, HelpCircle, Save, BarChart3, Target, Users, Calendar } from 'lucide-react';
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
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          When you make changes to <strong className="text-blue-600 dark:text-blue-400">OVR</strong> or <strong className="text-blue-600 dark:text-blue-400">FLX</strong> rankings, those changes are automatically applied to the individual position rankings (QB, RB, WR, TE).
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Saving an OVR or FLX ranking will create or update rankings for all positions included in that ranking.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            <strong>Example:</strong> Saving your OVR ranking will save QB, RB, WR, TE, and FLX rankings automatically.
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
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Every time you save a ranking, it either gets created (if it's your first time) or updated (if one already exists for that position and week).
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Your rankings are automatically saved when you click the save button, and you can always come back to edit them later.
        </p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
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
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Your rankings are compared against actual player performance to calculate accuracy scores and percentiles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Higher accuracy scores mean your rankings were more accurate compared to other users and projection systems.
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
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
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          You don't have to make rankings for ALL positions if you don't want to. For example, the OVR ranking might include more QBs than you care to rank, unless you're playing in superflex or 2-QB leagues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Focus on the positions that matter most to your league format and scoring system.
        </p>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
            <strong>Remember:</strong> Quality over quantity. It's better to rank fewer players accurately than to rank many players poorly.
          </p>
        </div>
      </div>
    ),
    icon: <HelpCircle className="w-6 h-6 text-orange-600" />
  },
  {
    title: "Aggregate Rankings",
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Create consensus rankings by combining your rankings with those of trusted users you follow. This helps you make better decisions by leveraging the wisdom of the crowd.
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          Aggregate rankings average the rankings from multiple sources, giving you a more balanced perspective on player values.
        </p>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">
            <strong>Pro Tip:</strong> Follow users with high accuracy scores to create more reliable aggregate rankings.
          </p>
        </div>
      </div>
    ),
    icon: <Users className="w-6 h-6 text-indigo-600" />
  },
  {
    title: "Week Selection & Defaults",
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          The default week shown is the current week you're in, and the displayed ranking is from your previously saved ranking for the prior week.
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
          This gives you a starting point to build upon, making it easier to adjust your rankings based on recent performance and news.
        </p>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
            <strong>Note:</strong> You can always change the week or start fresh by selecting a different reference point.
          </p>
        </div>
      </div>
    ),
    icon: <Calendar className="w-6 h-6 text-emerald-600" />
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardHeader className="relative pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm">
              {currentTutorialStep.icon}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {currentTutorialStep.title}
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          <div className="min-h-[280px] flex items-center">
            <div className="w-full">
              {currentTutorialStep.content}
            </div>
          </div>
          
          {/* Enhanced Progress indicator */}
          <div className="flex justify-center space-x-3">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 scale-125 shadow-lg' 
                    : index < currentStep
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation and controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="lg"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-2 border-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={nextStep}
                disabled={currentStep === tutorialSteps.length - 1}
                className="flex items-center gap-2 px-6 py-2 border-2 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg">
              <Checkbox
                id="dont-show-again"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor="dont-show-again"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                Don't show this again
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
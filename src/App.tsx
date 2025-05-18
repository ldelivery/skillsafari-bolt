import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, CheckCircle2, Clock, Footprints, Globe2, Heart, Palette, Play, Search, Share2, Sparkles, Timer, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { zero, setLanguage, startChallenge as startChallengeAction, toggleStep as toggleStepAction, toggleMaterial as toggleMaterialAction, endChallenge as endChallengeAction, toggleSavedChallenge } from "@/lib/zero";
import { useQuery, useZero } from "@rocicorp/zero/react";

const translations = {
  en: {
    title: "Family Challenges",
    subtitle: "Discover fun activities to do with your children",
    searchPlaceholder: "Search challenges...",
    newChallenge: "New Challenge",
    allActivities: "All Activities",
    creative: "Creative",
    educational: "Educational",
    physical: "Physical",
    viewDetails: "View Details",
    saveChallenge: "Save Challenge",
    share: "Share",
    startChallenge: "Start Challenge",
    challengeInProgress: "Challenge in Progress",
    timeElapsed: "Time Elapsed",
    materialsNeeded: "Materials Needed",
    progress: "Progress",
    benefits: "Benefits",
    steps: "Steps",
    ages: "Ages",
    noResults: "No challenges found",
  },
  de: {
    title: "Familienaktivitäten",
    subtitle: "Entdecke lustige Aktivitäten für dich und deine Kinder",
    searchPlaceholder: "Aktivitäten suchen...",
    newChallenge: "Neue Aktivität",
    allActivities: "Alle Aktivitäten",
    creative: "Kreativ",
    educational: "Lehrreich",
    physical: "Bewegung",
    viewDetails: "Details anzeigen",
    saveChallenge: "Aktivität speichern",
    share: "Teilen",
    startChallenge: "Aktivität starten",
    challengeInProgress: "Aktivität läuft",
    timeElapsed: "Verstrichene Zeit",
    materialsNeeded: "Benötigte Materialien",
    progress: "Fortschritt",
    benefits: "Vorteile",
    steps: "Schritte",
    ages: "Alter",
    noResults: "Keine Aktivitäten gefunden",
  }
};

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const [language, setCurrentLanguage] = useState<'en' | 'de'>('en');
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [savedChallenges, setSavedChallenges] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const z = useZero();
  
  // Queries
  const [settings] = [];
  const [activeChallengeData] = [];
  const [savedChallengesData] =  [];
  const [challengesData] = useQuery(z.query.challenges.where("language_code", language));

  useEffect(() => {
    if (settings?.[0]?.language) {
      setCurrentLanguage(settings[0].language as 'en' | 'de');
    }
  }, [settings]);

  useEffect(() => {
    if (activeChallengeData?.[0]) {
      const challenge = JSON.parse(activeChallengeData[0].challenge);
      setActiveChallenge({
        ...challenge,
        startTime: activeChallengeData[0].startTime,
        completedSteps: activeChallengeData[0].completedSteps,
        completedMaterials: activeChallengeData[0].completedMaterials,
      });
    } else {
      setActiveChallenge(null);
    }
  }, [activeChallengeData]);

  useEffect(() => {
    if (savedChallengesData) {
      setSavedChallenges(savedChallengesData.map(sc => sc.id));
    }
  }, [savedChallengesData]);

  const handleLanguageChange = async (value: 'en' | 'de') => {
    setCurrentLanguage(value);
    // await setLanguage(value);
  };

  const handleStartChallenge = async (challenge: any) => {
    await startChallengeAction(challenge);
    setSelectedChallenge(null);
  };

  const handleEndChallenge = async () => {
    if (activeChallenge) {
      await endChallengeAction(activeChallenge.id);
    }
  };

  const handleToggleStep = async (index: number) => {
    if (activeChallenge) {
      await toggleStepAction(activeChallenge.id, index, activeChallenge.completedSteps);
    }
  };

  const handleToggleMaterial = async (index: number) => {
    if (activeChallenge) {
      await toggleMaterialAction(activeChallenge.id, index, activeChallenge.completedMaterials);
    }
  };

  const handleToggleSavedChallenge = async (challengeId: string) => {
    await toggleSavedChallenge(challengeId, savedChallenges);
  };

  useEffect(() => {
    let interval: number;
    if (activeChallenge) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - activeChallenge.startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeChallenge]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIconComponent = (category: string) => {
    switch (category) {
      case 'creative':
        return Palette;
      case 'educational':
        return Brain;
      case 'physical':
        return Footprints;
      default:
        return Sparkles;
    }
  };

  const filteredChallenges = challengesData?.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || challenge.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{translations[language].title}</h1>
            <p className="text-muted-foreground">{translations[language].subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={translations[language].searchPlaceholder} 
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px]">
                <Globe2 className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              {translations[language].newChallenge}
            </Button>
          </div>
        </div>

        {activeChallenge ? (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {React.createElement(getIconComponent(activeChallenge.category), { className: "h-6 w-6 text-primary" })}
                  </div>
                  <div>
                    <CardTitle>{activeChallenge.title}</CardTitle>
                    <CardDescription>{translations[language].challengeInProgress}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleEndChallenge}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <span className="font-medium">{translations[language].timeElapsed}:</span>
                </div>
                <span className="text-xl font-bold">{formatTime(elapsed)}</span>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{translations[language].materialsNeeded}:</h3>
                {activeChallenge.materials.map((material: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      activeChallenge.completedMaterials[index]
                        ? 'bg-primary/10'
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => handleToggleMaterial(index)}
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${
                        activeChallenge.completedMaterials[index]
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <span className={activeChallenge.completedMaterials[index] ? 'line-through' : ''}>
                      {material.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{translations[language].progress}:</h3>
                {activeChallenge.steps.map((step: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      activeChallenge.completedSteps[index]
                        ? 'bg-primary/10'
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => handleToggleStep(index)}
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${
                        activeChallenge.completedSteps[index]
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <span className={activeChallenge.completedSteps[index] ? 'line-through' : ''}>
                      {step.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs 
            defaultValue="all" 
            className="space-y-6"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <TabsTrigger value="all">{translations[language].allActivities}</TabsTrigger>
              <TabsTrigger value="creative">{translations[language].creative}</TabsTrigger>
              <TabsTrigger value="educational">{translations[language].educational}</TabsTrigger>
              <TabsTrigger value="physical">{translations[language].physical}</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-4">
              {filteredChallenges?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {translations[language].noResults}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChallenges?.map((challenge) => {
                    const IconComponent = getIconComponent(challenge.categories[0]);
                    return (
                      <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex gap-2">
                              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                {challenge.time_estimate_minutes} mins
                              </span>
                              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                {translations[language].ages} {challenge.age_groups.join(", ")}
                              </span>
                            </div>
                          </div>
                          <CardTitle className="mt-4">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedChallenge(challenge)}
                          >
                            {translations[language].viewDetails}
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => handleToggleSavedChallenge(challenge.id)}
                          >
                            <Heart className={`mr-2 h-4 w-4 ${savedChallenges.includes(challenge.id) ? 'fill-current' : ''}`} />
                            {translations[language].saveChallenge}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-2xl">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {React.createElement(getIconComponent(selectedChallenge.categories[0]), { className: "h-6 w-6 text-primary" })}
                  </div>
                  <DialogTitle className="text-2xl">{selectedChallenge.title}</DialogTitle>
                </div>
                <DialogDescription className="pt-2">{selectedChallenge.description}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-3 py-4">
                <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span>{selectedChallenge.time_estimate_minutes} mins</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
                  <Users className="h-4 w-4" />
                  <span>{translations[language].ages} {selectedChallenge.age_groups.join(", ")}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{translations[language].materialsNeeded}:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedChallenge.materials.map((material: any, index: number) => (
                      <li key={index}>{material.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{translations[language].steps}:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedChallenge.steps.map((step: any, index: number) => (
                      <li key={index}>{step.description}</li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={() => handleStartChallenge(selectedChallenge)}>
                    <Play className="mr-2 h-4 w-4" /> {translations[language].startChallenge}
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => handleToggleSavedChallenge(selectedChallenge.id)}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${savedChallenges.includes(selectedChallenge.id) ? 'fill-current' : ''}`} />
                    {translations[language].saveChallenge}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" /> {translations[language].share}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
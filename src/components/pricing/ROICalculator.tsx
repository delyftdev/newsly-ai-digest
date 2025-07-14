
import { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROICalculator = () => {
  const [teamSize, setTeamSize] = useState(5);
  const [currentToolCost, setCurrentToolCost] = useState(200);

  const calculateSavings = () => {
    const hoursPerWeek = 4; // Hours saved per user per week
    const hourlyRate = 50; // Average hourly rate
    const weeksPerYear = 52;
    
    const timeSavings = teamSize * hoursPerWeek * hourlyRate * weeksPerYear;
    const delyftCost = (40 + (teamSize * 8)) * 12; // Growth plan annual
    const totalSavings = timeSavings - delyftCost - (currentToolCost * 12);
    
    return {
      timeSavings,
      delyftCost,
      totalSavings,
      roi: Math.round((totalSavings / delyftCost) * 100)
    };
  };

  const savings = calculateSavings();

  return (
    <section className="py-24 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Calculator className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Calculate your ROI
          </h2>
          <p className="text-xl text-muted-foreground">
            See how much time and money Delyft can save your team
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Your Team Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="team-size">Team Size</Label>
                <Input
                  id="team-size"
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 0)}
                  min={1}
                  max={100}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Number of people managing customer communication
                </p>
              </div>

              <div>
                <Label htmlFor="current-cost">Current Tool Cost ($/month)</Label>
                <Input
                  id="current-cost"
                  type="number"
                  value={currentToolCost}
                  onChange={(e) => setCurrentToolCost(parseInt(e.target.value) || 0)}
                  min={0}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  What you currently spend on communication tools
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${savings.timeSavings.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">
                    Annual time savings (4hrs/week per user @ $50/hr)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      ${savings.delyftCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annual Delyft cost
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {savings.roi}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Return on investment
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${savings.totalSavings.toLocaleString()}
              </div>
              <div className="text-muted-foreground mb-6">
                Total annual savings with Delyft
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Saving Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;

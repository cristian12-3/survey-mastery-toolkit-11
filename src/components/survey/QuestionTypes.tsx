
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Circle, 
  AlignLeft, 
  Star, 
  ChevronDown, 
  Grid, 
  MoveVertical, 
  LineChart, 
  Calendar, 
  Upload 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionType, getQuestionTypeInfo } from "@/utils/sampleData";

interface QuestionTypesProps {
  onSelectType: (type: QuestionType) => void;
  selectedType?: QuestionType;
}

export default function QuestionTypes({ onSelectType, selectedType }: QuestionTypesProps) {
  const questionTypes: { type: QuestionType; icon: JSX.Element }[] = [
    { type: 'multiple-choice', icon: <CheckSquare className="w-5 h-5" /> },
    { type: 'single-choice', icon: <Circle className="w-5 h-5" /> },
    { type: 'text', icon: <AlignLeft className="w-5 h-5" /> },
    { type: 'rating', icon: <Star className="w-5 h-5" /> },
    { type: 'dropdown', icon: <ChevronDown className="w-5 h-5" /> },
    { type: 'matrix', icon: <Grid className="w-5 h-5" /> },
    { type: 'ranking', icon: <MoveVertical className="w-5 h-5" /> },
    { type: 'nps', icon: <LineChart className="w-5 h-5" /> },
    { type: 'date', icon: <Calendar className="w-5 h-5" /> },
    { type: 'file-upload', icon: <Upload className="w-5 h-5" /> }
  ];

  return (
    <div className="w-full">
      <h3 className="text-base font-medium mb-3">Question Types</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {questionTypes.map(({ type, icon }) => {
          const info = getQuestionTypeInfo(type);
          return (
            <Button
              key={type}
              variant="outline"
              className={cn(
                "h-auto flex flex-col items-center justify-center gap-2 p-4 hover-lift border transition-all",
                selectedType === type ? "ring-2 ring-primary/20 border-primary" : ""
              )}
              onClick={() => onSelectType(type)}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-accent rounded-full">
                {icon}
              </div>
              <span className="text-sm font-medium">{info.name}</span>
              <span className="text-xs text-muted-foreground text-center">
                {info.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

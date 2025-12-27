import React from "react";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { AnalysisResult } from "../types";
import ScoreBar from "./ScoreBar";
import AttributeBox from "./AttributeBox";

interface ResultsDisplayProps {
  analysis: AnalysisResult | null;
  error: string | null;
  isAnalyzing: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  analysis,
  error,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
        <p>Analyzing visual dimensions...</p>
        <p className="text-xs mt-2">Detecting Formality, Gender, and Weight</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 mt-4">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 mt-4">
        <Info className="w-8 h-8 mb-2 opacity-50" />
        <p>Results will appear here</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary */}
      <div className="mb-6 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
          Visual Summary
        </h4>
        <p className="text-slate-700 leading-relaxed text-sm">
          {analysis.metadata.visualDescription}
        </p>
      </div>

      {/* Dimensional Scores */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
          Visual Dimensions
        </h3>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <ScoreBar
            label="Gender Exp."
            score={analysis.measurements.genderExpression.score}
            leftLabel="Masc"
            rightLabel="Fem"
            reasoning={analysis.measurements.genderExpression.reasoning}
          />
          <ScoreBar
            label="Weight"
            score={analysis.measurements.visualWeight.score}
            leftLabel="Light"
            rightLabel="Bold"
            reasoning={analysis.measurements.visualWeight.reasoning}
          />
          <ScoreBar
            label="Embellish"
            score={analysis.measurements.embellishment.score}
            leftLabel="Simple"
            rightLabel="Ornate"
            reasoning={analysis.measurements.embellishment.reasoning}
          />
          <ScoreBar
            label="Unconventional"
            score={analysis.measurements.unconventionality.score}
            leftLabel="Classic"
            rightLabel="Weird"
            reasoning={analysis.measurements.unconventionality.reasoning}
          />
          <ScoreBar
            label="Formality"
            score={analysis.measurements.formality.score}
            leftLabel="Casual"
            rightLabel="Formal"
            reasoning={analysis.measurements.formality.reasoning}
          />
        </div>
      </div>

      {/* Attributes */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
          Attributes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <AttributeBox label="Geometry" value={analysis.attributes.geometry} />
          <AttributeBox label="Texture" value={analysis.attributes.texture} />
          <AttributeBox
            label="Wirecore"
            value={analysis.attributes.wirecore ? "Yes" : "No"}
          />
          <AttributeBox
            label="Kids?"
            value={analysis.attributes.suitableForKids ? "Yes" : "No"}
          />
        </div>
        <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">
            Colors
          </span>
          <div className="flex gap-2 flex-wrap">
            {analysis.attributes.dominantColors.map((c, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;

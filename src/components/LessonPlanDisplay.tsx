import React from 'react';

interface LessonPlanDisplayProps {
  htmlContent: string;
}

export const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ htmlContent }) => {
  // Prose classes default to dark text on light background, so this reinforces it.
  return (
    <div 
      className="prose prose-sm sm:prose-base max-w-none text-black h-full overflow-y-auto pr-2 print-content-body" 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

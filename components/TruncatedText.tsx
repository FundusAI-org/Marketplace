"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
}

const TruncatedText: FC<TruncatedTextProps> = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedText = text.slice(0, maxLength);
  const shouldTruncate = text.length > maxLength;

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        {isExpanded || !shouldTruncate ? text : `${truncatedText}...`}
      </p>
      {shouldTruncate && (
        <Button
          variant="link"
          onClick={toggleExpand}
          className="h-auto p-0 font-normal text-primary hover:no-underline"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default TruncatedText;

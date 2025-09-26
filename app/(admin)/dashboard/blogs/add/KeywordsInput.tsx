import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeywordsInputProps {
  value: string[];
  onChange: (newKeywords: string[]) => void;
}

export default function KeywordsInput({ value, onChange }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {value.map((kw) => (
          <span
            key={kw}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-1 text-center"
          >
            {kw}
            <Button
              type="button"
              className="text-blue-500 hover:text-blue-700 font-bold"
              onClick={() => removeKeyword(kw)}
            >
              ×
            </Button>
          </span>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a keyword and press Enter"
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <Button type="button" variant="outline" onClick={addKeyword}>
        Add
      </Button>
    </div>
  );
}

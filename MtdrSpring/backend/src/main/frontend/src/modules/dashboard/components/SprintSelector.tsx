import React from "react";
import useSprints from "@/modules/sprint/hooks/useSprints";
import Select from "@/components/Select";
import { Loader2 } from "lucide-react";

interface SprintSelectorProps {
  value?: string;
  onChange: (sprintId: string | undefined) => void;
  label?: string;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({
  value,
  onChange,
  label = "Filter by Sprint",
}) => {
  const { sprints, isLoading, isError } = useSprints();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-text-secondary">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading sprints...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-error-main">Failed to load sprints</div>
    );
  }

  // Sort sprints by extracting the number from "Sprint X - Description" pattern
  const sortedSprints = [...sprints].sort((a: any, b: any) => {
    const getSprintNumber = (description: string) => {
      const match = description?.match(/Sprint (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    const numA = getSprintNumber(a.description);
    const numB = getSprintNumber(b.description);

    return numA - numB;
  });

  const options = [
    { value: "", label: "All Sprints" },
    ...sortedSprints.map((sprint: any) => ({
      value: sprint.id,
      label: sprint.description || `Sprint ${sprint.id}`,
    })),
  ];

  return (
    <Select
      label={label}
      value={value || ""}
      onChange={(e) => {
        const selectedValue = e.target.value;
        onChange(selectedValue === "" ? undefined : selectedValue);
      }}
      options={options}
    />
  );
};

export default SprintSelector;

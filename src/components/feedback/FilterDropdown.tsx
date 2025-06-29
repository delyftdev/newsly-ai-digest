
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown = ({ value, onChange }: FilterDropdownProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Filter by..." />
      </SelectTrigger>
      <SelectContent className="bg-popover">
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="my-votes">My Votes</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="under-review">Under Review</SelectItem>
        <SelectItem value="planned">Planned</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="feature">Feature</SelectItem>
        <SelectItem value="improvement">Improvement</SelectItem>
        <SelectItem value="bug">Bug</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterDropdown;

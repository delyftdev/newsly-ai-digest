
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Filter } from 'lucide-react';

interface FilterDropdownProps {
  value: string;
  onChange: (filter: string) => void;
}

const FilterDropdown = ({ value, onChange }: FilterDropdownProps) => {
  const filterOptions = [
    { value: 'all', label: 'All Ideas' },
    { value: 'feature', label: 'Feature Requests' },
    { value: 'improvement', label: 'Improvements' },
    { value: 'bug', label: 'Bug Reports' },
    { value: 'integration', label: 'Integrations' },
    { value: 'styling', label: 'Styling' },
    { value: 'welcome', label: 'Welcome' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'planned', label: 'Planned' },
    { value: 'in-development', label: 'In Development' },
    { value: 'completed', label: 'Completed' },
    { value: 'declined', label: 'Declined' },
    { value: 'my-votes', label: 'My Votes' }
  ];

  const selectedOption = filterOptions.find(opt => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200">
          <Filter className="mr-2 h-4 w-4" />
          {selectedOption?.label || 'All Ideas'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;

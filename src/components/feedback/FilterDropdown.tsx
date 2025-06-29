
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Filter } from 'lucide-react';

interface FilterDropdownProps {
  sortBy: string;
  filterBy: string;
  onSortChange: (sort: 'trending' | 'new' | 'top') => void;
  onFilterChange: (filter: string) => void;
}

const FilterDropdown = ({ sortBy, filterBy, onSortChange, onFilterChange }: FilterDropdownProps) => {
  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'new', label: 'New' },
    { value: 'top', label: 'Top' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Ideas' },
    { value: 'feature', label: 'Feature Requests' },
    { value: 'improvement', label: 'Improvements' },
    { value: 'bug', label: 'Bug Reports' },
    { value: 'integration', label: 'Integrations' },
    { value: 'styling', label: 'Styling' },
    { value: 'welcome', label: 'Welcome' }
  ];

  const statusOptions = [
    { value: 'under-review', label: 'Under Review' },
    { value: 'planned', label: 'Planned' },
    { value: 'in-development', label: 'In Development' },
    { value: 'completed', label: 'Completed' },
    { value: 'declined', label: 'Declined' }
  ];

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200">
            Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value as 'trending' | 'new' | 'top')}
              className="dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200">
            <Filter className="mr-2 h-4 w-4" />
            Filter: {filterOptions.find(opt => opt.value === filterBy)?.label || 'Custom'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className="dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
          <div className="border-t dark:border-gray-700 pt-1 mt-1">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={`status-${option.value}`}
                onClick={() => onFilterChange(option.value)}
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Status: {option.label}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdown;

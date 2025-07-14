
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { ParticipantDropdown } from './ParticipantDropdown';

interface AddParticipantsButtonProps {
  changelogId: string;
  onParticipantsChange: () => void;
}

export const AddParticipantsButton: React.FC<AddParticipantsButtonProps> = ({
  changelogId,
  onParticipantsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        <Plus className="h-3 w-3" />
        Add Participants
      </Button>
      
      {isOpen && (
        <ParticipantDropdown
          changelogId={changelogId}
          onClose={() => setIsOpen(false)}
          onParticipantsChange={onParticipantsChange}
        />
      )}
    </div>
  );
};

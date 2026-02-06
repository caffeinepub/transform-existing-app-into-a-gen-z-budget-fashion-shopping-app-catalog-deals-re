import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, AlertTriangle, VolumeX, Ban } from 'lucide-react';
import { useLocalSafetyPreferences } from '../hooks/useLocalSafetyPreferences';
import ReportDialog from './ReportDialog';
import { toast } from 'sonner';

interface ContentActionsMenuProps {
  contentId: string;
  contentType: string;
  author: Principal;
  onReport: (reason: string) => Promise<void>;
}

export default function ContentActionsMenu({ contentId, contentType, author, onReport }: ContentActionsMenuProps) {
  const { muteUser, blockUser, isUserMuted, isUserBlocked } = useLocalSafetyPreferences();

  const handleMute = () => {
    muteUser(author);
    toast.success('User muted. You won\'t see their content anymore.');
  };

  const handleBlock = () => {
    blockUser(author);
    toast.success('User blocked. You won\'t see their content anymore.');
  };

  const isMuted = isUserMuted(author);
  const isBlocked = isUserBlocked(author);

  return (
    <div className="flex items-center gap-1">
      <ReportDialog
        contentId={contentId}
        contentType={contentType}
        onReport={onReport}
        trigger={
          <Button variant="ghost" size="sm">
            <AlertTriangle className="w-4 h-4" />
          </Button>
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isMuted && (
            <DropdownMenuItem onClick={handleMute}>
              <VolumeX className="w-4 h-4 mr-2" />
              Mute User
            </DropdownMenuItem>
          )}
          {!isBlocked && (
            <DropdownMenuItem onClick={handleBlock}>
              <Ban className="w-4 h-4 mr-2" />
              Block User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

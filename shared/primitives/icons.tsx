import { IconGitBranch } from "@tabler/icons-react";
import {
  ChevronRightIcon,
  Loader2Icon,
  LogInIcon,
  MusicIcon,
  SettingsIcon,
  UserPlusIcon,
} from "lucide-react";

// Component that renders nothing for "none" icon
const NoneIcon = () => null;

export const icons = {
  chevronRight: ChevronRightIcon,
  gitBranch: IconGitBranch,
  loader: Loader2Icon,
  logIn: LogInIcon,
  music: MusicIcon,
  none: NoneIcon,
  settings: SettingsIcon,
  userPlus: UserPlusIcon,
} as const;

export type IconName = keyof typeof icons;

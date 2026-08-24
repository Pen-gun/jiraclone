import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const ProjectAvatar = ({
  name,
  imageUrl
}: {
  name: string;
  imageUrl?: string | null;
}) => {
  return (
    <Avatar size="sm">
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback className="bg-blue-500 text-white text-[10px] font-semibold ring-1 ring-blue-700/20">
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
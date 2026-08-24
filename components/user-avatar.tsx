import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string | null;
  imageUrl?: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const UserAvatar = ({
  name,
  imageUrl,
  size = "default",
  className
}: UserAvatarProps) => {
  const fallbackText = name ? name[0].toUpperCase() : "?";

  return (
    <Avatar size={size} className={className}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || "User"} />}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
};

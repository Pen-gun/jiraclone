export const ProjectAvatar = ({ name }: { name: string }) => {

    return (
        <div className="size-6 shrink-0 rounded-full flex items-center justify-center overflow-hidden text-white text-[10px] font-semibold bg-blue-500 ring-1 ring-blue-700/20">
            {name[0].toUpperCase()}
        </div>
    );
}
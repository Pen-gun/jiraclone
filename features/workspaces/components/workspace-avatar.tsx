export const WorkspaceAvatar = ({ name }: { name: string }) => {

    return (
        <div className="size-7 shrink-0 rounded-full flex items-center justify-center overflow-hidden text-white text-xs font-semibold bg-blue-900 ring-1 ring-blue-700/20">
            {name[0].toUpperCase()}
        </div>
    );
}
import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateWorkspaceModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-workspace",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
    //localhost:3000/dashboard?create-workspace=true
    
}

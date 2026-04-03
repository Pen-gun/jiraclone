
import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateProjectModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-project",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return {
        isOpen,
        openModal,
        closeModal,
        setIsOpen
    }
}

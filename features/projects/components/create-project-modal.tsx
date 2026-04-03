"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

export const CreateProjectModal = () => {
    const {isOpen, setIsOpen, closeModal} = useCreateProjectModal();

    return(
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen} >
            <CreateProjectForm onCancel={closeModal} />
        </ResponsiveModal>
    )
}
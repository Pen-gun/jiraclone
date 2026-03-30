import { JSX, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const useConfirm = (
    title: string,
    message: string,
    variant: "destructive"
): [() => JSX.Element, () => Promise<boolean>] => {
    // Only store the resolve function for simplicity
    const [resolveFn, setResolveFn] = useState<((value: boolean) => void) | null>(null);

    // Main confirm function
    const confirm = useCallback((): Promise<boolean> => {
        if (resolveFn) return Promise.resolve(false); // Prevent multiple unresolved modals
        return new Promise<boolean>((resolve) => setResolveFn(() => resolve));
    }, [resolveFn]);

    // Close modal
    const handleClose = useCallback(() => {
        setResolveFn(null);
    }, []);

    // Handle confirm/cancel actions
    const handleConfirm = useCallback(() => {
        const currentResolve = resolveFn;
        handleClose();
        currentResolve?.(true);
    }, [resolveFn, handleClose]);

    const handleCancel = useCallback(() => {
        const currentResolve = resolveFn;
        handleClose();
        currentResolve?.(false);
    }, [resolveFn, handleClose]);

    // Cleanup: reject pending promise on unmount
    useEffect(() => {
        return () => {
            if (resolveFn) resolveFn(false);
        };
    }, [resolveFn]);

    // Confirmation Dialog Component
    const ConfirmationDialog = useCallback(() => (
        <ResponsiveModal open={resolveFn !== null} onOpenChange={handleClose}>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <CardHeader className="p-0">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                        <Button variant={variant} onClick={handleConfirm} className="w-full lg:w-auto">
                            Confirm
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="w-full lg:w-auto">
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    ), [resolveFn, handleClose, handleConfirm, handleCancel, title, message]);

    return [ConfirmationDialog, confirm];
};
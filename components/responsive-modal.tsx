"use client";

import { useEffect, useState } from "react";
import { useMedia } from "react-use";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent,
    DrawerTitle
} from "@/components/ui/drawer";

interface ResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
    children,
    open,
    onOpenChange
}: ResponsiveModalProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const isDesktop = useMedia("(min-width: 1024px)", true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const showDesktopModal = isMounted ? isDesktop : true;

    if (showDesktopModal) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                    <DialogTitle className="sr-only">Dialog</DialogTitle>
                    <DialogDescription className="sr-only">Modal content</DialogDescription>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTitle className="text-lg font-bold">
                
            </DrawerTitle>
            <DrawerContent>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
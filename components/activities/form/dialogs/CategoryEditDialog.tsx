"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "../CategoryForm";
import { useEditDialogStore } from "@/store/zustand/editDialogStore";
import { Category } from "@prisma/client";

interface CategoryEditDialogProps {
    categories: Category[];
}

export const CategoryEditDialog = ({ categories }: CategoryEditDialogProps) => {
    const { openDialogId, closeDialog } = useEditDialogStore();

    const category = categories.find((c) => c.id === openDialogId);

    if (!category) return null;

    return (
        <Dialog open={!!openDialogId} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    initialData={{
                        id: category.id,
                        name: category.name,
                        description: category.description ?? undefined,
                    }}
                    onSuccess={closeDialog}
                    mode="edit"
                />
            </DialogContent>
        </Dialog>
    );
};

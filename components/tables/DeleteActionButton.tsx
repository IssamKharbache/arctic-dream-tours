import { useDeleleActionButtonStore } from "@/store/zustand/deleteActionButtonStore";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
interface DeleteActionButtonProps {
    title?: string;
    endpoint: string;
}

const DeleteActionButton = ({ title, endpoint }: DeleteActionButtonProps) => {
    const { isLoading, setIsLoading } = useDeleleActionButtonStore();
    const router = useRouter();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You cannot undo this actions !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#cc1414",
            cancelButtonColor: "#6f7478",
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes , delete it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true);
                    const response = await axios.delete(endpoint);
                    if (response.status === 201) {
                        toast.success(`${title} deleted successfully`);
                        setIsLoading(false);
                        router.refresh();
                    } else {
                        setIsLoading(false);
                    }
                } catch (error) {
                    toast.success(`Error while trying to delete ${title}`);
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        });
    };

    return (
        <>
            {isLoading ? (
                <Loader2 className="text-red-500 animate-spin" />
            ) : (
                <button
                    onClick={handleDelete}
                    className="flex items-center text-red-500 justify-center  rounded-full gap-2"
                >
                    <Trash2 className={`w-4 h-4  text-red-500 `} />
                    Delete
                </button>
            )}
        </>
    );
};

export default DeleteActionButton;

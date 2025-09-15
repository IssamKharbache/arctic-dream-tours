"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Images } from "lucide-react";
import Gallery from "./main/Gallery";

const GalleryDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 ">
          <Images className="w-4 h-4" />
          View Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden sm:max-w-[95vw]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            Photos Gallery
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <Gallery />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryDialog;

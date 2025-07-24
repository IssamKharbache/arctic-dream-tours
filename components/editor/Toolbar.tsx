"use client";

import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "../ui/dropdown-menu"; // adjust path if needed

export default function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive("heading", { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive("heading", { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive("heading", { level: 3 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive("bold"),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive("italic"),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive("strike"),
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: editor.isActive({ textAlign: "left" }),
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: editor.isActive({ textAlign: "center" }),
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: editor.isActive({ textAlign: "right" }),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive("bulletList"),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive("orderedList"),
        },
    ];

    const highlightColors = [
        { name: "Orange", color: "#ffc078" },
        { name: "Green", color: "#8ce99a" },
        { name: "Blue", color: "#74c0fc" },
        { name: "Purple", color: "#b197fc" },
        { name: "Red", color: "red" },
        { name: "Red (light)", color: "#ffa8a8" },
    ];

    return (
        <div className="border rounded-md p-1 mb-1  space-x-2 flex flex-wrap z-50">
            {Options.map((option, index) => (
                <Toggle
                    key={index}
                    pressed={option.pressed}
                    onPressedChange={option.onClick}
                >
                    {option.icon}
                </Toggle>
            ))}

            {/* Highlight dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Toggle
                        pressed={editor.isActive("highlight")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleHighlight().run()
                        }
                    >
                        <Highlighter className="size-4" />
                    </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    {highlightColors.map((item, i) => (
                        <DropdownMenuItem
                            key={i}
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHighlight({ color: item.color })
                                    .run()
                            }
                            className="flex items-center gap-2"
                        >
                            <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                        onClick={() =>
                            editor.chain().focus().unsetHighlight().run()
                        }
                        className="text-red-500"
                    >
                        Remove Highlight
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-") // Replace spaces and underscores with -
        .replace(/[^\w-]+/g, "") // Remove all non-word characters except -
        .replace(/--+/g, "-") // Replace multiple dashes with single -
        .replace(/^-+|-+$/g, ""); // Trim dashes from start and end
}

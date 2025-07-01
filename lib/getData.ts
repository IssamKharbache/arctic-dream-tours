export async function getData<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
}

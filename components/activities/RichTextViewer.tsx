type Props = {
    content: string;
};

export default function RichTextViewer({ content }: Props) {
    return (
        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    );
}

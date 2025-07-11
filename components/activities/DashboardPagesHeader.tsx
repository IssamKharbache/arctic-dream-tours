import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardPagesHeaderProps {
    title: string;
    linkTitle?: string;
    link?: string;
}

const DashboardPagesHeader = ({
    title,
    linkTitle,
    link,
}: DashboardPagesHeaderProps) => {
    return (
        <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-semibold text-foreground">
                    {title}
                </h1>
                {link ? (
                    <Button asChild>
                        <Link href={link}>{linkTitle}</Link>
                    </Button>
                ) : null}
            </CardContent>
        </Card>
    );
};

export default DashboardPagesHeader;

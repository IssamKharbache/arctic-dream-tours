import { VerificationEmail } from "@/components/email/VerificationEmail";
import { render } from "@react-email/render";

export const generateVerificationEmailHtml = async (code: string) => {
    return render(<VerificationEmail code={code} />);
};

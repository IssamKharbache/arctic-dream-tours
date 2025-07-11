// components/SyncUserInfo.tsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserInfoStore } from "@/store/zustand/store";

const SyncUserInfo = () => {
    const { data: session } = useSession();
    const setUserInfo = useUserInfoStore((s) => s.setUserInfo);

    useEffect(() => {
        if (session?.user) {
            setUserInfo({
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                email: session.user.email,
            });
        }
    }, [session]);

    return null;
};

export default SyncUserInfo;

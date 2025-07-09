import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Edit2, Save, X, User, Lock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
}

interface ProfileContentProps {
    userData: UserData;
}

const ProfileContent = ({ userData }: ProfileContentProps) => {
    const queryClient = useQueryClient();

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [profileErrors, setProfileErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData: {
            firstName: string;
            lastName: string;
            email: string;
        }) => {
            const res = await fetch(
                `http://localhost:3000/api/user/updatedata/${userData.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData),
                },
            );

            if (!res.ok) {
                const errorResponse = await res.json();
                const error = new Error("Update failed");
                // @ts-ignore
                error.status = res.status;
                // @ts-ignore
                error.message = errorResponse.message || "An error occurred";
                throw error;
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Profile updated successfully.");
            setIsEditingProfile(false);
            queryClient.invalidateQueries({ queryKey: ["user", userData.id] });
            setProfileErrors({ firstName: "", lastName: "", email: "" });
        },
        onError: (error: any) => {
            if (error.status === 409) {
                setProfileErrors((prev) => ({
                    ...prev,
                    email: "Email is already in use by another account. Try using another email address",
                }));
                toast.error("Email is already in use.");
                return;
            }

            toast.error("An error occurred while updating the profile.");
        },
    });
    const updatePasswordMutation = useMutation({
        mutationFn: async (passwordData: {
            currentPassword: string;
            newPassword: string;
        }) => {
            const res = await fetch(
                `http://localhost:3000/api/user/updatepassword/${userData.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(passwordData),
                },
            );

            if (!res.ok) {
                if (res.status === 401)
                    throw new Error("Current password is incorrect.");
                throw new Error("Failed to update password.");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Password updated successfully.");
            setIsEditingPassword(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        },
        onError: (error: any) => {
            if (error.message === "Current password is incorrect.") {
                setPasswordErrors((prev) => ({
                    ...prev,
                    currentPassword: error.message,
                }));
            } else {
                toast.error("An error occurred while updating the password.");
            }
        },
    });

    const handleProfileSave = () => {
        const errors = { firstName: "", lastName: "", email: "" };
        let hasError = false;

        if (!profileData.firstName.trim()) {
            errors.firstName = "First name is required.";
            hasError = true;
        }

        if (!profileData.lastName.trim()) {
            errors.lastName = "Last name is required.";
            hasError = true;
        }

        if (!profileData.email.trim()) {
            errors.email = "Email is required.";
            hasError = true;
        }

        setProfileErrors(errors);

        if (hasError) return;

        const clean = (str: string) => str.replace(/\s+/g, "");

        updateProfileMutation.mutate({
            firstName: clean(profileData.firstName),
            lastName: clean(profileData.lastName),
            email: clean(profileData.email),
        });
    };

    const handlePasswordSave = () => {
        const errors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
        let hasError = false;

        if (!passwordData.currentPassword.trim()) {
            errors.currentPassword = "Current password is required.";
            hasError = true;
        }

        if (!passwordData.newPassword.trim()) {
            errors.newPassword = "New password is required.";
            hasError = true;
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = "Password must be at least 6 characters.";
            hasError = true;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
            hasError = true;
        }

        // **NEW CHECK: Prevent new password being same as current password**
        if (passwordData.currentPassword && passwordData.newPassword) {
            if (passwordData.currentPassword === passwordData.newPassword) {
                errors.newPassword =
                    "New password cannot be the same as current password.";
                hasError = true;
            }
        }

        setPasswordErrors(errors);

        if (hasError) return;

        updatePasswordMutation.mutate({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });
    };
    const cancelProfileEdit = () => {
        setIsEditingProfile(false);
        setProfileData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        });
        setProfileErrors({ firstName: "", lastName: "", email: "" });
    };

    const cancelPasswordEdit = () => {
        setIsEditingPassword(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setPasswordErrors({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
                                <User className="h-5 w-5" /> Profile Information
                            </CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-300">
                                Manage your personal information
                            </CardDescription>
                        </div>
                        {!isEditingProfile ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingProfile(true)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                                <Edit2 className="h-4 w-4 mr-1" /> Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={cancelProfileEdit}
                                    disabled={updateProfileMutation.isPending}
                                    className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleProfileSave}
                                    disabled={updateProfileMutation.isPending}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Save className="h-4 w-4 mr-1" />{" "}
                                    {updateProfileMutation.isPending
                                        ? "Saving..."
                                        : "Save"}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {["firstName", "lastName", "email"].map((field) => (
                        <div key={field} className="space-y-2">
                            <Label
                                htmlFor={field}
                                className="text-gray-700 dark:text-gray-300"
                            >
                                {field === "firstName"
                                    ? "First Name"
                                    : field === "lastName"
                                      ? "Last Name"
                                      : "Email Address"}
                            </Label>
                            {isEditingProfile ? (
                                <>
                                    <Input
                                        id={field}
                                        type={
                                            field === "email" ? "email" : "text"
                                        }
                                        value={
                                            profileData[
                                                field as keyof typeof profileData
                                            ]
                                        }
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                [field]: e.target.value,
                                            })
                                        }
                                        className="bg-white/60 outline-none focus:bg-white/20 focus:border-blue-400"
                                    />
                                    {profileErrors[
                                        field as keyof typeof profileErrors
                                    ] && (
                                        <p className="text-sm text-red-400">
                                            {
                                                profileErrors[
                                                    field as keyof typeof profileErrors
                                                ]
                                            }
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-gray-400 dark:border-white/10">
                                    <p className="text-gray-700 dark:text-white">
                                        {
                                            profileData[
                                                field as keyof typeof profileData
                                            ]
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
                                <Lock className="h-5 w-5" /> Security Settings
                            </CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-300">
                                Manage your password and security
                            </CardDescription>
                        </div>
                        {!isEditingPassword ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingPassword(true)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                                <Edit2 className="h-4 w-4 mr-1" /> Change
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={cancelPasswordEdit}
                                    disabled={updatePasswordMutation.isPending}
                                    className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handlePasswordSave}
                                    disabled={updatePasswordMutation.isPending}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Save className="h-4 w-4 mr-1" />{" "}
                                    {updatePasswordMutation.isPending
                                        ? "Updating..."
                                        : "Update"}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isEditingPassword ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <div className="p-3 bg-white/5 rounded-lg border border-gray-500 dark:border-white/10">
                                    <p className="text-gray-600 dark:text-white">
                                        ••••••••••••
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        [
                            "currentPassword",
                            "newPassword",
                            "confirmPassword",
                        ].map((field, idx) => (
                            <div key={field} className="space-y-2">
                                <Label
                                    htmlFor={field}
                                    className="text-gray-700 dark:text-gray-300"
                                >
                                    {field === "currentPassword"
                                        ? "Current Password"
                                        : field === "newPassword"
                                          ? "New Password"
                                          : "Confirm New Password"}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id={field}
                                        type={
                                            (field === "currentPassword" &&
                                                showCurrentPassword) ||
                                            (field === "newPassword" &&
                                                showNewPassword) ||
                                            (field === "confirmPassword" &&
                                                showConfirmPassword)
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            passwordData[
                                                field as keyof typeof passwordData
                                            ]
                                        }
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                [field]: e.target.value,
                                            })
                                        }
                                        className="bg-white/60 outline-none focus:bg-white/20 focus:border-blue-400"
                                        placeholder={
                                            field === "currentPassword"
                                                ? "Enter current password"
                                                : field === "newPassword"
                                                  ? "Enter new password"
                                                  : "Confirm new password"
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                                        onClick={() => {
                                            if (field === "currentPassword")
                                                setShowCurrentPassword(
                                                    !showCurrentPassword,
                                                );
                                            if (field === "newPassword")
                                                setShowNewPassword(
                                                    !showNewPassword,
                                                );
                                            if (field === "confirmPassword")
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                );
                                        }}
                                    >
                                        {(field === "currentPassword" &&
                                            showCurrentPassword) ||
                                        (field === "newPassword" &&
                                            showNewPassword) ||
                                        (field === "confirmPassword" &&
                                            showConfirmPassword) ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {passwordErrors[
                                    field as keyof typeof passwordErrors
                                ] && (
                                    <p className="text-sm text-red-400">
                                        {
                                            passwordErrors[
                                                field as keyof typeof passwordErrors
                                            ]
                                        }
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileContent;

"use client";

import { useState } from "react";
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
    // States
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

    // Handle password save function
    const handlePasswordSave = () => {
        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            toast("Please enter all password fields");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast("Passwords must match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast("Password must be more than 6 characters");
            return;
        }

        // Add your password update logic here
        console.log("Password update logic would go here");
    };

    // Cancel editing profile
    const cancelProfileEdit = () => {
        setIsEditingProfile(false);
        setProfileData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
        });
    };

    // Cancel password edit function
    const cancelPasswordEdit = () => {
        setIsEditingPassword(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handleProfileSave = async () => {
        // Ensure all fields are strings before trimming
        if (
            typeof profileData.firstName !== "string" ||
            typeof profileData.lastName !== "string" ||
            typeof profileData.email !== "string" ||
            !profileData.firstName.trim() ||
            !profileData.lastName.trim() ||
            !profileData.email.trim()
        ) {
            toast("Please fill in all fields");
            return;
        }

        const clean = (str: unknown) => {
            if (typeof str !== "string") return "";
            return str.trim().toLowerCase();
        };

        const updatedFirstName =
            userData.firstName === profileData.firstName
                ? userData.firstName
                : clean(profileData.firstName);

        const updatedLastName =
            userData.lastName === profileData.lastName
                ? userData.lastName
                : clean(profileData.lastName);

        const updatedEmail =
            userData.email === profileData.email
                ? userData.email
                : clean(profileData.email);

        try {
            const res = await fetch(
                `http://localhost:3000/api/user/updatedata/${userData.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: updatedFirstName,
                        lastName: updatedLastName,
                        email: updatedEmail,
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword,
                    }),
                },
            );

            if (!res.ok) {
                toast("Failed to update profile.");
                console.error("Error response: ", res);
                return;
            }

            toast("Profile updated successfully.");
            console.log("Update success: ", res);
        } catch (error) {
            toast("An error occurred while updating the profile.");
            console.error("Update error: ", error);
        }

        setIsEditingProfile(false);
    };
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information */}
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription className="text-gray-300">
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
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={cancelProfileEdit}
                                    className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleProfileSave}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-300">
                            First Name
                        </Label>
                        {isEditingProfile ? (
                            <Input
                                id="firstName"
                                value={profileData.firstName}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        firstName: e.target.value,
                                    })
                                }
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400"
                            />
                        ) : (
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-white">
                                    {userData.firstName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-300">
                            Last Name
                        </Label>
                        {isEditingProfile ? (
                            <Input
                                id="lastName"
                                value={profileData.lastName}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        lastName: e.target.value,
                                    })
                                }
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400"
                            />
                        ) : (
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-white">
                                    {userData.lastName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                            Email Address
                        </Label>
                        {isEditingProfile ? (
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        email: e.target.value,
                                    })
                                }
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400"
                            />
                        ) : (
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-white">{userData.email}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription className="text-gray-300">
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
                                <Edit2 className="h-4 w-4 mr-1" />
                                Change
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={cancelPasswordEdit}
                                    className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handlePasswordSave}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Save className="h-4 w-4 mr-1" />
                                    Update
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isEditingPassword ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">
                                    Password
                                </Label>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <p className="text-white">••••••••••••</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="currentPassword"
                                    className="text-gray-300"
                                >
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400 pr-10"
                                        placeholder="Enter current password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword,
                                            )
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="newPassword"
                                    className="text-gray-300"
                                >
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400 pr-10"
                                        placeholder="Enter new password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-gray-300"
                                >
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400 pr-10"
                                        placeholder="Confirm new password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="text-sm text-gray-400">
                                Password must be at least 6 characters long
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileContent;

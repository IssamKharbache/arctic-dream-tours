import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Snowflake,
    Mountain,
    Star,
    Send,
    Calendar,
    Users,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const ContactPage = async () => {
    const t = await getTranslations("ContactPage");

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60 z-10" />
                <Image
                    src="/aurora.jpg"
                    alt="Finnish winter landscape with aurora"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                        {t("header")}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        {t("hero.title")}
                    </p>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        {t("hero.subtitle")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Badge
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-100 border-blue-300"
                        >
                            <Snowflake className="h-4 w-4 mr-1" />
                            {t("hero.badges.aurora")}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-100 border-blue-300"
                        >
                            <Mountain className="h-4 w-4 mr-1" />
                            {t("hero.badges.husky")}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-100 border-blue-300"
                        >
                            <Star className="h-4 w-4 mr-1" />
                            {t("hero.badges.winter")}
                        </Badge>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-8">
                            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                                {t("form.title")}
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-600">
                                {t("form.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="firstName"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            {t("form.fields.firstName")}
                                        </label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            className="border-gray-300 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="lastName"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            {t("form.fields.lastName")}
                                        </label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            className="border-gray-300 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        {t("form.fields.email")}
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        {t("form.fields.phone")}
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="dates"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        {t("form.fields.dates")}
                                    </label>
                                    <Input
                                        id="dates"
                                        name="dates"
                                        placeholder={t(
                                            "form.fields.datesPlaceholder",
                                        )}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="message"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        {t("form.fields.message")}
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        placeholder={t(
                                            "form.fields.messagePlaceholder",
                                        )}
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                                >
                                    <Send className="h-5 w-5 mr-2" />
                                    {t("form.fields.submit")}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information & Activities */}
                    <div className="space-y-8">
                        {/* Contact Info */}
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-center">
                                    {t("contactInfo.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {t("contactInfo.visit.title")}
                                        </h3>
                                        <p className="text-blue-100">
                                            {t("contactInfo.visit.address1")}
                                        </p>
                                        <p className="text-blue-100">
                                            {t("contactInfo.visit.address2")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {t("contactInfo.phone.title")}
                                        </h3>
                                        <p className="text-blue-100">
                                            {t("contactInfo.phone.number")}
                                        </p>
                                        <p className="text-sm text-blue-200">
                                            {t(
                                                "contactInfo.phone.availability",
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {t("contactInfo.email.title")}
                                        </h3>
                                        <p className="text-blue-100">
                                            {t("contactInfo.email.address")}
                                        </p>
                                        <p className="text-sm text-blue-200">
                                            {t(
                                                "contactInfo.email.responseTime",
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {t("contactInfo.hours.title")}
                                        </h3>
                                        <p className="text-blue-100">
                                            {t("contactInfo.hours.schedule")}
                                        </p>
                                        <p className="text-sm text-blue-200">
                                            {t("contactInfo.hours.timezone")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Activities */}
                        <Card className="shadow-xl border-0">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                    <Star className="h-6 w-6 mr-2 text-yellow-500" />
                                    {t("activities.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <Snowflake className="h-6 w-6 text-blue-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {t(
                                                    "activities.items.aurora.title",
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {t(
                                                    "activities.items.aurora.description",
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                        <Users className="h-6 w-6 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {t(
                                                    "activities.items.husky.title",
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {t(
                                                    "activities.items.husky.description",
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                                        <Mountain className="h-6 w-6 text-purple-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {t(
                                                    "activities.items.skiing.title",
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {t(
                                                    "activities.items.skiing.description",
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                                        <Calendar className="h-6 w-6 text-orange-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {t(
                                                    "activities.items.packages.title",
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {t(
                                                    "activities.items.packages.description",
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Why Choose Us */}
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-gray-800">
                                    {t("whyChooseUs.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-gray-700">
                                    {t
                                        .raw("whyChooseUs.points")
                                        .map((point, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center"
                                            >
                                                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                                                {point}
                                            </li>
                                        ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

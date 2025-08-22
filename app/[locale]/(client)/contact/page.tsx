import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send } from "lucide-react";

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-white relative">
            <div className="max-w-7xl mx-auto px-4 py-16 ">
                <div className="flex flex-col lg:flex-row gap-12 items-start mt-24">
                    {/* Left Side - Contact Info */}
                    <div className="lg:w-1/2 space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-primary mb-4">
                                Get In Touch!
                            </h1>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                                We're Here to Help
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Got questions or need assistance? We're here to
                                help! Reach out to us using the form below or
                                via the contact details provided, and we'll get
                                back to you as soon as possible.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="text-primary" size={20} />
                                <a
                                    href="mailto:Arcticdreamtours@gmail.com"
                                    className="text-lg font-medium text-gray-900"
                                >
                                    Arcticdreamtours@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-primary" size={20} />
                                <p className="text-lg font-medium text-gray-900">
                                    +358 40 0408538
                                </p>
                            </div>
                            <div className="pt-4">
                                <p className="text-lg font-medium text-primary">
                                    FOLLOW US ON
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="fullName"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Full Name
                                    </label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        required
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex gap-4 w-full">
                                    <div className="flex-1 flex flex-col">
                                        <label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="border-gray-300 focus:border-blue-500 h-full py-3"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <label
                                            htmlFor="phone"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            className="border-gray-300 focus:border-blue-500 h-full"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="message"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        placeholder="Tell us how we can help you..."
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                >
                                    <Send className="h-5 w-5 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

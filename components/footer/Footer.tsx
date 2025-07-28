import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">
                                Arctic Dream Tours
                            </h3>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                Your trusted partner for authentic Finnish
                                experiences. Creating unforgettable Arctic
                                adventures since 2015.
                            </p>
                            <div className="flex space-x-4">
                                <Link
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    facebook
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    instagram
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    twitter
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Contact Info
                            </h4>
                            <div className="space-y-3 text-gray-300">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>Rovaniemi, Finland</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-2" />
                                    <span>+358 40 123 4567</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2" />
                                    <span>info@arcticdreamtours.fi</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Quick Links
                            </h4>
                            <div className="space-y-2 text-gray-300">
                                <Link
                                    href="#"
                                    className="block hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="#"
                                    className="block hover:text-white transition-colors"
                                >
                                    Tour Packages
                                </Link>
                                <Link
                                    href="#"
                                    className="block hover:text-white transition-colors"
                                >
                                    Activities
                                </Link>
                                <Link
                                    href="#"
                                    className="block hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                                <Link
                                    href="#"
                                    className="block hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="#"
                                    className="block hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} Arctic Dream
                            Tours. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;

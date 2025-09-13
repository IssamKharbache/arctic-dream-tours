import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/">
                <Image
                  src={"/arcticLogoDark.png"}
                  alt="Logo"
                  width={200}
                  height={200}
                  className="mb-5"
                />
              </Link>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Discover the true essence of Finland with our carefully curated
                Arctic adventures, combining local culture, stunning nature, and
                memorable experiences.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  facebook
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  instagram
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  twitter
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Rovaniemi, Finland</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Helsinki, Finland</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+003 58 4041 21843</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>arcticdreamtours@gmail.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-300">
                <Link
                  href="/about"
                  className="block hover:text-white transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/activities"
                  className="block hover:text-white transition-colors"
                >
                  Activities
                </Link>
                <Link
                  href="/contact"
                  className="block hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy-policy"
                  className="block hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-conditions"
                  className="block hover:text-white transition-colors"
                >
                  Terms and conditions
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Arctic Dream Tours. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone, Shield, CreditCard } from "lucide-react";
import Image from "next/image";

import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaStripe,
} from "react-icons/fa";

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
              {/* <div className="flex space-x-4 mb-6">
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
              </div> */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-green-400 mr-2" />
                  <span className="font-medium">Secure Payments</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Your payments are protected with industry-leading security
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-white p-1 rounded-md">
                    <FaCcVisa className="h-6 w-8 text-blue-800" />
                  </div>
                  <div className="bg-white p-1 rounded-md">
                    <FaCcMastercard className="h-6 w-8 text-red-600" />
                  </div>
                  <div className="bg-white p-1 rounded-md">
                    <FaCcAmex className="h-6 w-8 text-blue-600" />
                  </div>
                  <div className="bg-white p-1 rounded-md">
                    <FaStripe className="h-6 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <div className="flex flex-col">
                    <span>Lampelankatu 24 c 3 ,</span>
                    <span> Rovaniemi , Finland</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <div className="flex flex-col">
                    <span>Piispanristi 2 a5 espoo ,</span>
                    <span> Helsinki , 02200 Finland.</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+358 4041 21843</span>
                </div>
                <a href="mailto:arcticdreamtours@gmail.com">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>arcticdreamtours@gmail.com</span>
                  </div>
                </a>
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

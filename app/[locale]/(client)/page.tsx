"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Snowflake,
    Mountain,
    Waves,
    Fish,
    Car,
    Star,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ArcticDreamTours() {
    const experiences = [
        {
            icon: <Star className="h-8 w-8 text-blue-600" />,
            title: "Northern Lights Tours",
            description:
                "Witness the magical Aurora Borealis in Finland's pristine wilderness under expert guidance.",
        },
        {
            icon: <Mountain className="h-8 w-8 text-blue-600" />,
            title: "Husky Safaris",
            description:
                "Experience the thrill of mushing through snow-covered forests with friendly Siberian huskies.",
        },
        {
            icon: <Waves className="h-8 w-8 text-blue-600" />,
            title: "Sauna + Ice Swimming",
            description:
                "Embrace the Finnish tradition of sauna followed by an invigorating dip in icy waters.",
        },
        {
            icon: <Fish className="h-8 w-8 text-blue-600" />,
            title: "Ice Fishing",
            description:
                "Try your luck at traditional ice fishing on frozen lakes while enjoying the peaceful Arctic silence.",
        },
        {
            icon: <Car className="h-8 w-8 text-blue-600" />,
            title: "Snowmobile Adventures",
            description:
                "Explore vast snowy landscapes and frozen lakes on powerful snowmobiles with scenic routes.",
        },
        {
            icon: <Snowflake className="h-8 w-8 text-blue-600" />,
            title: "Winter Photography",
            description:
                "Capture stunning winter landscapes and wildlife with professional photography guidance.",
        },
    ];

    const packages = [
        {
            title: "Arctic Explorer",
            duration: "5 Days / 4 Nights",
            description:
                "Northern Lights tour, husky safari, ice fishing, and traditional sauna experience.",
            price: "From €899",
        },
        {
            title: "Winter Wonderland",
            duration: "7 Days / 6 Nights",
            description:
                "Complete Arctic experience including snowmobile adventures, reindeer farm visit, and cultural activities.",
            price: "From €1,299",
        },
        {
            title: "Aurora Hunter",
            duration: "3 Days / 2 Nights",
            description:
                "Focused Northern Lights experience with multiple viewing opportunities and photography workshops.",
            price: "From €599",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            country: "United Kingdom",
            text: "Arctic Dream Tours made our Finnish adventure absolutely magical! The Northern Lights tour was breathtaking, and our guide Maria was incredibly knowledgeable and friendly.",
        },
        {
            name: "Hans Mueller",
            country: "Germany",
            text: "Professional service from start to finish. The husky safari was the highlight of our trip, and the traditional sauna experience was authentic and relaxing.",
        },
        {
            name: "Emma Chen",
            country: "Australia",
            text: "Exceeded all expectations! The custom package they created for our family was perfect. Our kids loved the reindeer farm, and we'll never forget the Aurora Borealis.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/placeholder.svg?height=1080&width=1920"
                        alt="Northern Lights over Finnish landscape"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/40" />
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Arctic Dream Tours
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-light mb-4">
                        Explore Finland with Arctic Dream Tours
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
                        Tailored travel experiences and activity packages across
                        Finland
                    </p>
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                    >
                        Start Your Arctic Journey
                    </Button>
                </div>
            </section>

            {/* Top Experiences Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Unforgettable Experiences
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover the magic of Finland through our carefully
                            curated activities and adventures
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experiences.map((experience, index) => (
                            <Card
                                key={index}
                                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <CardHeader className="text-center pb-4">
                                    <div className="flex justify-center mb-4">
                                        {experience.icon}
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {experience.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 text-center leading-relaxed">
                                        {experience.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tour Packages Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Tour Packages
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose from our popular packages or let us create a
                            custom experience just for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {packages.map((pkg, index) => (
                            <Card
                                key={index}
                                className="border-2 border-blue-100 hover:border-blue-300 transition-colors duration-300"
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-900">
                                        {pkg.title}
                                    </CardTitle>
                                    <CardDescription className="text-blue-600 font-semibold">
                                        {pkg.duration}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {pkg.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-blue-900">
                                            {pkg.price}
                                        </span>
                                        <Button
                                            variant="outline"
                                            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                                        >
                                            Learn More
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-lg text-gray-600 mb-6">
                            Looking for something different? We create custom
                            packages tailored to your interests and budget.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Request Custom Package
                        </Button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 px-4 bg-blue-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                        About Arctic Dream Tours
                    </h2>
                    <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                        <p>
                            Founded in the heart of Finland, Arctic Dream Tours
                            is your gateway to experiencing the authentic beauty
                            and culture of our Nordic homeland. We specialize in
                            creating unforgettable moments for international
                            visitors who seek adventure, tranquility, and
                            genuine Finnish hospitality.
                        </p>
                        <p>
                            Our team of local experts brings years of experience
                            and deep knowledge of Finland's hidden gems. We
                            offer multilingual support and personalized service
                            to ensure every guest feels welcomed and comfortable
                            throughout their Arctic journey.
                        </p>
                        <p>
                            From the dancing Northern Lights to the peaceful
                            silence of snow-covered forests, we help you
                            discover the magic that makes Finland truly special.
                            Every tour is crafted with care, combining
                            traditional Finnish experiences with modern comfort
                            and safety.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our Guests Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Real experiences from travelers who've discovered
                            Finland with us
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-0 shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6 italic leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-gray-500">
                                            {testimonial.country}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 px-4 bg-blue-900 text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Ready for Your Arctic Adventure?
                        </h2>
                        <p className="text-xl opacity-90">
                            Get in touch with us to start planning your
                            unforgettable Finnish experience
                        </p>
                    </div>

                    <Card className="bg-white text-gray-900">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">
                                Send Us an Inquiry
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="dates">
                                            Preferred Dates
                                        </Label>
                                        <Input
                                            id="dates"
                                            placeholder="e.g., March 2024"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="guests">
                                            Number of Guests
                                        </Label>
                                        <Input
                                            id="guests"
                                            placeholder="e.g., 2 adults"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="message">
                                        Tell us about your dream trip
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="What experiences are you most interested in? Any special requirements?"
                                        rows={4}
                                    />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                                    Send Inquiry
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

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
                                    <Facebook className="h-6 w-6" />
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    <Instagram className="h-6 w-6" />
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    <Twitter className="h-6 w-6" />
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
}

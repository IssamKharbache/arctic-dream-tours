import { Plane, Car, Coffee, Home, Shirt, Users } from "lucide-react";
type DayItem = { day: string; label: string };

export type Package = {
  id: string;
  name: string;
  duration: string;
  price?: number;
  priceWithHotel?: number;
  priceWithoutHotel?: number;
  itinerary: DayItem[];
  popular?: boolean;
};

export const PACKAGES: Package[] = [
  {
    id: "classic",
    name: "Lapland Classic",
    duration: "4 DAYS / 3 NIGHTS",
    priceWithHotel: 3300,
    priceWithoutHotel: 1050,
    itinerary: [
      { day: "Day 1", label: "Santa Claus Village & Snowman World" },
      {
        day: "Day 2",
        label: "Husky Safari, Reindeer Experience & Arctic SnowHotel",
      },
      { day: "Day 3", label: "Snowmobile Adventure & Northern Lights Tour" },
      { day: "Day 4", label: "Rovaniemi City Tour & Shopping" },
    ],
  },
  {
    id: "dream",
    name: "Lapland Dream",
    duration: "6 DAYS / 5 NIGHTS",
    priceWithHotel: 5330,
    priceWithoutHotel: 1380,
    itinerary: [
      { day: "Day 1", label: "Santa Claus Village & Snowman World" },
      {
        day: "Day 2",
        label: "Husky Safari, Reindeer Experience & Arctic SnowHotel",
      },
      { day: "Day 3", label: "Snowmobile Adventure & Northern Lights Tour" },
      { day: "Day 4", label: "Rovaniemi City Tour & Shopping" },
      { day: "Day 5", label: "Finnish Horse Riding Experience" },
      { day: "Day 6", label: "Ranua Wildlife Park" },
    ],
  },
  {
    id: "ultimate",
    name: "Full Lapland Experience",
    duration: "7 DAYS / 6 NIGHTS",
    priceWithHotel: 6050,
    priceWithoutHotel: 1560,
    popular: true,
    itinerary: [
      { day: "Day 1", label: "Santa Claus Village & Snowman World" },
      {
        day: "Day 2",
        label: "Husky Safari, Reindeer Experience & Arctic SnowHotel",
      },
      { day: "Day 3", label: "Snowmobile Adventure & Northern Lights Tour" },
      { day: "Day 4", label: "Rovaniemi City Tour & Shopping" },
      { day: "Day 5", label: "Finnish Horse Riding Experience" },
      { day: "Day 6", label: "Ranua Wildlife Park" },
      { day: "Day 7", label: "Korouoma Frozen Waterfalls Tour" },
    ],
  },
];

export const INCLUDED = [
  { icon: Plane, label: "Airport transfers" },
  { icon: Users, label: "Guides available in your language" },
  { icon: Car, label: "Transport during activities" },
  { icon: Shirt, label: "Winter clothing, when required" },
  { icon: Coffee, label: "Hot drinks & snacks" },
];

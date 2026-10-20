import { Plane, Car, Coffee, Shirt, Users } from "lucide-react";

export type BonusActivity = {
  id: string;
  title: string;
};

const CITY_TOUR: BonusActivity = {
  id: "bonus-city-tour",
  title: "City Center Tour",
};

const SANTA_VISIT: BonusActivity = {
  id: "bonus-santa-visit",
  title: "Meet Santa & the Snowman and Enjoy a Salmon Lunch Inside an Igloo",
};

const SNOWHOTEL_TOUR: BonusActivity = {
  id: "bonus-snowhotel-tour",
  title: "Arctic Snow Hotel Tour",
};

export type Package = {
  id: string;
  name: string;
  duration: string;
  pickCount: number;
  bonusActivities: BonusActivity[];
  popular?: boolean;
};


export const PACKAGES: Package[] = [
  {
    id: "classic",
    name: "Lapland Classic",
    duration: "4 DAYS",
    pickCount: 4,
    bonusActivities: [CITY_TOUR],
  },
  {
    id: "dream",
    name: "Lapland Dream",
    duration: "6 DAYS",
    pickCount: 6,
    bonusActivities: [CITY_TOUR, SANTA_VISIT],
  },
  {
    id: "ultimate",
    name: "Full Lapland Experience",
    duration: "7 DAYS",
    pickCount: 7,
    popular: true,
    bonusActivities: [CITY_TOUR, SANTA_VISIT, SNOWHOTEL_TOUR],
  },
];

export const INCLUDED = [
  { icon: Users, label: "Guides available in your language" },
  { icon: Car, label: "Transport during activities" },
  { icon: Shirt, label: "Winter clothing, when required" },
  { icon: Coffee, label: "Hot drinks & snacks" },
];

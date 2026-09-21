export interface FootballKitItem {
  id: string;
  name: string;
  frontImage: string;
  backImage: string;
}

export interface FrameOption {
  id: string;
  size: string;
  price: number;
}

export interface ApparelPriceConfig {
  tShirtPrice: number;
  labCoatPrice: number;
  frameOptions: FrameOption[];
}

export const apparelPricingConfig: ApparelPriceConfig = {
  tShirtPrice: 550,
  labCoatPrice: 450,
  frameOptions: [
    { id: "a5", size: "A5", price: 185 },
    { id: "a4", size: "A4", price: 230 },
    { id: "a3", size: "A3", price: 350 },
  ],
};

export const footballKitsData: FootballKitItem[] = [
  {
    id: "ac-milan",
    name: "AC Milan Kit",
    frontImage: "/football kits/ac 1.jpg",
    backImage: "/football kits/ac 2.jpg",
  },
  {
    id: "argentina",
    name: "Argentina Kit",
    frontImage: "/football kits/ar 1.jpg",
    backImage: "/football kits/ar 2.jpg",
  },
  {
    id: "bayern-munich",
    name: "Bayern Munich Kit",
    frontImage: "/football kits/bayern 1.jpg",
    backImage: "/football kits/bayern 2.jpg",
  },
  {
    id: "barcelona",
    name: "Barcelona Kit",
    frontImage: "/football kits/bc 1.jpg",
    backImage: "/football kits/bc 2.jpg",
  },
  {
    id: "chelsea",
    name: "Chelsea Kit",
    frontImage: "/football kits/ch 1.jpg",
    backImage: "/football kits/ch 2.jpg",
  },
  {
    id: "inter-milan",
    name: "Inter Milan Kit",
    frontImage: "/football kits/in 1.jpg",
    backImage: "/football kits/in 2.jpg",
  },
  {
    id: "juventus",
    name: "Juventus Kit",
    frontImage: "/football kits/jv 1.jpg",
    backImage: "/football kits/jv 2.jpg",
  },
  {
    id: "liverpool",
    name: "Liverpool Kit",
    frontImage: "/football kits/li 1.jpg",
    backImage: "/football kits/li 2.jpg",
  },
  {
    id: "man-city",
    name: "Manchester City Kit",
    frontImage: "/football kits/man 1.jpg",
    backImage: "/football kits/man 2.jpg",
  },
  {
    id: "man-united",
    name: "Manchester United Kit",
    frontImage: "/football kits/man 3.jpg",
    backImage: "/football kits/man 4.jpg",
  },
  {
    id: "psg",
    name: "PSG Kit",
    frontImage: "/football kits/psg 1.jpg",
    backImage: "/football kits/psg 2.jpg",
  },
  {
    id: "real-madrid",
    name: "Real Madrid Kit",
    frontImage: "/football kits/rm 1.jpg",
    backImage: "/football kits/rm 2.jpg",
  },
];
import { User, Auction } from "../types";
import { addDays, subDays } from "date-fns";

// Helper function to get random future date
const getRandomFutureDate = (days: number) => {
  return addDays(new Date(), days).toISOString();
};

// Helper function to get random past date
const getRandomPastDate = (days: number) => {
  return subDays(new Date(), days).toISOString();
};

// Mock user data
export const currentUser: User = {
  id: "1",
  name: "Denis Charles Ferreira do Carmo Junior",
  email: "denis@example.com",
  address: "Rua das Flores, 123 - São Paulo, SP",
  number: "91989359625",
  instagram: "denis_charl",
  preferences: {
    sizes: ["M", "G"],
    categories: ["Dresses", "Shirts", "Shoes"],
  },
  createdAuctions: ["auction1", "auction2"],
  participatedAuctions: ["auction3", "auction4"],
};

// Mock auctions data
export const auctions: Auction[] = [
  {
    id: "auction1",
    title: "Vintage Leather Jacket",
    description:
      "Beautiful vintage leather jacket in excellent condition. Perfect for fall.",
    images: [
      "https://images.pexels.com/photos/6770031/pexels-photo-6770031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    size: "M",
    category: "Jaquetas",
    startingPrice: 150,
    currentBid: 180,
    startDate: getRandomPastDate(2),
    endDate: getRandomFutureDate(3),
    producerId: "user1",
    bids: [
      {
        id: "bid1",
        auctionId: "auction1",
        userId: "user2",
        amount: 160,
        timestamp: getRandomPastDate(1),
      },
      {
        id: "bid2",
        auctionId: "auction1",
        userId: "user3",
        amount: 180,
        timestamp: new Date().toISOString(),
      },
    ],
    status: "active",
  },
  {
    id: "auction2",
    title: "Designer Silk Dress",
    description:
      "Elegant silk dress from a top designer. Perfect for special occasions.",
    images: [
      "https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    size: "P",

    category: "Vestidos",
    startingPrice: 300,
    currentBid: 350,
    startDate: getRandomPastDate(3),
    endDate: getRandomFutureDate(1),
    producerId: "user1",
    bids: [
      {
        id: "bid3",
        auctionId: "auction2",
        userId: "user4",
        amount: 320,
        timestamp: getRandomPastDate(2),
      },
      {
        id: "bid4",
        auctionId: "auction2",
        userId: "user5",
        amount: 350,
        timestamp: getRandomPastDate(1),
      },
    ],
    status: "active",
  },
  {
    id: "auction3",
    title: "Limited Edition Sneakers",
    description:
      "Rare limited edition sneakers, never worn. Original box included.",
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    size: "42",

    category: "Sapatos",
    startingPrice: 250,
    currentBid: 320,
    startDate: getRandomPastDate(5),
    endDate: getRandomFutureDate(2),
    producerId: "user6",
    bids: [
      {
        id: "bid5",
        auctionId: "auction3",
        userId: "user1",
        amount: 280,
        timestamp: getRandomPastDate(3),
      },
      {
        id: "bid6",
        auctionId: "auction3",
        userId: "user7",
        amount: 320,
        timestamp: getRandomPastDate(1),
      },
    ],
    status: "active",
  },
  {
    id: "auction4",
    title: "Cashmere Sweater",
    description:
      "Luxurious cashmere sweater in perfect condition. Very soft and warm.",
    images: [
      "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    size: "G",

    category: "Sweaters",
    startingPrice: 120,
    currentBid: 155,
    startDate: getRandomPastDate(4),
    endDate: getRandomFutureDate(4),
    producerId: "user8",
    bids: [
      {
        id: "bid7",
        auctionId: "auction4",
        userId: "user1",
        amount: 130,
        timestamp: getRandomPastDate(3),
      },
      {
        id: "bid8",
        auctionId: "auction4",
        userId: "user9",
        amount: 155,
        timestamp: getRandomPastDate(1),
      },
    ],
    status: "active",
  },
  {
    id: "auction5",
    title: "Vintage Denim Jacket",
    description:
      "Classic denim jacket from the 90s. Great condition with subtle distressing.",
    images: [
      "https://images.pexels.com/photos/1240342/pexels-photo-1240342.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/3649765/pexels-photo-3649765.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    size: "M",

    category: "Jaquetas",
    startingPrice: 90,
    currentBid: 110,
    startDate: getRandomPastDate(1),
    endDate: getRandomFutureDate(6),
    producerId: "user10",
    bids: [
      {
        id: "bid9",
        auctionId: "auction5",
        userId: "user11",
        amount: 100,
        timestamp: getRandomPastDate(1),
      },
      {
        id: "bid10",
        auctionId: "auction5",
        userId: "user12",
        amount: 110,
        timestamp: new Date().toISOString(),
      },
    ],
    status: "active",
  },
];

// Mock auction history
export const auctionHistory = [
  {
    id: "past1",
    title: "Wool Winter Coat",

    finalPrice: 420,
    date: getRandomPastDate(30),
    role: "seller",
    status: "vendido",
  },
  {
    id: "past2",
    title: "Summer Linen Dress",

    finalPrice: 85,
    date: getRandomPastDate(45),
    role: "buyer",
    status: "ganhou",
  },
  {
    id: "past3",
    title: "Designer Handbag",
    brand: "Louis Vuitton",
    finalPrice: 1200,
    date: getRandomPastDate(60),
    role: "buyer",
    status: "perdeu",
  },
];

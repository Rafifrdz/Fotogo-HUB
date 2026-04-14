import { PhotoSession, Booth, UserProfile, Reward } from './types';

export const MOCK_USER: UserProfile = {
  name: "Rafi Virdaus",
  email: "rafivirdaus234@gmail.com",
  photoUrl: "https://picsum.photos/seed/user/200/200",
  totalMemories: 42,
  boothsVisited: 12,
  points: 450,
  referralCode: "RAFI_PHOTO_2026",
  badges: ["Photobooth Explorer", "3 Booth in 1 Month", "Social Butterfly"]
};

export const MOCK_SESSIONS: PhotoSession[] = [
  {
    id: "1",
    boothName: "Braga Vibes",
    location: "Bandung",
    date: "2025-04-07T10:00:00Z",
    imageUrl: "https://picsum.photos/seed/photo1/600/800",
    pointsEarned: 50,
    tags: ["friends", "weekend"]
  },
  {
    id: "2",
    boothName: "Neo Tokyo",
    location: "Jakarta",
    date: "2026-02-07T14:30:00Z",
    imageUrl: "https://picsum.photos/seed/photo2/600/800",
    pointsEarned: 50,
    tags: ["solo", "aesthetic"]
  },
  {
    id: "3",
    boothName: "Vintage Corner",
    location: "Yogyakarta",
    date: "2026-03-20T11:15:00Z",
    imageUrl: "https://picsum.photos/seed/photo3/600/800",
    pointsEarned: 50,
    tags: ["couple", "retro"]
  }
];

export const MOCK_BOOTHS: Booth[] = [
  {
    id: "b1",
    name: "Braga Vibes",
    rating: 4.8,
    price: "Rp 35.000",
    imageUrl: "https://picsum.photos/seed/booth1/400/300",
    address: "Jl. Braga No. 123, Bandung",
    promo: "15% OFF Weekend",
    distance: "0.8 km"
  },
  {
    id: "b2",
    name: "Neo Tokyo",
    rating: 4.9,
    price: "Rp 45.000",
    imageUrl: "https://picsum.photos/seed/booth2/400/300",
    address: "Sudirman Central, Jakarta",
    promo: "Free Print for 1st Visit",
    distance: "2.5 km"
  },
  {
    id: "b3",
    name: "Pastel Dream",
    rating: 4.7,
    price: "Rp 30.000",
    imageUrl: "https://picsum.photos/seed/booth3/400/300",
    address: "Paris Van Java, Bandung",
    distance: "1.2 km"
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: "r1",
    title: "Free Extra Print",
    points: 100,
    description: "Get 1 extra physical print for your next session",
    icon: "Printer"
  },
  {
    id: "r2",
    title: "Free Photo Session",
    points: 250,
    description: "One free session at any partner booth",
    icon: "Camera"
  },
  {
    id: "r3",
    title: "Premium Frame Pack",
    points: 500,
    description: "Unlock all premium digital frames for 1 month",
    icon: "Frame"
  }
];

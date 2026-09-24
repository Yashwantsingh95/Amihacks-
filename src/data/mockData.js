// Mock Data for RescueFlow (Donor-Side)

export const initialStats = {
  activeDonations: 3,
  mealsRescued: 240,
  successfulPickups: 18,
  foodDivertedKg: 320,
  totalMealsAllTime: "1.2M",
  totalTonsAllTime: "430T",
  totalRescuesAllTime: "28K"
};

export const donorProfile = {
  name: "ABC Restaurant",
  tagline: "Authentic Indian Cuisine & Catering",
  address: "Block B, Connaught Place, New Delhi",
  contact: "+91 98112 34567",
  email: "partner@abcrestaurant.in",
  avatar: "A",
  rating: "4.9 ★ Partner",
  joined: "March 2026"
};

export const mockShelters = [
  {
    id: "shelter-1",
    name: "Shelter A",
    organization: "Asha Hope Foundation Shelter",
    distance: "2.1 km away",
    distanceValue: 2.1,
    travelTime: "7 min",
    capacity: "Capacity Available (80+ meals)",
    needLevel: "High Need",
    address: "Plot 14, Karol Bagh, New Delhi",
    contactPerson: "Sister Mary",
    foodPreferences: "Cooked vegetarian / Non-perishable"
  },
  {
    id: "shelter-2",
    name: "Seva Community Kitchen",
    organization: "Seva NGO Delhi",
    distance: "3.4 km away",
    distanceValue: 3.4,
    travelTime: "12 min",
    capacity: "Medium Capacity (45 meals)",
    needLevel: "Medium Need",
    address: "22 Pahar Ganj, New Delhi",
    contactPerson: "Harpreet Singh",
    foodPreferences: "All edible surplus"
  },
  {
    id: "shelter-3",
    name: "Jan Kalyan Children's Home",
    organization: "Child Welfare Trust",
    distance: "4.8 km away",
    distanceValue: 4.8,
    travelTime: "18 min",
    capacity: "High Capacity (120 meals)",
    needLevel: "Critical Need",
    address: "Civil Lines, New Delhi",
    contactPerson: "Dr. Anjali Verma",
    foodPreferences: "Freshly cooked warm meals"
  }
];

export const mockDriver = {
  name: "Rahul",
  fullName: "Rahul Sharma",
  rating: "4.95",
  totalRescues: 142,
  phone: "+91 98765 43210",
  vehicle: "Hero Electric Eco-Van (DL-01-EV-4289)",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
  statusText: "On the way to Shelter A",
  eta: "8 min away",
  distanceRemaining: "2.4 km"
};

export const initialDonations = [
  {
    id: "DON-1024",
    foodType: "Veg Biryani",
    quantity: 40,
    unit: "meals",
    pickupLocation: "ABC Restaurant, Delhi",
    safeUntil: "7:30 PM",
    remainingTime: "1h 42m remaining",
    category: "Vegetarian",
    status: "ON_THE_WAY", // POSTED -> MATCHED -> DRIVER_ASSIGNED -> PICKED_UP -> ON_THE_WAY -> DELIVERED
    statusLabel: "LIVE",
    donor: "ABC Restaurant",
    shelter: mockShelters[0],
    driver: mockDriver,
    notes: "Freshly prepared for banquet, kept in insulated containers.",
    postedAt: "5:15 PM",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "DON-1023",
    foodType: "Paneer Butter Masala & Roti",
    quantity: 30,
    unit: "meals",
    pickupLocation: "ABC Restaurant, Delhi",
    safeUntil: "8:00 PM",
    remainingTime: "2h 15m remaining",
    category: "Vegetarian",
    status: "MATCHED",
    statusLabel: "MATCHED",
    donor: "ABC Restaurant",
    shelter: mockShelters[1],
    driver: {
      name: "Amit",
      fullName: "Amit Kumar",
      rating: "4.88",
      phone: "+91 98123 77890",
      eta: "15 min away",
      distanceRemaining: "3.8 km",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80"
    },
    notes: "Separately packed breads and gravy.",
    postedAt: "4:30 PM",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "DON-1022",
    foodType: "Assorted Breads & Pastries",
    quantity: 25,
    unit: "boxes",
    pickupLocation: "ABC Bakery Counter, Delhi",
    safeUntil: "10:00 PM",
    remainingTime: "4h 10m remaining",
    category: "Bakery",
    status: "POSTED",
    statusLabel: "MATCHING",
    donor: "ABC Restaurant",
    shelter: null,
    driver: null,
    notes: "Baked this morning, packed in carton boxes.",
    postedAt: "5:40 PM",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "DON-1021",
    foodType: "Dal Makhani & Steamed Rice",
    quantity: 50,
    unit: "meals",
    pickupLocation: "ABC Restaurant, Delhi",
    safeUntil: "Delivered at 3:30 PM",
    remainingTime: "Delivered",
    category: "Vegetarian",
    status: "DELIVERED",
    statusLabel: "DELIVERED",
    donor: "ABC Restaurant",
    shelter: mockShelters[2],
    driver: mockDriver,
    notes: "Delivered warm to Jan Kalyan Children's Home.",
    postedAt: "1:45 PM",
    deliveredAt: "3:30 PM",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"
  }
];

export const weeklyImpactChart = [
  { day: "Mon", meals: 180, kg: 240 },
  { day: "Tue", meals: 210, kg: 280 },
  { day: "Wed", meals: 150, kg: 200 },
  { day: "Thu", meals: 320, kg: 410 },
  { day: "Fri", meals: 290, kg: 370 },
  { day: "Sat", meals: 420, kg: 530 },
  { day: "Sun", meals: 380, kg: 490 }
];

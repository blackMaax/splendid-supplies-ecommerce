import type { Product } from "../types"

export const products: Product[] = [
  // Tools, Equipment & Workwear
  {
    id: "1",
    name: "Professional Cordless Drill Set",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "High-performance cordless drill with 18V battery, multiple drill bits, and carrying case. Perfect for professional and DIY projects.",
    category: "Tools, Equipment & Workwear",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
  },
  {
    id: "2",
    name: "Heavy Duty Work Gloves",
    price: 12.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Durable leather work gloves with reinforced palms and fingers. Excellent grip and protection for construction work.",
    category: "Tools, Equipment & Workwear",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "3",
    name: "Professional Tool Belt",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Adjustable leather tool belt with multiple pockets and hammer loop. Essential for any tradesperson.",
    category: "Tools, Equipment & Workwear",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "4",
    name: "Circular Saw 185mm",
    price: 124.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Powerful 1400W circular saw with laser guide and dust extraction. Ideal for cutting wood, plastic, and metal.",
    category: "Tools, Equipment & Workwear",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
  },

  // Building Supplies
  {
    id: "5",
    name: "Premium Cement Mix 25kg",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "High-quality cement mix suitable for foundations, walls, and general construction. Fast-setting formula.",
    category: "Building Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "6",
    name: "Insulation Boards Pack",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Thermal insulation boards for walls and roofs. Excellent heat retention and energy efficiency.",
    category: "Building Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "7",
    name: "Plasterboard Sheets 2.4m x 1.2m",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Standard plasterboard sheets for interior walls and ceilings. Smooth finish ready for decoration.",
    category: "Building Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "8",
    name: "Aggregate Sand 25kg",
    price: 6.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Fine aggregate sand for concrete mixing and construction projects. Clean and well-graded.",
    category: "Building Supplies",
    images: ["/placeholder.svg?height=400&width=400"],
  },

  // Roofing Supplies
  {
    id: "9",
    name: "Clay Roof Tiles (Pack of 50)",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Traditional clay roof tiles with excellent weather resistance. Classic red finish.",
    category: "Roofing Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "10",
    name: "Roof Membrane Waterproof",
    price: 67.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "High-performance waterproof membrane for flat roofs. UV resistant and long-lasting.",
    category: "Roofing Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "11",
    name: "Guttering System Kit",
    price: 156.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Complete guttering system with brackets, joints, and downpipes. Easy installation.",
    category: "Roofing Supplies",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
  },
  {
    id: "12",
    name: "Roof Flashing Strips",
    price: 23.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Flexible roof flashing strips for sealing joints and preventing water ingress.",
    category: "Roofing Supplies",
    images: ["/placeholder.svg?height=400&width=400"],
  },

  // Cleaning Supplies
  {
    id: "13",
    name: "Industrial Pressure Washer",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "High-pressure washer for cleaning driveways, buildings, and equipment. 2000 PSI power.",
    category: "Cleaning Supplies",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
  },
  {
    id: "14",
    name: "Heavy Duty Cleaning Chemicals",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Professional-grade cleaning chemicals for tough stains and industrial cleaning.",
    category: "Cleaning Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "15",
    name: "Commercial Mop & Bucket Set",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Heavy-duty mop and bucket system with wringer. Perfect for large area cleaning.",
    category: "Cleaning Supplies",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
  {
    id: "16",
    name: "Safety Cleaning Kit",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Complete safety kit with gloves, goggles, and protective equipment for chemical cleaning.",
    category: "Cleaning Supplies",
    images: ["/placeholder.svg?height=400&width=400"],
  },
]

export const categories = [
  "All Products",
  "Tools, Equipment & Workwear",
  "Building Supplies",
  "Roofing Supplies",
  "Cleaning Supplies",
]

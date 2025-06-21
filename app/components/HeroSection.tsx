import { Truck, Headphones, RotateCcw } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="compact-hero-section">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        {/* Hero Content */}
        <div className="text-center mb-6">
          <h1 className="hero-headline mb-3">
            Your Trusted Partner for Quality Supplies
          </h1>
          <p className="hero-subheadline">
            From professional-grade tools to essential building materials, we've got everything you need to get the job done right.
          </p>
        </div>

        {/* Key Selling Points */}
        <div className="selling-points-container">
          <div className="selling-point">
            <div className="selling-point-icon">
              <Truck size={20} />
            </div>
                            <span className="selling-point-text">Free Shipping on Orders Over £50</span>
          </div>
          
          <div className="selling-point">
            <div className="selling-point-icon">
              <Headphones size={20} />
            </div>
            <span className="selling-point-text">Expert Customer Support</span>
          </div>
          
          <div className="selling-point">
            <div className="selling-point-icon">
              <RotateCcw size={20} />
            </div>
            <span className="selling-point-text">30-Day Easy Returns</span>
          </div>
        </div>
      </div>
    </section>
  )
} 
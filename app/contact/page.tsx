import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Phone, Mail, Clock, MapPin, MessageCircle } from 'lucide-react'
import { SEO_CONFIGS, BRAND_INFO } from '../../lib/seo'

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Splendid Supplies",
    "description": "Get in touch with Splendid Supplies for building materials, construction supplies and work tools. Professional customer service and expert advice.",
    "url": `https://${BRAND_INFO.domain}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "name": BRAND_INFO.name,
      "url": `https://${BRAND_INFO.domain}`,
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+44-207-101-3408",
          "contactType": "customer service",
          "email": "Sales@SplendidCasa.uk",
          "areaServed": "GB",
          "availableLanguage": "English",
          "hoursAvailable": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification", 
              "dayOfWeek": "Saturday",
              "opens": "10:00",
              "closes": "16:00"
            }
          ]
        }
      ]
    }
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{SEO_CONFIGS.contact.title}</title>
        <meta name="description" content={SEO_CONFIGS.contact.description} />
        <meta name="keywords" content={SEO_CONFIGS.contact.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={BRAND_INFO.name} />
        <link rel="canonical" href={`https://${BRAND_INFO.domain}/contact`} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SEO_CONFIGS.contact.title} />
        <meta property="og:description" content={SEO_CONFIGS.contact.description} />
        <meta property="og:url" content={`https://${BRAND_INFO.domain}/contact`} />
        <meta property="og:site_name" content={BRAND_INFO.name} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={SEO_CONFIGS.contact.title} />
        <meta name="twitter:description" content={SEO_CONFIGS.contact.description} />
        <meta name="twitter:site" content="@Splendidcasa" />
        
        {/* Contact Page Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(contactSchema)
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-white">
        <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Contact Us</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            We're here to help with any questions about your order or our products.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900">Phone Support</h3>
                  <p className="text-blue-800 text-lg font-medium">0207 101 3408</p>
                  <p className="text-blue-700 text-sm">Fastest way to get help</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <Mail className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900">Email Support</h3>
                  <p className="text-green-800 text-lg font-medium">Sales@SplendidCasa.uk</p>
                  <p className="text-green-700 text-sm">We respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Location</h3>
                  <p className="text-yellow-800">London, UK</p>
                  <p className="text-yellow-700 text-sm">Serving the UK nationwide</p>
                </div>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Business Hours</h2>
              
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Customer Service</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-red-600">Closed</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Orders placed outside business hours will be processed the next business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How can I track my order?</h3>
                <p className="text-gray-600">
                  You'll receive a tracking number via email once your order is dispatched. You can also contact us 
                  with your order number for updates.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What's your return policy?</h3>
                <p className="text-gray-600">
                  We offer a 30-day return policy on all items. Items must be unused and in original packaging. 
                  <a href="/returns" className="text-blue-600 hover:underline ml-1">View full policy</a>
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Do you offer installation services?</h3>
                <p className="text-gray-600">
                  We focus on supplying quality products. For installation, we can recommend trusted local contractors 
                  in your area. Contact us for recommendations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can I get a bulk discount?</h3>
                <p className="text-gray-600">
                  Yes! We offer competitive pricing for bulk orders and trade customers. Call us to discuss your 
                  requirements and get a custom quote.
                </p>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact */}
          <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Urgent Issues?</h3>
            <p className="text-red-800">
              For urgent delivery issues or damaged items, call us immediately at <strong>0207 101 3408</strong>. 
              We'll resolve urgent matters as quickly as possible.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
    </>
  )
} 
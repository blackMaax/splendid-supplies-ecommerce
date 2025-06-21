"use client"

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { HelpCircle, ChevronDown, Search, Package, Truck, CreditCard, RotateCcw, Shield, Clock } from 'lucide-react'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openSection, setOpenSection] = useState<string | null>(null)

  const faqCategories = [
    {
      id: 'orders',
      title: 'Orders & Payment',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'blue',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You\'ll need to provide your shipping information and payment details. Payment is processed securely through Stripe.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit and debit cards including Visa, Mastercard, and American Express. Payments are processed securely by Stripe, and we don\'t store your card details.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 2 hours of placing it by contacting us immediately. Once your order is being processed, changes may not be possible.'
        },
        {
          question: 'Do you offer bulk discounts?',
          answer: 'Yes! We offer competitive pricing for bulk orders and trade customers. Contact us at 0207 101 3408 or Sales@SplendidCasa.uk to discuss your requirements and get a custom quote.'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: <Truck className="w-5 h-5" />,
      color: 'green',
      questions: [
        {
          question: 'Do you offer free delivery?',
          answer: 'Yes! We offer free standard delivery to all UK mainland addresses with no minimum order value. Delivery typically takes 2-3 business days.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order is dispatched, you\'ll receive a tracking number via email. You can track your delivery progress through our courier\'s website or contact us for updates.'
        },
        {
          question: 'Do you deliver to Scotland and Northern Ireland?',
          answer: 'Yes, we deliver to all UK addresses including Scotland, Wales, and Northern Ireland. Scottish Highlands may take an additional 1-2 days. Please contact us for island deliveries.'
        },
        {
          question: 'What if I miss my delivery?',
          answer: 'If you miss your delivery, the courier will usually leave a card with instructions for redelivery or collection. You can also contact us to arrange a suitable redelivery time.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'orange',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy on all items. Products must be unused, in original packaging, with receipt or order confirmation. You pay return shipping unless the item is defective.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Contact us at Sales@SplendidCasa.uk with your order number to get a return authorization. We\'ll provide instructions and a returns address. Package items securely and include the authorization.'
        },
        {
          question: 'How long do refunds take?',
          answer: 'Once we receive your return, we\'ll inspect the items and process your refund within 5-7 business days. Refunds are issued to your original payment method.'
        },
        {
          question: 'What if I receive a damaged item?',
          answer: 'If you receive a damaged or defective item, contact us immediately. We\'ll arrange free return shipping and provide a full refund or replacement at no cost to you.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Products & Stock',
      icon: <Package className="w-5 h-5" />,
      color: 'purple',
      questions: [
        {
          question: 'Are product descriptions accurate?',
          answer: 'We strive for accuracy in all product descriptions and images. However, specifications may vary slightly, and colors may appear different on various screens. Contact us if you need specific details.'
        },

        {
          question: 'Can you recommend products for my project?',
          answer: 'Absolutely! Our team has extensive experience with tools and building supplies. Call us at 0207 101 3408 to discuss your project requirements and get expert recommendations.'
        },
        {
          question: 'Do you stock items not shown on the website?',
          answer: 'Yes, we may be able to source items not currently listed on our website. Contact us with your requirements, and we\'ll do our best to help you find what you need.'
        }
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId)
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find quick answers to common questions about our products and services.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">24h</div>
              <div className="text-sm text-blue-700">Email Response</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">Free</div>
              <div className="text-sm text-green-700">UK Delivery</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <RotateCcw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">30 Days</div>
              <div className="text-sm text-orange-700">Return Policy</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">Secure</div>
              <div className="text-sm text-purple-700">Payments</div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(category.id)}
                  className={`w-full p-6 text-left transition-colors duration-200 ${getColorClasses(category.color)} hover:opacity-80`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {category.icon}
                      <h2 className="text-xl font-semibold">{category.title}</h2>
                      <span className="text-sm opacity-75">({category.questions.length} questions)</span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-200 ${
                        openSection === category.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                {openSection === category.id && (
                  <div className="border-t border-gray-200">
                    {category.questions.map((qa, index) => (
                      <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
                        <h3 className="font-semibold text-gray-800 mb-3">{qa.question}</h3>
                        <p className="text-gray-600 leading-relaxed">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching with different keywords or browse all categories above.</p>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our customer service team is here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm mb-2">Mon-Fri: 9AM-6PM | Sat: 10AM-4PM</p>
                <p className="text-lg font-medium text-blue-600">0207 101 3408</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-green-600 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm mb-2">We respond within 24 hours</p>
                <p className="text-lg font-medium text-green-600">Sales@SplendidCasa.uk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 
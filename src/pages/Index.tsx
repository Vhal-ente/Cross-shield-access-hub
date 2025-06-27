import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Heart, Globe, Shield, Zap, CheckCircle, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  Revolutionizing Healthcare Access
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Empowering Access to{" "}
                  <span className="text-green-300">Medications</span> Across Africa
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Cross Shield connects community pharmacies, suppliers, and patients to ensure reliable access to essential medicines—even in hard-to-reach areas.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                  Request Medications
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop"
                  alt="Healthcare professional"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
              <p className="text-gray-600">Medication Orders Fulfilled</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">300+</div>
              <p className="text-gray-600">Pharmacies in Network</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
              <p className="text-gray-600">Nigerian States Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded in response to the COVID-19 lockdown, Cross Shield Health Consulting was born out of the urgent need to improve access to medications in Nigeria. By leveraging a digital network of pharmacies and suppliers, we streamlined the medicine supply chain to respond faster, smarter, and more equitably.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
                    <p>To revolutionize health access in Africa by optimizing pharmaceutical supply chains with transparency, speed, and reach.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
                    <p>To become a Pan-African health logistics behemoth, ensuring no community is left behind.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Core Values</h3>
              <div className="grid gap-4">
                {[
                  { icon: Shield, title: "Reliability", desc: "Dependable service you can trust" },
                  { icon: Heart, title: "Integrity", desc: "Transparent and ethical practices" },
                  { icon: Zap, title: "Innovation", desc: "Cutting-edge solutions for health access" },
                  { icon: Globe, title: "Accessibility", desc: "Reaching every community" },
                  { icon: Users, title: "Collaboration", desc: "Building stronger partnerships" }
                ].map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <value.icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">{value.title}</div>
                      <div className="text-sm text-gray-600">{value.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              We serve different stakeholders in the healthcare ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "For Patients",
                description: "Request medications through our verified partner pharmacies with home delivery or pickup options",
                features: ["Verified Partners", "Home Delivery", "Quality Assurance"]
              },
              {
                title: "For Pharmacies",
                description: "Restock faster, smarter, and more reliably with access to quality medications and exclusive pricing",
                features: ["Fast Restocking", "Quality Medications", "Exclusive Pricing"]
              },
              {
                title: "For Suppliers",
                description: "Expand your reach with access to vetted pharmacy clients and real-time demand insights",
                features: ["Vetted Clients", "Demand Insights", "Expanded Reach"]
              },
              {
                title: "For NGOs",
                description: "Partner with us for last-mile distribution and leverage our network for hard-to-reach communities",
                features: ["Last-Mile Distribution", "Community Access", "Partnership Support"]
              },
              {
                title: "For Government",
                description: "Collaborate on public health programs with our established distribution network",
                features: ["Program Support", "Network Access", "Distribution Excellence"]
              },
              {
                title: "For Diaspora",
                description: "Support your loved ones by directly funding or coordinating medication delivery with accountability",
                features: ["Direct Funding", "Verified Network", "Family Support"]
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Partners Say
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                <p className="text-lg text-gray-600 mb-6">
                  "Cross Shield helped us restock critical meds during the lockdown—lifesaver! Their network is reliable and their service is exceptional."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Pharmacy Partner</div>
                    <div className="text-sm text-gray-600">Lagos, Nigeria</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-8">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-green-600 mb-4" />
                <p className="text-lg text-gray-600 mb-6">
                  "Reliable, transparent, and quick. Exactly what Nigeria's health sector needs. Cross Shield is making a real difference."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Health NGO Official</div>
                    <div className="text-sm text-gray-600">Public Health Sector</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Be part of revolutionizing healthcare access across Africa. Whether you're a pharmacy, supplier, or support organization, we have a place for you.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Pharmacies</h3>
                <p className="text-gray-600 mb-6">Get better margins and faster restocking. Join the Cross Shield network.</p>
                <Link to="/dashboard">
                  <Button className="w-full">Join Now</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Suppliers</h3>
                <p className="text-gray-600 mb-6">Bring your products closer to the people who need them.</p>
                <Link to="/dashboard">
                  <Button className="w-full">Partner With Us</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Diaspora</h3>
                <p className="text-gray-600 mb-6">Take care of your family's medication needs—securely and transparently.</p>
                <Link to="/dashboard">
                  <Button className="w-full">Support Loved Ones</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Cross Shield</h3>
              <p className="text-gray-400">
                Revolutionizing healthcare access across Africa through innovative pharmaceutical distribution.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Services</div>
                <div>Contact</div>
                <div>Blog</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <div>For Pharmacies</div>
                <div>For Suppliers</div>
                <div>For Patients</div>
                <div>For NGOs</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div>info@crossshieldhealth.com</div>
                <div>+234-XXX-XXXX-XXX</div>
                <div>WhatsApp Support</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cross Shield Health Consulting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

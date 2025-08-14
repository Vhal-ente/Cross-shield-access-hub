import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import LegalTabs from "@/components/legal-tabs";
import CrossShield from "@/assets/cross shield 1.png";
import Navbar from "@/components/Navbar/index";

const PrivacySection = () => {
  return (
    <>
      {/* <div className="w-full">
    {/* Navbar */}
      {/* <Navbar
      logo={CrossShield}
    /> */}
      {/* </div> */}

      <section className="w-full md:py-2 bg-[#F9FAFC] text-black">
        {/* Tabs Navigation */}
        <LegalTabs />
        <Tabs defaultValue="privacy" className="w-full max-w-6xl mx-auto">
          {/* Privacy Policy Content */}
          <TabsContent value="privacy" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Privacy Policy
              </h1>
              <p className="text-gray-500 text-sm md:text-base mb-1">
                Effective Date: 4th of August, 2025
                <br />
                Last Updated: 4th of August, 2025
              </p>
              <p className="text-gray-600 text-sm md:text-base font-semibold">
                Company: Cross Shield Health Consulting,
                <br />
               Lagos State, Nigeria
              </p>
            </div>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
              {/* 1. Information We Collect */}
              <div>
                <h2 className="font-semibold mb-1">
                  1. Information We Collect
                </h2>
                <p className="text-sm md:text-base text-gray-800">
                  We may collect the following types of personal data:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800">
                  <li>Name, phone number, email address</li>
                  <li>Delivery address</li>
                  <li>Medical product inquiries</li>
                  <li>
                    {" "}
                    Payment confirmation receipts (no banking card details)
                  </li>
                  <li>
                    {" "}
                    Chat transcripts from WhatsApp, Facebook Messenger, or
                    website contact forms
                  </li>
                </ul>
              </div>

              {/* 2. How We Use Your Information */}
              <div>
                <h2 className="font-semibold mb-1">
                  2. How We Use Your Information
                </h2>
                <p className="text-sm md:text-base text-gray-800">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800">
                  <li>Process medication requests</li>
                  <li> Source and compare prices</li>
                  <li>Generate and send invoices</li>
                  <li> Coordinate delivery</li>
                  <li> Provide customer service</li>
                  <li>
                    {" "}
                    Send updates or promotional messages (once you accept these
                    terms by using our <br /> services).
                  </li>
                </ul>
              </div>

              {/* 3. Sharing of Information */}
              <div>
                <h2 className="font-semibold mb-1">
                  3. Sharing of Information
                </h2>
                <p className="text-sm md:text-base text-gray-800">
                  We only share your data with:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800">
                  <li>
                    Licensed pharmaceutical suppliers and distributors (limited
                    to only details of the <br /> health products being requested for,
                    not personal identifiable details)
                  </li>
                  <li>
                    Third-party logistics and delivery partners (contacts and
                    delivery address)
                  </li>
                  <li>
                    {" "}
                    Payment processors (limited to necessary transaction
                    details)
                  </li>
                </ul>
                <p className="mt-2 text-sm md:text-base text-gray-800">
                  We do not sell or rent your data to third parties.
                </p>
              </div>

              {/* 4. Data Security */}
              <div>
                <h2 className="font-semibold mb-1">4. Data Security </h2>
                <p className="text-sm md:text-base text-gray-800">
                  We implement standard security protocols to protect your
                  personal information,
                  <br />
                  including:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800">
                  <li>Access control to internal records</li>
                  <li> Regular password updates</li>
                  <li> Secure cloud storage of order records</li>
                </ul>
                <p className="mt-2 text-sm md:text-base text-gray-800">
                  However, no system is 100% secure, and we cannot guarantee
                  absolute data protection.
                </p>
              </div>

              {/* 5. Your Rights */}
              <div>
                <h2 className="font-semibold mb-1">5. Your Rights</h2>
                <p className="text-sm md:text-base text-gray-800">You may:</p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800 space-y-1">
                  <li>
                    {" "}
                    Request a copy of the personal data we hold about you
                  </li>
                  <li>Request corrections or deletions of your data</li>
                  <li>Withdraw consent from marketing communications</li>
                </ul>
                <p className="mt-2 text-sm md:text-base text-gray-800">
                  Send any such requests to crossshieldhc@gmail.com
                </p>
              </div>

              {/* 6.  Cookies and Analytics */}
              <div>
                <h2 className="font-semibold mb-1">6. Cookies and Analytics</h2>
                <p className="text-sm md:text-base text-gray-800">
                  If we use a website or mobile platform:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800 space-y-1">
                  <li>
                    We may use cookies for performance analytics and user
                    experience enhancement.
                  </li>
                  <li>You may disable cookies in your browser settings.</li>
                </ul>
              </div>

              {/* 7. Third-Party Links */}
              <div>
                <h2 className="font-semibold mb-1">7. Third-Party Links</h2>
                <p className="text-sm md:text-base text-gray-800">
                  Our services may contain links to third-party sites (e.g.,
                  payment platforms). We are not <br /> responsible for their privacy
                  practices. Please review their policies before submitting <br />
                  information
                </p>
              </div>

              {/* 8. Children's Privacy */}
              <div>
                <h2 className="font-semibold mb-1">8. Children's Privacy</h2>
                <p className="text-sm md:text-base text-gray-800">
                Our services are not intended for children under the age of 13. We do not knowingly 
                <br />
                collect personal data from minors.
                </p>
              </div>

              {/* 9.  Changes to This Policy */}
              <div>
                <h2 className="font-semibold mb-1">9.  Changes to This Policy</h2>
                <p className="text-sm md:text-base text-gray-800">
                We may update this Privacy Policy as needed. Updates will be communicated through <br /> our platform or via email.
                </p>
              </div>

              {/* 10. Contact Us */}
              <div>
                <h2 className="font-semibold mb-1">10. Contact Us</h2>
                <p className="text-sm md:text-base text-gray-800 mb-2">
                For privacy-related concerns:
                  <br />
                  📧 crossshieldhc@gmail.com
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Optional: Terms of Use Placeholder */}
          <TabsContent
            value="terms"
            className="w-full max-w-4xl mx-auto text-center"
          >
            <p className="text-gray-600 text-base">
              Terms of Use content goes here...
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default PrivacySection;

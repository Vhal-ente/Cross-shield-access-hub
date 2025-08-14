import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import LegalTabs from "@/components/legal-tabs";
// import CrossShield from '@/assets/cross shield 1.png';
// import Navbar from "@/components/Navbar/index";

const TermsSection = () => {
  return (
    <>
      <section className="w-full md:py-2 bg-[#F9FAFC] text-black">
        {/* Tabs Navigation */}
        <LegalTabs />
        <Tabs defaultValue="terms" className="w-full max-w-6xl mx-auto">
          {/* Terms of Use Content */}
          <TabsContent value="terms" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Read Our Terms and Conditions
              </h1>
              <p className="text-gray-500 text-sm md:text-base mb-1">
                Effective Date: 4th of August, 2025
                <br />
                Last Updated: 4th of August, 2025
              </p>
              <p className="text-gray-600 text-sm md:text-base font-semibold">
                Company: Cross Shield Health Consulting, 
                <br />
                Lagos State,
                Nigeria
              </p>
            </div>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
              {/* 1. Introduction */}
              <div>
                <h2 className="font-semibold mb-1">1. Introduction</h2>
                <p className="text-sm md:text-base text-gray-800">
                  Welcome to Cross Shield Health Consulting ("Cross Shield",
                  "we", "our", or "us"). These Terms and Conditions ("Terms")
                  govern your use of our services, including our website, mobile
                  platforms, WhatsApp communications, email correspondence, and
                  any other features or offerings we provide (collectively, the
                  “Services”).
                </p>
                <p className="mt-6 text-sm md:text-base text-gray-800">
                  By accessing or using our Services, you agree to be bound by
                  these Terms. If you do not agree, please do not use our
                  Services.{" "}
                </p>
              </div>

              {/* 2. Our Services */}
              <div>
                <h2 className="font-semibold mb-1">2. Our Services</h2>
                <p className="text-sm md:text-base text-gray-800 mb-2">
                  Cross Shield facilitates the sourcing, pricing, and delivery
                  of medications by liaising with a network of licensed
                  pharmacists, wholesale suppliers, and medical representatives.
                  We provide price comparisons, generate invoices, confirm
                  payments, and coordinate delivery to the customer.
                </p>
                {/* <p className="mt-6 text-sm md:text-base text-gray-800">
                We do not operate as a pharmacy or dispense medications directly.{" "}
                </p> */}
              </div>

              {/* 3. User Eligibility */}
              <div>
                <h2 className="font-semibold mb-1">3. User Eligibility</h2>
                <p className="text-sm md:text-base text-gray-800 mb-2">
                You must be at least 18 years of age or the legal age of majority in your location to use our Services. You agree to provide accurate and complete information during interactions and to update us as necessary.
                </p>
              </div>

              {/* 4. Orders and Payment */}
              <div>
                <h2 className="font-semibold mb-1">4. Orders and Payment</h2>
                <p className="text-sm md:text-base text-gray-800">
                Orders are processed once payment has been confirmed. Service charges may apply and are included in the total amount communicated to the client. All payments are final. Refunds are handled only in cases of non-fulfilment, subject to investigation.
                </p>
              </div>

              {/* 5.  Delivery */}
              <div>
                <h2 className="font-semibold mb-1">
                  5.  Delivery
                </h2>
                <p className="text-sm md:text-base text-gray-800 mb-2">
                Delivery timelines are estimates and depend on third-party logistics partners. Cross Shield is not liable for delays caused by these providers but will assist in dispute resolution.
                </p>
              </div>

              {/* 6. Accuracy of Information */}
              <div>
                <h2 className="font-semibold mb-1">
                  6. Accuracy of Information
                </h2>
                <p className="text-sm md:text-base text-gray-800 mb-2">
                We strive to provide accurate information on medications and pricing. However, we do not guarantee the accuracy or completeness of information from third-party suppliers. Users are advised to consult licensed health professionals before using any medication sourced through our network.
                </p>
              </div>

              {/* 7.  Limitation of Liability */}
              <div>
                <h2 className="font-semibold mb-1">7.  Limitation of Liability</h2>
                <p className="text-sm md:text-base text-gray-800 mb-2">
                To the fullest extent permitted by law, Cross Shield disclaims any liability for:
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-800 space-y-1">
                  <li>
                  Adverse drug reactions.
                  </li>
                  <li>
                  Delays or errors by third-party suppliers or dispatch services.
                  </li>
                  <li>
                  Misuse of our platform or any medications purchased through us.
                  </li>
                </ul>
              </div>

              {/* 8. Intellectual Property*/}
              <div>
                <h2 className="font-semibold mb-1">
                  8. Intellectual Property
                </h2>
                <p className="text-sm md:text-base text-gray-800">
                All content, including logos, text, images, and software used in our Services, is the property of Cross Shield or its partners and is protected by intellectual property laws.
                </p>
              </div>

              {/* 9. Suspension or Termination */}
              <div>
                <h2 className="font-semibold mb-1">9. Suspension or Termination </h2>
                <p className="text-sm md:text-base text-gray-800">
                We reserve the right to suspend or terminate access to our Services for any user who violates these Terms or engages in suspicious, abusive, or fraudulent behavior.
                </p>
              </div>

              {/* 10. Governing Law */}
              <div>
                <h2 className="font-semibold mb-1">
                  10. Governing Law
                </h2>
                <p className="text-sm md:text-base text-gray-800">
                These Terms shall be governed by and construed in accordance with the laws of Nigeria.
                </p>
              </div>

              {/* 11.  Changes to Terms */}
              <div>
              <h2 className="font-semibold mb-1">11. Changes to Terms </h2>
              <p className="text-sm md:text-base text-gray-800">
              We may update these Terms from time to time. You will be notified of any material changes, and your continued use of the Services constitutes acceptance of the updated Terms.
                </p>
              </div>

              {/* 12. Contact */}
              <div>
                <h2 className="font-semibold mb-1">12. Contact Us </h2>
                <p className="text-sm md:text-base text-gray-800">
                For questions or concerns, contact:
                <br />
                📧 crossshieldhc@gmail.com
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default TermsSection;

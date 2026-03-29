'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ContactSection() {
  const [contactInfo, setContactInfo] = useState({
    email: "info@gsmozecollege.edu.in",
    phone1: "+91 20 2661 2345",
    phone2: "+91 98811 00000",
    addressLine1: "G.S. Moze College Campus",
    addressLine2: "Wadia Road, Yerawada",
    addressLine3: "Pune, Maharashtra - 411006",
    businessHours: "Monday - Saturday: 9AM - 5PM",
     googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d121059.0436006745!2d73.78056580922438!3d18.5247656247654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0603f909191%3A0x6b4fb24e4d6d84f1!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1711690000000!5m2!1sen!2sin"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch("/api/contact_info");
        const data = await response.json();
        if (data.contactInfo) {
          setContactInfo(data.contactInfo);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <section className="py-20 bg-white" id="contacts">
      <div className="container mx-auto px-6 lg:px-20">

        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Get in <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Our team is ready to assist you. Feel free to contact us anytime.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#f5f7ff] rounded-3xl shadow-sm p-10 flex flex-col lg:flex-row gap-10">

          {/* Left - Form */}
          <div className="lg:w-2/3">
            <form className="space-y-10">

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                <div>
                  <label className="text-gray-700 font-medium block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    suppressHydrationWarning
                    className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">
                    Institute Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 bg-transparent"
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-gray-700 font-medium block mb-2">
                  Your Message *
                </label>
                <textarea
                  rows="5"
                  required
                  suppressHydrationWarning
                  className="w-full rounded-2xl p-4 border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-white"
                ></textarea>
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-8 py-2.5 rounded-lg shadow"
                >
                  Submit
                </button>
              </div>

            </form>
          </div>

          {/* Right - Contact Info */}
          <div className="lg:w-1/3 space-y-8 bg-white p-8 rounded-2xl shadow-sm">

            <div className="flex items-start gap-4">
              <Mail className="text-blue-600 w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Email Us</h3>
                <p className="text-gray-600 text-[15px]">{contactInfo.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-blue-600 w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600 text-[15px]">{contactInfo.phone1}</p>
                {contactInfo.phone2 && <p className="text-gray-600 text-[15px]">{contactInfo.phone2}</p>}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-blue-600 w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Visit Us</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {contactInfo.addressLine1}<br />
                  {contactInfo.addressLine2 && <>{contactInfo.addressLine2}<br /></>}
                  {contactInfo.addressLine3}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-blue-600 w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
                <p className="text-gray-600 text-[15px]">
                  {contactInfo.businessHours}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* MAP */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-sm">
          <iframe
            src={contactInfo.googleMapUrl}
            width="100%"
            height="320"
            className="w-full border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </section>
  );
}

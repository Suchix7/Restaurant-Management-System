import React from "react";

const VisitUs = () => {
  return (
    <div>
      {/* Visit Us Section */}
      <section className="bg-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold mb-8">Visit Us</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Address</h4>
                <p className="text-sm">
                  165 Tanjong Pagar Road, Singapore 088539
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">All Enquiries</h4>
                <p className="text-sm">hello@jiggerandpony.com</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="text-sm">+65 6223 9101</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Opening Hours</h4>
                <div className="text-sm space-y-1">
                  <p>Monday - Thursday: 5pm - 1am</p>
                  <p>Friday - Saturday: 5pm - 2am</p>
                  <p>Sunday: 5pm - 12am</p>
                  <p>Happy Hour: 5pm - 7pm</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8">
              Follow us @jiggerandponysg
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/placeholder.svg?height=150&width=150"
                alt="Social 1"
                className="w-full h-32 object-cover rounded"
              />
              <img
                src="/placeholder.svg?height=150&width=150"
                alt="Social 2"
                className="w-full h-32 object-cover rounded"
              />
              <img
                src="/placeholder.svg?height=150&width=150"
                alt="Social 3"
                className="w-full h-32 object-cover rounded"
              />
              <img
                src="/placeholder.svg?height=150&width=150"
                alt="Social 4"
                className="w-full h-32 object-cover rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitUs;

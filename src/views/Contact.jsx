const Contact = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-16 bg-white w-full px-6 md:px-10 lg:px-16">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-gray-600">
            Have questions or need assistance? We're here to help.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <span className="text-2xl">✉️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Email Us
                </h2>
                <p className="text-gray-600 mb-4">
                  Send us an email and we'll get back to you as soon as possible.
                </p>
                <a
                  href="mailto:contact@mapple.com"
                  className="inline-block text-lg font-medium text-black hover:text-gray-700 transition-colors duration-200 underline"
                >
                  contact@mapple.com
                </a>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
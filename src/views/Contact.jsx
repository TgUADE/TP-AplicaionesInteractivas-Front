const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
        <div className="space-y-4">
          <p className="text-gray-600 text-lg">Contactanos en:</p>
          <a
            href="mailto:contacto@gmail.com"
            className="text-primary-500 font-semibold text-xl hover:text-primary-600 transition-colors duration-300"
          >
            contacto@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

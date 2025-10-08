import { Link } from "react-router-dom";

const Footer = () => {
  return (
    
    <footer className="bg-black text-gray-300 py-16 px-10 w-full lg:py-12 lg:px-6 md:py-10 md:px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-16 xl:gap-24 lg:gap-12 md:gap-8">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-mapple-black.png" 
            alt="Mapple Logo" 
            className="w-12 h-12 object-contain"
          />
          <span className="text-3xl font-bold text-white">Mapple</span>
        </div>

        <div className="flex flex-col">
          <h4 className="text-xl font-semibold mb-6 text-white">
            Services
          </h4>
            <ul className="list-none m-0 p-0 space-y-4">
              <li>
                <Link
                  to="/bonus"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Bonus program
                </Link>
              </li>
              <li>
                <Link
                  to="/gift-cards"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Gift cards
                </Link>
              </li>
              <li>
                <Link
                  to="/credit"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Credit and payment
                </Link>
              </li>
              <li>
                <Link
                  to="/contracts"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Service contracts
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Non-cash account
                </Link>
              </li>
              <li>
                <Link
                  to="/payment"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Payment
                </Link>
              </li>
            </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="text-xl font-semibold mb-6 text-white">
            Assistance to the buyer
          </h4>
            <ul className="list-none m-0 p-0 space-y-4">
              <li>
                <Link
                  to="/find-order"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Find an order
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Terms of delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/exchange"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Exchange and return of goods
                </Link>
              </li>
              <li>
                <Link
                  to="/guarantee"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Guarantee
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Frequently asked questions
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 no-underline text-base transition-colors duration-300 hover:text-white"
                >
                  Terms of use of the site
                </Link>
              </li>
            </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
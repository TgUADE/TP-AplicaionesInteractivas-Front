
const HeroSection = ({ onClick }) => {
    
    return (
        <section
            className="text-white flex items-center justify-center w-full h-[760px] relative overflow-hidden"
            style={{
                background:
                "radial-gradient(47.03% 302.22% at 50.75% 56.73%, #F66F31 0%, #121212 100%)",
            }}
            >
            <div className="flex items-center justify-between w-full max-w-7xl px-16 gap-16">
                <div className="flex-1 pr-8">
                <h1 className="text-8xl font-thin m-0 mb-6 leading-none text-white whitespace-nowrap">
                    iPhone 17 <span className="font-bold">Pro</span>
                </h1>
                <p className="text-lg m-0 mb-8 opacity-90 leading-relaxed font-light max-w-lg">
                    Created to change everything for the better. For everyone.
                </p>
                <button 
                onClick={() => onClick("250bbd60-28b4-4328-8e03-2aed5a8b7e0a")}
                
                className="bg-transparent text-white border border-white px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-white hover:text-orange-500">
                    Buy Now
                </button>
                </div>
                <div className="flex-1 flex justify-end items-end h-full relative">
                <img
                    src="/apple-iphone-17-pro-max.png"
                    alt="iPhone 17 Pro"
                    className="h-[700px] w-auto object-contain object-bottom"
                    style={{
                    transform: "translateY(50px) scale(1.3)",
                    maxHeight: "none",
                    }}
                />
                </div>
            </div>
            </section>
    );
}
export default HeroSection;
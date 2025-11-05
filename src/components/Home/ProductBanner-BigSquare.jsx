const ProductBannerBigSquare = ({ onClick }) => {
    return (
        <div
        className="flex flex-row items-center bg-[#EDEDED] w-[720px] h-[637px] flex-none order-1 flex-grow relative overflow-hidden"
        style={{ padding: "44px 20px 44px 120px" }}
        >
          {/* Content - Left Side */}
        <div className="flex flex-col items-start justify-center gap-4 w-[280px] max-w-[280px] flex-none z-20 relative bg-[#EDEDED] pr-4 2xl:w-[300px] 2xl:max-w-[300px] xl:w-[260px] xl:max-w-[260px] lg:w-[220px] lg:max-w-[220px] md:w-[180px] md:max-w-[180px] sm:w-[160px] sm:max-w-[160px] xl:gap-3 lg:gap-3 md:gap-2 sm:gap-2">
            {/* Title + Text */}
            <div className="flex flex-col items-start gap-3 w-full xl:gap-2 lg:gap-2 md:gap-2 sm:gap-1">
            <h3 className="font-thin text-[72px] leading-[64px] text-black 2xl:text-[72px] xl:text-[60px] lg:text-[52px] md:text-[42px] sm:text-[36px] 2xl:leading-[64px] xl:leading-[56px] lg:leading-[48px] md:leading-[40px] sm:leading-[36px]">
                Macbook Air
            </h3>
            <p className="font-medium text-base leading-6 text-[#919191] lg:text-sm md:text-xs sm:text-[10px] lg:leading-5 md:leading-4 sm:leading-3">
                The new 15‑inch MacBook Air makes room for more of what you love
                with a spacious Liquid Retina display.
            </p>
            </div>

            {/* Button */}
            <button
            onClick={() => onClick("d442976f-7032-42d5-948d-3200298d89af")}
            className="bg-white text-black border border-white px-10 py-4 rounded-md text-base font-medium cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-black lg:px-8 lg:py-3 lg:text-sm md:px-6 md:py-2 md:text-xs sm:px-4 sm:py-2 sm:text-[10px]"
            style={{ padding: "16px 32px" }}
            >
            Buy Now
            </button>
        </div>

          {/*Image */}
        <div className="absolute right-[-250px] bottom-0 w-[900px] h-[600px] z-0 xl:right-[-280px] xl:w-[800px] xl:h-[550px] lg:right-[-300px] lg:w-[700px] lg:h-[500px] md:right-[-320px] md:w-[600px] md:h-[450px] sm:right-[-340px] sm:w-[500px] sm:h-[400px]">
            <img
            src="/mba-13inch-15inch.png"
            alt="MacBook Air"
            className="w-full h-full object-contain"
            style={{
            transform: "scale(1.2)",
            objectPosition: "bottom right",
            }}
            />
        </div>
        </div>
    );
};

export default ProductBannerBigSquare;
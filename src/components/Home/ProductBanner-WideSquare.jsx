const ProductBannerWideSquare = ({ onClick }) => {
    return (
    <div 
        onClick={() => onClick("ddba688a-9891-40a4-a449-b5f6266eeb70")} 
        className="cursor-pointer flex flex-row items-center justify-between bg-white w-full h-[328px] flex-none order-0 relative px-8 lg:px-4 md:px-2"
        >
        {/*Image */}
        <div className="flex-1 flex justify-center items-center h-full lg:flex-[0.8] md:flex-[0.7]">
            <div
            className="h-[285px] w-[270px] flex-none z-0 xl:h-[240px] xl:w-[230px] lg:h-[200px] lg:w-[190px] md:h-[160px] md:w-[150px] sm:h-[130px] sm:w-[120px]"
            style={{
                backgroundImage:
                "url(/13d77c80-200b-4f73-93c9-4b78165a1806.webp)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                filter: "drop-shadow(0px 20px 3px rgba(0, 0, 0, 0.13))",
                transform: "rotate(10deg)",
            }}
            />
        </div>

        {/* Title + Text */}
        <div className="flex-1 flex flex-col justify-center items-center gap-4 h-full z-10 px-4 lg:px-2 md:px-1">
            <h3 className="font-medium text-[56px] leading-[52px] text-black text-center 2xl:text-[56px] xl:text-[48px] lg:text-[40px] md:text-[32px] sm:text-[28px] 2xl:leading-[52px] xl:leading-[46px] lg:leading-[40px] md:leading-[32px] sm:leading-[28px]">
            AirPods <span className="font-bold">Pro</span>
            </h3>
            <p className="font-medium text-base leading-6 text-[#2D2B2B] text-center lg:text-sm md:text-xs sm:text-[10px]">
            Listen like a Pro
            </p>
        </div>
        </div>
    );

};

export default ProductBannerWideSquare;

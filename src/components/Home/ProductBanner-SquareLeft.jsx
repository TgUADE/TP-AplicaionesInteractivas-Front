const ProductBannerSquareLeft = ({ onClick }) => {
    return (
        <div 
        onClick={() => onClick("cb82397b-7313-4e0f-b7a6-2c3d6695cb16")} 
        className="cursor-pointer flex flex-row justify-center items-center bg-[#EDEDED] w-1/2 h-[309px] flex-none order-0 self-stretch flex-grow relative overflow-hidden">
            {/*Image */}
            <div
            className="absolute h-[280px] w-[180px] left-[-80px] top-[15px] flex-none order-1 flex-grow-0 z-10 xl:h-[240px] xl:w-[160px] xl:left-[-70px] lg:h-[200px] lg:w-[140px] lg:left-[-60px] md:h-[160px] md:w-[120px] md:left-[-50px] sm:h-[130px] sm:w-[100px] sm:left-[-40px]"
            style={{
                backgroundImage: "url(/Airpods_Max_single.webp)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
            }}
            />

            {/* Title + Text */}
            <div className="flex flex-col justify-center items-center p-0 gap-2 flex-none order-0 flex-grow-0 z-0 ml-16 mr-8 xl:ml-12 lg:ml-10 md:ml-8 sm:ml-6 xl:mr-6 lg:mr-4 md:mr-3 sm:mr-2">
            <h3 className="font-light text-[36px] leading-9 text-black text-center xl:text-[32px] lg:text-[28px] md:text-[24px] sm:text-[20px] xl:leading-8 lg:leading-7 md:leading-6 sm:leading-5">
                AirPods <span>Max</span>
            </h3>
            <p className="font-medium text-base leading-5 text-[#919191] text-center max-w-[160px] lg:text-sm md:text-xs sm:text-[10px] lg:max-w-[140px] md:max-w-[120px] sm:max-w-[100px]">
                Computational audio. Listen, it's powerful
            </p>
            </div>
        </div>
    );

};

export default ProductBannerSquareLeft;
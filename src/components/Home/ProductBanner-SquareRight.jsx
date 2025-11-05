const ProductBannerSquareRight = ({ onClick }) => {
    return (
        <div 
            onClick={() => onClick("de7f3bf8-3111-4cf7-8030-7e085511a69a")}
            className="cursor-pointer flex flex-row justify-center items-center bg-[#353535] w-1/2 h-[309px] flex-none order-1 self-stretch flex-grow relative overflow-hidden">
              {/*Image */}
              <div
                className="absolute flex-none order-1 flex-grow-0 z-10 xl:!w-[180px] xl:!h-[250px] xl:!left-[-80px] lg:!w-[160px] lg:!h-[220px] lg:!left-[-70px] md:!w-[140px] md:!h-[190px] md:!left-[-60px] sm:!w-[120px] sm:!h-[160px] sm:!left-[-50px]"
                style={{
                  backgroundImage: "url(/vision-pro-e1711469754160.png)",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left center",
                  width: "200px",
                  height: "280px",
                  left: "-90px",
                  top: "15px",
                  transform: "scale(1.4)",
                }}
              />

              {/* Title + Text */}
              <div className="flex flex-col justify-center items-center p-0 gap-2 flex-none order-0 flex-grow-0 z-0 ml-16 mr-8 xl:ml-12 lg:ml-10 md:ml-8 sm:ml-6 xl:mr-6 lg:mr-4 md:mr-3 sm:mr-2">
                <h3 className="font-light text-[36px] leading-9 text-white text-center xl:text-[32px] lg:text-[28px] md:text-[24px] sm:text-[20px] xl:leading-8 lg:leading-7 md:leading-6 sm:leading-5">
                  Vision <span className="font-bold">Pro</span>
                </h3>
                <p className="font-medium text-base leading-5 text-[#919191] text-center max-w-[160px] lg:text-sm md:text-xs sm:text-[10px] lg:max-w-[140px] md:max-w-[120px] sm:max-w-[100px]">
                  An immersive way to experience content
                </p>
              </div>
            </div>
    );
};
export default ProductBannerSquareRight;
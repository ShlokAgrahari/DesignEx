import { twMerge } from "tailwind-merge";
import Marquee from "../minicomponents/Marquee";
import { reviews } from "../constants";

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={twMerge(
        "relative h-full w-64 cursor-pointer overflow-hidden p-4 transition-all duration-300 ease-in-out",
        "rounded-3xl",
        "border border-gray-700/50 bg-gradient-to-br from-gray-950 to-black",
        "shadow-lg hover:shadow-2xl hover:scale-[1.02]",
        "group"
      )}
      style={{
        boxShadow:
          "0 0 0 1px rgba(100, 100, 100, 0.2), 0 4px 10px rgba(0, 0, 0, 0.5)",
        borderImageSlice: 1,
        borderImageSource: "linear-gradient(to right, #6B7280, #9CA3AF)",
      }}
    >
      {/* Dynamic Border/Glow on Hover - Now transparent/no color */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        style={{
          boxShadow:
            "0 0 0 2px rgba(150, 150, 150, 0.2), 0 0 15px 5px rgba(150, 150, 150, 0.1)",
          backgroundImage: "none",
        }}
      ></div>

      <div className="relative z-20 flex flex-row items-center gap-3 mb-3">
        <img
          className="rounded-full bg-white/10 p-0.5 border border-white/20"
          width="40"
          height="40"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-base font-semibold text-white tracking-wide">
            {name}
          </figcaption>
          <p className="text-sm font-medium text-white/50">{username}</p>
        </div>
      </div>
      <blockquote className="relative z-20 mt-2 text-sm text-gray-300 leading-relaxed">
        {body}
      </blockquote>
    </figure>
  );
};

export default function Testimonial() {
  return (
    <div className="items-start mt-25 md:mt-35 c-space">
      <div
        className="relative z-0 overflow-hidden rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 shadow-3xl transform transition-all duration-700 ease-out hover:scale-[1.005] hover:shadow-4xl group"
        style={{
          background: "linear-gradient(145deg, #1C1C1C 0%, #0A0A0A 100%)",

          border: "1px solid rgba(255, 255, 255, 0.05)",

          boxShadow:
            "0 0 0 2px rgba(255,255,255,0.02) inset, 0 0 0 1px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.6)",
          willChange: "transform, box-shadow",
        }}
      >
        <div
          className="absolute inset-0 z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C9C9C' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div
          className="absolute inset-0 rounded-3xl z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow:
              "0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 25px 8px rgba(150, 150, 150, 0.3)",
          }}
        ></div>

        <h2 className="text-heading text-center mb-10 text-white font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight relative z-10">
          Hear From Our Users
        </h2>
        <div className="relative flex flex-col items-center justify-center w-full mt-8 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s] mb-4">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>

          <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none bg-gradient-to-r from-[var(--outer-card-bg-start)] via-[var(--outer-card-bg-mid)] to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none bg-gradient-to-l from-[var(--outer-card-bg-start)] via-[var(--outer-card-bg-mid)] to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

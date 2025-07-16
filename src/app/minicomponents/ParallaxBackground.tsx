import React from "react";
const ParallaxBackground = () => {
  return (
    <section className="absolute inset-0 bg-black/40">
      <div className="relative h-screen overflow-y-hidden">
        {/*Backgroundsky*/}
        <div
          className="absolute inset-0 w-full h-screen -z-50"
          style={{
            backgroundImage: "url(/assets/sky.jpg)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
        />
        {/*mountain layer 3*/}
        <div />
        {/*planets*/}
        <div />
        {/*mountain layer 2*/}
        <div />
        {/*mountain layer 1*/}
        <div />
      </div>
    </section>
  );
};
export default ParallaxBackground;

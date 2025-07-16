import { FlipWords } from "../minicomponents/FlipWords";

import { motion } from "motion/react";

const HeroText = () => {
  const words = ["Collaborative", "Creative", "Limitless"];
  const varaints = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="z-10 mt-20 text-center md:mt-40 md:text-left rounded-3xl bg-clip-text">
      {/*Desktopview*/}
      <div className="flex-col hidden md:flex c-space">
        <motion.h1
          className="text-4xl font-medium"
          variants={varaints}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Welcome To DESIGNEX
        </motion.h1>
        <div className="flex flex-col items-start">
          <motion.p
            className="text-5xl font-medium text-neutral-300"
            variants={varaints}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            DESIGN <br /> WITHOUT LIMITS
          </motion.p>
          <motion.div
            variants={varaints}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-black text-white text-8xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl font-medium text-neutral-300"
            variants={varaints}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            Start Designing Today!!
          </motion.p>
        </div>
      </div>
      {/*mobileview*/}
      <div className="flex flex-col space-y-6 md:hidden">
        <motion.p
          className="text-4xl font-medium"
          variants={varaints}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Welcome To DESIGNEX
        </motion.p>
        <div>
          <motion.p
            className="text-5xl font-black text-neutral-300"
            variants={varaints}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            DESIGN WITHOUT LIMITS
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-black text-white text-8xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl font-black text-neutral-300"
            variants={varaints}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            Start Designing Today!!
          </motion.p>
        </div>
      </div>
    </div>
  );
};
export default HeroText;

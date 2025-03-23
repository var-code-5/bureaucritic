"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function TeamSection() {
  const team = [
    { name: "John Doe", position: "CEO", image: "/landing/hero/img1.png" },
    { name: "Jane Doe", position: "CTO", image: "/landing/hero/img2.png" },
    { name: "John Smith", position: "COO", image: "/landing/hero/img1.png" },
    { name: "Jane Smith", position: "CFO", image: "/landing/hero/img2.png" },
    { name: "John Doe", position: "CEO", image: "/landing/hero/img1.png" },
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % team.length);
  };

  // Auto-play every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-foreground text-background px-12 py-4 flex">
      {/* Left Section */}
      <div className="w-[30%] min-h-screen">
        <h1 className="text-7xl font-inter font-bold py-36">
          Meet the
          <br /> Team
        </h1>
        <p className="text-2xl font-roboto-mono">
          Get to know the minds behind beaurocrat.
        </p>
      </div>

      {/* Middle Section - Image Carousel */}
      <div className="w-[40%] min-h-screen flex flex-col justify-center items-center gap-12 relative mt-36">
        <p>{index + 1} / {team.length}</p>

        <div className="relative w-[60%] aspect-[3/4] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={team[index].image}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full"
            >
              <Image
                src={team[index].image}
                alt={team[index].name}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {/* <div className="flex gap-4">
          <button onClick={prevSlide} className="p-2 text-3xl rounded-full">⬅</button>
          <button onClick={nextSlide} className="p-2 text-3xl rounded-full">➡</button>
        </div> */}
      </div>

      {/* Right Section - Name & Position */}
      <div className="w-[30%] min-h-screen flex flex-col justify-end pb-16">
        <p className="text-2xl font-roboto-mono text-right">{team[index].position}</p>
        <h1 className="text-7xl font-inter font-bold py-16 mt-16 text-right">
          {team[index].name.split(" ")[0]}
          <br/>
          {team[index].name.split(" ")[1]}
        </h1>
      </div>
    </div>
  );
}

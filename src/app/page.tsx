"use client";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function Home() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const borderVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  return (
    <div className="w-full h-full">
      {/* hero section */}
      <div className="w-full min-h-screen flex items-center justify-center">
        <h1 className="text-9xl transition-all duration-75">
          Beaur
          <span className="rounded-full w-16 h-16 bg-foreground inline-block"></span>
          critic
        </h1>
      </div>

      {/* hero section */}
      <div className="w-full min-h-screen flex items-center justify-center bg-foreground text-background">
        <div className="w-[40%] min-h-[60vh] justify-between flex flex-col items-start gap-4">
          <h1 className="text-7xl font-bold font-inter">Accelerate Your Processes</h1>
          <p className="font-roboto-mono text-2xl">AI-Powered <br/>Solutions to<br/> Conquer<br/> Bureaucracy.</p>
          <button className="w-[80%] border-2 border-background text-4xl font-bold py-2 px-4">Get started for free</button>
        </div>
        <div className="flex gap-16">
          <div className="space-y-8">
            <Image
              src="/landing/hero/img2.png"
              height={1000}
              width={1000}
              alt="say good bye's to delays images"
              className="w-[100%] h-auto"
            />
            <p className="w-full h-16 bg-primary text-center text-2xl text-foreground p-4 font-bold">Say Goodbye to Delays</p>
          </div>
          <div className="space-y-8">
            <p className="w-full h-16 bg-primary text-center text-2xl text-foreground p-4 font-bold">Unlock Uprecedented Speed</p>
            <Image
              src="/landing/hero/img1.png"
              height={1000}
              width={1000}
              alt="say good bye's to delays images"
              className="w-[100%] h-auto"
            />
          </div>
        </div>
      </div>

      {/* results */}
      <div
        ref={sectionRef}
        className="w-full min-h-screen flex text-background bg-foreground px-12 py-4"
      >
        <div className="min-w-1/2 min-h-full flex flex-col justify-center">
          <h1 className="capitalize text-7xl font-bold">
            instant results,
            <br /> zero hassle
          </h1>
          <p className="font-roboto-mono text-2xl mt-20">
            AI Revolutionizes
            <br /> Bureaucratic Tasks.
          </p>
        </div>
        <div className="w-1/2 min-h-full flex justify-start items-end">
          {[
            { value: 10, height: "30%" },
            { value: 15, height: "40%" },
            { value: 20, height: "50%" },
          ].map((item, index) => (
            <>
              <motion.div
                key={`border-${index}`}
                className="border-2 border-primary inline-block"
                style={{ minHeight: item.height }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={borderVariants}
                transition={{ delay: index * 0.3 }}
              />
              <motion.div
                key={`text-${index}`}
                className="w-[25%] px-4"
                style={{ minHeight: item.height }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={textVariants}
                transition={{ delay: 1 + index * 0.3 }}
              >
                <h3 className="text-primary font-inter text-4xl mb-4 font-bold">
                  {item.value}%
                </h3>
                <p className="font-roboto-mono">
                  {item.value === 10 &&
                    "Healthcare wait times contribute to a 10% increase in preventable medical complications."}
                  {item.value === 15 &&
                    "Disaster relief delays can increase mortality rates by 15% in affected areas."}
                  {item.value === 20 &&
                    "Permit approval delays add 20% to construction project costs, impacting housing affordability."}
                </p>
              </motion.div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

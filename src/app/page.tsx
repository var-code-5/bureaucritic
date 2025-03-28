"use client";
import Footer from "@/components/Footer";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import ArticleCarousel from "@/components/Article";
import TeamSection from "@/components/Teams";
import Link from "next/link";

export default function Home() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setExpanding(true);
      const expandTimer = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(expandTimer);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const borderVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  const circleVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
    expand: {
      scale: [1, 100],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="w-full h-full">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="w-full min-h-screen flex items-center justify-center fixed inset-0 z-50 bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <h1 className="text-9xl transition-all duration-75">
                Beaur
                <motion.span
                  className="rounded-full w-16 h-16 bg-foreground inline-block"
                  variants={circleVariants}
                  animate={expanding ? "expand" : "pulse"}
                ></motion.span>
                critic
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* hero section */}
      <div className="relative w-full min-h-screen flex items-center justify-center bg-foreground text-background">
        <div className="w-[40%] min-h-[60vh] justify-between flex flex-col items-start gap-4">
          <h1 className="text-7xl font-bold font-inter">
            Accelerate Your Processes
          </h1>
          <p className="font-roboto-mono text-2xl">
            AI-Powered <br />
            Solutions to
            <br /> Conquer
            <br /> Bureaucracy.
          </p>
          <Link href="/auth" className="w-full">
            <button className="w-[80%] border-2 border-background text-4xl font-bold py-2 px-4 cursor-pointer hover:bg-primary hover:text-foreground">
              Get started for free
            </button>
          </Link>
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
            <p className="w-full h-16 bg-primary text-center text-2xl text-foreground p-4 font-bold font-roboto-mono">
              Say Goodbye to Delays
            </p>
          </div>
          <div className="space-y-8">
            <p className="w-full h-16 bg-primary text-center text-2xl text-foreground p-4 font-bold font-roboto-mono">
              Unlock Unprecedented Speed
            </p>
            <Image
              src="/landing/hero/img1.png"
              height={1000}
              width={1000}
              alt="say good bye's to delays images"
              className="w-[100%] h-auto"
            />
          </div>
        </div>
        <div className="absolute bottom-0 w-full left-0 border-y-2 border-primary">
          <Marquee autoFill={true} speed={70}>
            <div className="text-4xl font-bold pl-6 py-4 bg-foreground text-primary">
              Bypass the Red Tape: AI Streamlines Your Forms and Applications
            </div>
          </Marquee>
        </div>
      </div>

      {/* solutions */}
      <div className="w-full min-h-screen flex text-background bg-foreground px-12 py-8">
        <div className="min-w-[30%] min-h-full flex flex-col justify-between py-28 text-left">
          <h1 className="text-7xl font-bold font-inter text-primary">
            The Solution you need
          </h1>
          <p className="font-roboto-mono text-2xl">
            Our Solution <br />
            Removes <br />
            Bureaucratic
            <br /> Burdens
          </p>
          <button className="w-[80%] border-2 border-background text-4xl font-bold py-2 px-4">
            Book a free demo
          </button>
        </div>
        <div className="min-w-[70%] min-h-full flex flex-col justify-center">
          <Image
            src="/landing/Flow-b.svg"
            alt="Flow"
            width={1000}
            height={1000}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* results */}
      <div
        ref={sectionRef}
        className="w-full min-h-screen flex text-background bg-foreground px-12 py-4 relative"
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
            { value: 15, height: "50%" },
            { value: 20, height: "70%" },
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
        <div className="absolute bottom-0 w-full left-0 border-y-2 border-primary">
          <Marquee autoFill={true} speed={70}>
            <div className="text-4xl font-bold pl-6 py-4 bg-foreground text-primary">
              Bypass the Red Tape: AI Streamlines Your Forms and Applications
            </div>
          </Marquee>
        </div>
      </div>

      {/* Goal */}
      <div className="w-full min-h-[200vh] bg-foreground px-12 flex justify-end">
        <div className="w-[40%] h-full sticky top-0">
          <h1 className="capitalize text-7xl font-bold font-inter text-background pt-46">
            {" "}
            Our Goal
          </h1>
          <p className="text-2xl text-background font-roboto-mono mt-8">
            Our solution revolutionizes <br /> these key areas.
          </p>
        </div>
        <div className="w-[60%] h-full mt-24">
          <Image
            src="/Goals.svg"
            alt="Goals"
            width={1000}
            height={1000}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* articles */}
      <ArticleCarousel />

      {/* Team section */}
      <TeamSection />

      <Footer />
    </div>
  );
}

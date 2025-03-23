import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="h-screen min-w-full overflow-hidden">
      <div className="h-[40%] w-full bg-background flex justify-between items-center gap-24 p-4 px-12">
        <h1 className="text-foreground text-6xl font-inter font-bold tracking-tighter">
          Empower Action
        </h1>
        <Image
          src="/landing/footer/Arrow 1.png"
          alt="Arrow here"
          height={1000}
          width={1000}
          className="w-[40%]"
        />
        <h1 className="text-foreground text-6xl font-inter font-bold tracking-tighter">
          Contact us today
        </h1>
      </div>
      <div className="h-[60%] w-full bg-primary px-12 relative">
        <div className="flex justify-between items-start py-8  ">
          <div className="text-left">
            <h3 className="text-foreground text-5xl font-inter font-bold tracking-tighter my-4">
              Stay informed
            </h3>
            <p className="text-md font-roboto-mono">
              Sign up for our newsletter to receive news,
              <br /> updates, and insights regarding the next <br /> era of
              modern Beaurocracy repair.
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-foreground text-5xl font-inter font-bold tracking-tighter my-4">
              Contact Us
            </h3>
            <p className="text-md font-roboto-mono">
              S657 900 4182 <br /> 1735 E Wilshire Avenue <br /> Suite 806 Santa
              Ana, CA <br /> 92705
            </p>
          </div>
        </div>
        <h3 className="font-roboto-mono text-3xl border-b-2 border-foreground inline-block w-[25%]">
          Email Id
        </h3>
        <h3 className="absolute -bottom-28 -left-8 w-full text-center text-[13vw] font-bold uppercase text-outline ">
          BUREAUCRATIC
        </h3>
      </div>
    </div>
  );
}

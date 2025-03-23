'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Blur overlay that appears when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className='h-20 fixed top-0 w-screen flex justify-between items-center bg-foreground text-background px-12 py-2 z-10'>
        <h1 className='text-3xl font-inter font-bold'>Bureaucratic</h1>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-1" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-foreground text-background">
            <nav className="flex flex-col space-y-4 mt-8">
              <a href="/" className="text-lg hover:underline">Home</a>
              <a href="/about" className="text-lg hover:underline">About</a>
              <a href="/services" className="text-lg hover:underline">Services</a>
              <a href="/contact" className="text-lg hover:underline">Contact</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default Navbar;
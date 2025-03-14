"use client"

import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() =>{
    const imageElement = imageRef.current;

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 100;

        if(scrollPosition > scrollThreshold){
            imageElement.classList.add("scrolled");
        }else{
            imageElement.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll);

    // when component is un-mounted , we need to remove the event
    return () => window.removeEventListener("scroll",handleScroll);

  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
        <div className="space-y-6 text-center">
            <div className='space-y-6 mx-auto'>
                <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title'>
                    Your AI Career Coach for
                    <br />
                    Professional Success
                </h1>
                <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                    {/* max-w-[600px] -> So, that we can break it into 2 lines */}
                    Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
                </p>
            </div>

            <div>
                <Link href="/onboarding">
                    <Button size="lg" className="px-8">Get Started</Button>
                </Link>
            </div>

            <div className='hero-image-wrapper mt-5 md:mt-0'>
                <div ref={imageRef} className='hero-image'>
                    <Image
                        src={"/banner.webp"}
                        width={1280}
                        height={720}
                        alt="Banner Vexor"
                        className='rounded-lg shadow-2xl border mx-auto'
                        priority
                        // priority Tag -> So , it's load first
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection

import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import Link from 'next/link'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import Image from 'next/image'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  //every single time when we land on our app,  
  // we will check if user is part of our database or not
  await checkUser();  //With help of checkUser
  
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
        <nav className="container max-auto px-4 h-16 flex items-center justify-between">
            {/* Link tag -> healps us to navigate between different pagews */}
            <Link href='/'>
            {/* Image -> Optimize images in server and sends it to client */}
                <Image 
                    src="/logo.png"
                    alt="Vexor logo"
                    width={200}
                    height={60}
                    className="h-12 py-1 w-auto object-contain"
                />
            </Link>

            <div className='flex items-center space-x-2 md:space-x-4'>
                <SignedIn>
                    <Link href={'/dashboard'}>
                        <Button variant="outline">
                            <LayoutDashboard className="h-4 w-4"/>
                            <span className='hidden md:block'>Industry Insights</span>
                        </Button>
                    </Link>
               

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <StarsIcon className="h-4 w-4"/>
                                <span className='hidden md:block'>Growth Tools</span>
                                <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={'/resume'} className='flex items-center gap-2'>
                                    <FileText className="h-4 w-4"/>
                                    <span>Build Resume</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={'/ai-cover-letter'} className='flex items-center gap-2'>
                                    <PenBox className="h-4 w-4"/>
                                    <span>Cover Letter</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={'/interview'} className='flex items-center gap-2'>
                                    <GraduationCap className="h-4 w-4"/>
                                    <span>Interview Prep</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SignedIn>

                {/* If user is SignOut -> Show SignIn Button */}
                <SignedOut>
                    <SignInButton>
                        <Button variant="outline">Sign In</Button>
                    </SignInButton>
                </SignedOut>
                {/* If user is SignIn show USerButton */}
                <SignedIn>
                    <UserButton 
                        appearance={{
                            elements:{
                                avatarBox:"w-10 h-10",
                                userButtonPopoverCard: "shadow-xl",
                                userPreviewMainIdentifier: "font-semibold",
                            }
                        }}
                        afterSignOutUrl='/'
                    />
                </SignedIn>
            </div>
        </nav>
        
    </header>
  )
}

export default Header

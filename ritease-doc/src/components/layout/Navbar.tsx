"use client";
import Link from "next/link";
import { IoDocumentsOutline } from "react-icons/io5";


export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#008080] backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* <div className="lg:flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0"> */}
        <div className="lg:flex items-center text-white justify-between gap-4 sm:gap-0">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold inline-flex gap-2 items-center">
          {/* <div className="inline-flex gap-2 items-center"> */}
          <IoDocumentsOutline width={50} height={50}/>
          <h1>
            LyteDoc
          </h1>
          {/* </div> */}
          

          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 font-semibold sm:text-lg">
            <Link href="/" className="text-white hover:text-white/80 transition-colors">
              Home
            </Link>
            <Link href="/login" className="text-white hover:text-white/80 transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white text-lg py-6 px-8">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
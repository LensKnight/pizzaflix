import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="
      fixed
      top-0
      left-0
      w-full
      z-50
      px-8
      py-5
      flex
      justify-between
      items-center
      bg-black/30
      backdrop-blur-md
    ">
    
    <Link href="/" className="inline-block">
      <Image
        src="/hero-pizza copy.png"
        alt="PIZZAFLIX Logo"
        width={130}
        height={40}
        className="object-contain"
      />
    </Link>


      <div className="
        flex
        gap-8
        text-white
      ">

        <Link href="/menu">Menu</Link>
        <Link href="/#Offers">Offers</Link>
        <Link href="/#aboutus">About Us</Link>

      </div>

    </nav>
  );
}
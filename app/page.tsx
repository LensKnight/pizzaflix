import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandStory from "@/components/BrandStory";
import FeaturedFood from "@/components/FeaturedFood";
import Speciality from "@/components/Speciality";
import MenuSection from "@/components/MenuSection";
import Offers from "@/components/Offers";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
      <main>
        <Navbar />
        <Hero />
        <div className="relative">
          <BrandStory />
          <Speciality />
          <FeaturedFood />
          <MenuSection />
          <Offers />
          <Reviews />
          <Gallery />
          <Footer />
        </div>
      </main>
  );
}
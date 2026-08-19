import Hero from "@/components/home/Hero";
import HeroStats from "@/components/home/HeroStats";
import TrustStrip from "@/components/home/TrustStrip";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import BrandStory from "@/components/home/BrandStory";
import OccasionBanner from "@/components/home/OccasionBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />

      <HeroStats />

      <TrustStrip />

      <FeaturedCategories />

      <BestSellers />

      <BrandStory />

      <OccasionBanner />

      <Testimonials />

      <Newsletter />
    </>
  );
}
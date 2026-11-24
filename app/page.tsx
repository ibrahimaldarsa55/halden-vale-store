import { BrandStory } from "@/components/brand-story";
import { Catalog } from "@/components/catalog";
import { CategoryTiles } from "@/components/category-tiles";
import { Hero } from "@/components/hero";
import { Reviews } from "@/components/reviews";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <Catalog />
      <BrandStory />
      <Reviews />
    </>
  );
}

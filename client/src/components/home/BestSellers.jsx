import products from "@/data/productsData";
import ProductGrid from "@/components/shop/ProductGrid";


export default function BestSellers() {

  return (

    <section className="bg-gradient-to-b from-white to-pink-50 py-20">

      <div className="mx-auto max-w-7xl px-6">


        <div className="mb-12 text-center">


          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
            Best Sellers
          </p>


          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Most Loved Flowers
          </h2>


          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Discover our most beautiful handcrafted flower collections.
          </p>


        </div>



        <ProductGrid
          products={products}
        />


      </div>

    </section>

  );
}
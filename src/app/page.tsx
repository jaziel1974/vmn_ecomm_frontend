import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import Center from "@/components/Center";
import { Category } from "@/models/Category";

export default async function HomePage() {
  await mongooseConnect();
  const advertisementCataegory = await Category.find({ name: "Advertisement" });
  const featuredProductsObj = await Product.find({ category: advertisementCataegory[0]._id, stockAvailable: true});
  const newProductsObj = await Product.find({ stockAvailable: true }, null, { sort: { 'createdAt': -1 }, limit: 10 });
  const featuredProducts = JSON.parse(JSON.stringify(featuredProductsObj))
  const newProducts = JSON.parse(JSON.stringify(newProductsObj))

  return (
    <div>
      <Center>
        <Featured products={featuredProducts}></Featured>
        <NewProducts products={newProducts}></NewProducts>
      </Center>
    </div>
  );
}
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import Center from "@/components/Center";
import { Category } from "@/models/Category";

export default function HomePage({ featuredProducts, newProducts }) {
  return (
    <div>
      <Header></Header>
      <Center>
        <Featured products={featuredProducts}></Featured>
        <NewProducts products={newProducts}></NewProducts>
      </Center>
    </div>
  );
}


export async function getServerSideProps() {
  const featuredProductId = '64d6d2824c5e6b15def72360';
  await mongooseConnect();
  const advertisementCataegory = await Category.find({ name: "Advertisement" });
  const featuredProducts = await Product.find({ category: advertisementCataegory[0]._id});
  const newProducts = await Product.find({ stockAvailable: true }, null, { sort: { 'createdAt': -1 }, limit: 10 });
  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      newProducts: JSON.parse(JSON.stringify(newProducts))
    }
  }
}
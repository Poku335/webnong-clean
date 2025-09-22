// rafce
import ContentCarousel from "../components/home/ContentCarousel";
import BestSeller from "../components/home/BestSeller";
import NewProduct from "../components/home/NewProduct";
import Categories from "../components/home/Categories";

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <ContentCarousel />
      </section>

      {/* Categories Section */}
      <section className="py-8">
        <h2 className="section-title">หมวดหมู่สินค้า</h2>
        <Categories />
      </section>

      {/* Best Seller Section */}
      <section className="py-8">
        <h2 className="section-title">สินค้าขายดี</h2>
        <BestSeller />
      </section>

      {/* New Products Section */}
      <section className="py-8">
        <h2 className="section-title">สินค้าใหม่</h2>
        <NewProduct />
      </section>
    </div>
  );
};

export default Home;

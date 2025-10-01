// rafce
import ContentCarousel from "../components/home/ContentCarousel";
import BestSeller from "../components/home/BestSeller";
import NewProduct from "../components/home/NewProduct";
import Categories from "../components/home/Categories";

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative animate-fade-in">
        <ContentCarousel />
      </section>

      {/* Categories Section */}
      <section className="py-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="section-title">หมวดหมู่สินค้า</h2>
          <p className="section-subtitle">
            ค้นหาสินค้าที่คุณต้องการได้ง่ายๆ ตามหมวดหมู่
          </p>
        </div>
        <Categories />
      </section>

      {/* Best Seller Section */}
      <section className="py-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="section-title">สินค้าขายดี</h2>
          <p className="section-subtitle">
            สินค้าที่ได้รับความนิยมสูงสุดจากลูกค้า
          </p>
        </div>
        <BestSeller />
      </section>

      {/* New Products Section */}
      <section className="py-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="section-title">สินค้าใหม่</h2>
          <p className="section-subtitle">
            สินค้าใหม่ล่าสุดที่เพิ่งเข้ามาในร้าน
          </p>
        </div>
        <NewProduct />
      </section>

      {/* Thank You Section */}
      <section className="py-8 bg-orange-100 rounded-3xl animate-slide-up">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="section-title">มอใหม่ ฟิชชิ่ง</h2>
            <p className="section-subtitle">
              ขอขอบคุณลูกค้าทุกคนที่สนับสนุนครับ
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

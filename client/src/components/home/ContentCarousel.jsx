import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Autoplay, Navigation } from "swiper/modules";


const images = [
  { id: 0, download_url: "https://i.imgur.com/Z70Aj3Z.png" },
  { id: 1, download_url: "https://i.imgur.com/Z70Aj3Z.png" },
  { id: 2, download_url: "https://i.imgur.com/Z70Aj3Z.png" },
  { id: 3, download_url: "https://i.imgur.com/Z70Aj3Z.png" },
    { id: 4, download_url: "https://i.imgur.com/Z70Aj3Z.png" },
      { id: 5, download_url: "https://i.imgur.com/Z70Aj3Z.png" },
];

const ContentCarousel = () => {
  return (
    <div className="space-y-8">
      {/* Main Hero Carousel */}
      <div className="relative">
        <Swiper
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary-500 !opacity-100',
          }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="hero-swiper h-96 rounded-2xl overflow-hidden shadow-large"
        >
          {images.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative h-full">
                <img
                  className="w-full h-full object-cover"
                  src={item.download_url}
                  alt={`Hero Slide ${item.id}`}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h2 className="text-3xl font-display font-bold mb-2">น้องเอิร์นShop ขายทุกอย่าง</h2>
                  <p className="text-lg opacity-90">สินค้าคุณภาพตกเกรด ราคาเป็นมิจ</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Secondary Carousel */}
      <div className="relative">
        <Swiper
          slidesPerView={2}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="secondary-swiper"
        >
          {images.map((item) => (
            <SwiperSlide key={`secondary-${item.id}`}>
              <div className="relative group cursor-pointer">
                <img
                  className="w-full h-32 object-cover rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300"
                  src={item.download_url}
                  alt={`Secondary Slide ${item.id}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContentCarousel;

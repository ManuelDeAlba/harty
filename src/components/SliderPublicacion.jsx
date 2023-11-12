import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function SliderPublicacion({ multimedia }){
    return(
        multimedia.length > 0 && (
            <Swiper
                className="publicacion__slider contenedor"
                modules={[Navigation, Pagination]}
                pagination={{
                    clickable: true
                }}
                navigation
                loop
            >
                {
                    multimedia.map((imagen, indice) => (
                        <SwiperSlide className="publicacion__slide" key={indice}>
                            <img className="publicacion__img" src={imagen.src} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        )
    )
}

export default SliderPublicacion;
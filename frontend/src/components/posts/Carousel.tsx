import { useMemo } from "react";
import useFancybox from "../../hooks/useFancybox"
import type { PostImage } from "../../types";
import { CameraIcon } from "@heroicons/react/16/solid";

type CarouselProps = {
  images: PostImage[];
}

const Carousel = ( { images } : CarouselProps ) => {

  //Contar el numero total de imagenes
  const totalImages = useMemo(() => images.length , [ images ]);

  const [fancyboxRef] = useFancybox({
    // Your custom options
  });
  return (
    

    <div ref={fancyboxRef} className="flex justify-start items-center lg:px-5">

      {totalImages > 0 && (
        <div className="relative">
          <div className="brightness-[0.40]">
            <a data-fancybox="gallery" href={ images[0]?.path }>
              <img src={ images[0]?.path } alt={`Imagen de post ${ images[0]?.id }`} className="w-full rounded-lg" />
            </a>
          </div>   
          <a className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between gap-x-3 items-center
           text-white font-bold text-3xl filter-none cursor-pointer"
            href={ images[0]?.path }
          >
            <CameraIcon className="h-10 aspect-square"/>
            { totalImages }
          </a>
        </div>

      )}

      <div className="hidden">
        {images.slice(1).map( image => (
          <a data-fancybox="gallery" href={ image.path }>
            <img src={ image.path } alt={`Imagen de post ${ image.id }`} />
          </a>
        ) )}
        
      </div>
    </div>
  )
}

export default Carousel
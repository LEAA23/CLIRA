import useFancybox from "../../hooks/useFancybox";

type ClinicalStudyImage = {
    id: number;
    path: string;
};

type CarouselProps = {
    images: ClinicalStudyImage[];
};

const ClinicalStudiesCarousel = ({ images }: CarouselProps) => {

    const [fancyboxRef] = useFancybox({});

    if (images.length === 0) return null;

    return (
        <div
            ref={fancyboxRef}
            className="w-full mt-5"
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                    <a
                        key={image.id}
                        data-fancybox="clinical-studies"
                        href={image.path}
                        className="block w-full aspect-square overflow-hidden rounded-lg cursor-pointer"
                    >
                        <img
                            src={image.path}
                            alt={`Estudio clínico ${image.id}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default ClinicalStudiesCarousel;
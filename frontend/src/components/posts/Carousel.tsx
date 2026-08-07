import useFancybox from "../../hooks/useFancybox"

const Carousel = () => {
  const [fancyboxRef] = useFancybox({
    // Your custom options
  });
  return (
    <div ref={fancyboxRef} className="flex justify-start items-center px-5">
      <a data-fancybox="gallery" href="/postExample.png">
        <img src="/postExample.png" alt="Sample image #1" className="rounded-lg" />
      </a>

      <div className="hidden">
        
        <a data-fancybox="gallery" href="https://lipsum.app/id/61/1600x1200">
            <img src="https://lipsum.app/id/61/200x150" alt="Sample image #2" />
        </a>
        <a data-fancybox="gallery" href="https://lipsum.app/id/62/1600x1200">
            <img src="https://lipsum.app/id/62/200x150" alt="Sample image #3" />
        </a>
        <a data-fancybox="gallery" href="https://lipsum.app/id/63/1600x1200">
            <img src="https://lipsum.app/id/63/200x150" alt="Sample image #4" />
        </a>
        <a data-fancybox="gallery" href="https://lipsum.app/id/64/1600x1200">
            <img src="https://lipsum.app/id/64/200x150" alt="Sample image #5" />
        </a>
      </div>
    </div>
  )
}

export default Carousel
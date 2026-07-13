
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-700 p-10 mt-14">
      <div className="space-y-10">
        <a href="/">
          <h3 className="text-white font-bold text-3xl text-center uppercase">Clira</h3>
        </a>

        <p className="text-white font-light text-center">Todos los derechos reservados &copy;{currentYear}</p>
      </div>
    </footer>
  )
}

export default Footer;
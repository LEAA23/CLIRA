import { Link } from "react-router-dom"

const Register = () => {
  return (
    <>
        <h1 className="text-center font-bold text-4xl my-10">
            <span className="text-blue-500">Crea tu cuenta {""}</span>
            y Prueba Nuestras Herramientas
        </h1>

        <div className="bg-white mx-auto max-w-5xl md:grid md:grid-cols-2 rounded-2xl overflow-hidden shadow md:h-102.5">
            <form 
                className="space-y-2 p-5 overflow-y-scroll"
            >
                <legend className="text-2xl text-center font-bold">Llena todos los campos</legend>

                <div className="flex flex-col">
                    <label htmlFor="name" className="text-2xl font-bold text-gray-600">Nombre</label>
                    <input 
                        type="text"
                        id="name"
                        placeholder="Escribe tu nombre aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg" 
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-2xl font-bold text-gray-600">Apellidos</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Escribe tus apellidos aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="rol" className="text-gray-600 font-bold text-2xl">Rol</label>

                    <select 
                        id="rol"
                        className="border border-gray-400 p-2 my-3 rounded-lg w-full"
                        defaultValue=""
                    >
                        <option value="" disabled>-- Selecciona un rol --</option>
                        <option value="student">Estudiante</option>
                        <option value="teacher">Maestro/Doctor</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="phoneNumber" className="text-gray-600 font-bold text-2xl">Tel&eacute;fono</label>
                    <input 
                        type="tel"
                        id="phoneNumber"
                        placeholder="Escribe tu numero de tel&eacute;fono aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email" className="text-gray-600 font-bold text-2xl">E-mail</label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="Escribe tu e-mail aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 rounded-lg w-full"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-2xl font-bold text-gray-600">Contrase&ntilde;a</label>
                    <input 
                        type="password"
                        id="password"
                        placeholder="Escribe tu contrase&ntilde;a aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg" 
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="repeatPassword" className="text-gray-600 font-bold text-2xl">Repite tu contrase&ntilde;a</label>
                    <input 
                        type="password"
                        id="repeatPassword"
                        placeholder="Repite tu contrase&ntilde;a de nuevo"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                    />
                </div>

                <div className="flex justify-between items-center space-y-5 flex-col md:items-start md:flex-row">
                    <Link to="/" className="text-blue-500 hover:text-blue-800">&iquest;Ya tienes una cuenta?</Link>
                    <Link to="/forgot-password" className="text-blue-500 hover:text-blue-800">&iquest;Olvidaste tu contrase&ntilde;a?</Link>
                </div>

                <input 
                    type="submit"
                    value="Crear cuenta"
                    className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer hover:transition-colors hover:bg-blue-600 md:w-auto" 
                />
            </form>

            <div className="bg-[url(/register.png)] bg-cover bg-no-repeat"></div>
        </div>
    </>
  )
}

export default Register;
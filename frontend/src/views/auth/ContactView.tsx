import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const ContactView = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demostración visual: todavía no se envía ningún correo.
    setSubmitted(true);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputStyles =
    "w-full rounded-xl border border-gray-200 dark:border-purple-700 bg-gray-50 dark:bg-[#302044] px-4 py-3 text-gray-800 dark:text-purple-100 placeholder:text-gray-400 dark:placeholder:text-purple-300/50 outline-none transition focus:border-blue-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-purple-900";

  const labelStyles =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-purple-100";

  return (
    <div className="mx-auto w-full max-w-7xl py-8">
      {/* REGRESAR */}
      <Link
        to="/auth/login"
        className="mb-8 inline-flex items-center gap-2 font-medium text-blue-600 transition hover:text-blue-800 dark:text-purple-300 dark:hover:text-purple-100"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Volver al inicio
      </Link>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-7 py-14 text-white shadow-xl md:px-14 md:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 -left-10 h-80 w-80 rounded-full bg-cyan-300/10" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Estamos para escucharte
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">
            Hablemos de
            <span className="block text-cyan-200">CLIRA.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-50 md:text-lg">
            ¿Tienes alguna pregunta, sugerencia o comentario?
            Nos interesa conocer tu opinión y seguir mejorando
            la experiencia de aprendizaje clínico.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* INFORMACIÓN */}
        <div className="space-y-5 lg:col-span-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-purple-100">
              Conectemos
            </h2>
            <p className="mt-2 leading-relaxed text-gray-500 dark:text-purple-200/70">
              Tu opinión nos ayuda a construir una plataforma
              de simulación clínica cada vez mejor.
            </p>
          </div>

          {/* TARJETA 1 */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:border-purple-800/60 dark:bg-[#2b2045]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <EnvelopeIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-gray-800 dark:text-purple-100">
              Correo electrónico
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-purple-200/70">
              Nuestro correo de contacto estará disponible próximamente.
            </p>
          </div>

          {/* TARJETA 2 */}
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6 dark:border-purple-800/60 dark:bg-[#302044]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white">
              <AcademicCapIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-gray-800 dark:text-purple-100">
              Educación médica
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-purple-200/70">
              Estamos comprometidos con el aprendizaje práctico
              y la formación de futuros profesionales de la salud.
            </p>
          </div>

          {/* TARJETA 3 */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 dark:border-purple-800/60 dark:bg-[#342044]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <ClockIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-gray-800 dark:text-purple-100">
              Tu opinión importa
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-purple-200/70">
              Comparte tus ideas para ayudarnos a mejorar CLIRA.
            </p>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-lg dark:border-purple-800/50 dark:bg-[#211936] dark:shadow-purple-950/20 md:p-10">
            {!submitted ? (
              <>
                <div className="mb-8">
                  <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-purple-300">
                    Formulario de contacto
                  </span>
                  <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-purple-100">
                    Envíanos un mensaje
                  </h2>
                  <p className="mt-2 text-gray-500 dark:text-purple-200/70">
                    Completa los siguientes campos para compartir
                    tus dudas, ideas o sugerencias.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelStyles}>
                        Nombre completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Escribe tu nombre"
                        className={inputStyles}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelStyles}>
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="correo@ejemplo.com"
                        className={inputStyles}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelStyles}>
                      Asunto
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="¿Sobre qué quieres hablar?"
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelStyles}>
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Escribe aquí tu mensaje..."
                      className={`${inputStyles} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 dark:shadow-purple-950/30 md:w-auto"
                  >
                    Enviar mensaje
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>

                  <p className="text-xs text-gray-400 dark:text-purple-300/60">
                    Formulario de demostración. Los mensajes todavía
                    no se envían ni se almacenan.
                  </p>
                </form>
              </>
            ) : (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-purple-900/50">
                  <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-purple-300" />
                </div>

                <h2 className="mt-6 text-3xl font-bold text-gray-800 dark:text-purple-100">
                  ¡Gracias por escribirnos!
                </h2>

                <p className="mt-4 max-w-md leading-relaxed text-gray-500 dark:text-purple-200/70">
                  Tu mensaje se ha procesado en esta demostración.
                  Cuando implementemos el envío de correos,
                  podrás contactar directamente con el equipo CLIRA.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Enviar otro mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MENSAJE FINAL */}
      <section className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-8 text-center dark:border-purple-800/50 dark:bg-[#211936]">
        <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100">
          Aprender, practicar y mejorar.
        </h3>
        <p className="mt-2 text-gray-500 dark:text-purple-200/70">
          CLIRA: impulsando nuevas formas de aprender medicina.
        </p>
      </section>
    </div>
  );
};

export default ContactView;
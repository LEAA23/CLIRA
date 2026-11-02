import {
  AcademicCapIcon,
  BeakerIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  CubeTransparentIcon,
  HeartIcon,
  LightBulbIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Casos clínicos",
    description:
      "Explora casos médicos organizados por especialidad, dificultad y características del paciente. Cada escenario representa una oportunidad para aplicar tus conocimientos y analizar diferentes situaciones clínicas.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Simulación interactiva",
    description:
      "Interactúa con escenarios clínicos y visualiza un paciente tridimensional. Examina la información disponible y desarrolla tu razonamiento mediante una experiencia práctica.",
    icon: CubeTransparentIcon,
  },
  {
    title: "Evaluación y retroalimentación",
    description:
      "Al terminar una simulación, revisa tu diagnóstico y las decisiones que tomaste. Identifica tus aciertos y reconoce las áreas en las que puedes mejorar.",
    icon: BeakerIcon,
  },
  {
    title: "Seguimiento del progreso",
    description:
      "Consulta tus casos completados, pendientes y resultados. Observa tu evolución y utiliza tus avances para identificar nuevas oportunidades de aprendizaje.",
    icon: ChartBarIcon,
  },
];

const steps = [
  "Selecciona un caso clínico.",
  "Explora los datos y antecedentes del paciente.",
  "Solicita estudios y analiza la información disponible.",
  "Formula un diagnóstico de acuerdo con tu razonamiento clínico.",
  "Consulta tu evaluación y aprende de tus resultados.",
];

const AboutView = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Presentación principal */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700 px-7 py-14 text-white shadow-xl md:px-12 md:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
              Innovación en educación médica
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Conoce
              <span className="block text-cyan-300">CLIRA</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-blue-100 md:text-lg">
              Una plataforma de simulación clínica diseñada para
              complementar la formación de los estudiantes de medicina,
              permitiéndoles practicar, analizar escenarios médicos y
              fortalecer sus habilidades para la toma de decisiones.
            </p>

            <Link
              to="/auth/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-cyan-100"
            >
              Conoce CLIRA
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="flex aspect-square w-full max-w-xs flex-col items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm md:max-w-sm">
              <HeartIcon className="h-28 w-28 text-cyan-300 md:h-36 md:w-36" />
              <p className="mt-5 text-4xl font-extrabold tracking-[0.25em]">
                CLIRA
              </p>
              <p className="mt-3 text-center text-xs tracking-[0.2em] text-blue-100 md:text-sm">
                APRENDER · SIMULAR · MEJORAR
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Descripción de CLIRA */}
      <section className="mx-auto max-w-5xl px-2 py-16 md:py-20">
        <div className="text-center">
          <span className="font-semibold uppercase tracking-widest text-blue-600">
            Nuestra plataforma
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-800 md:text-4xl">
            ¿Qué es CLIRA?
          </h2>

          <div className="mt-8 space-y-5 text-left text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">
            <p>
              CLIRA es una aplicación web enfocada en el aprendizaje
              práctico de la medicina mediante simulaciones clínicas
              interactivas. Su objetivo es ofrecer a los estudiantes un
              espacio donde puedan poner en práctica sus conocimientos
              teóricos, analizar escenarios médicos y tomar decisiones
              relacionadas con la atención de un paciente.
            </p>

            <p>
              A través de casos clínicos, visualización tridimensional,
              consulta de información del paciente y evaluación de
              resultados, la plataforma busca fortalecer el razonamiento
              clínico en un entorno de aprendizaje controlado. Los
              estudiantes pueden practicar a su propio ritmo, revisar
              sus decisiones y reconocer los aspectos que necesitan
              reforzar.
            </p>

            <p>
              CLIRA también permite dar seguimiento al desempeño del
              estudiante mediante indicadores de progreso. De esta
              manera, cada simulación se convierte en una oportunidad
              para aprender, identificar errores y mejorar continuamente.
            </p>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="rounded-3xl bg-slate-100 px-5 py-16 md:px-10 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Funcionalidades
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-800 md:text-4xl dark:text-white">
              Herramientas para aprender haciendo
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              CLIRA integra distintas herramientas que acompañan al
              estudiante durante todo el proceso de simulación clínica.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/50">
                    <Icon className="h-8 w-8 text-blue-700 dark:text-blue-300" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proceso de simulación */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-2 py-16 md:grid-cols-2 md:py-20">
        <div>
          <span className="font-semibold uppercase tracking-widest text-blue-600">
            Experiencia de aprendizaje
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-800 md:text-4xl dark:text-white">
            ¿Cómo funciona una simulación?
          </h2>

          <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">
            La experiencia comienza con la selección de un caso clínico.
            A partir de ese momento, el estudiante explora la información
            del paciente, consulta sus antecedentes, revisa los estudios
            disponibles y analiza los datos necesarios para formular un
            diagnóstico.
          </p>

          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
            Al concluir, puede consultar la evaluación de su desempeño
            y utilizar la retroalimentación para reconocer sus fortalezas
            y mejorar sus futuras prácticas.
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-blue-800 to-cyan-600 p-7 text-white shadow-xl md:p-9">
          <h3 className="mb-7 text-2xl font-bold">
            Tu recorrido en CLIRA
          </h3>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="pt-2 leading-6">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propósito */}
      <section className="rounded-3xl bg-blue-50 px-6 py-16 text-center dark:bg-slate-900 md:px-12">
        <LightBulbIcon className="mx-auto h-14 w-14 text-blue-600" />

        <h2 className="mt-5 text-3xl font-bold text-slate-800 dark:text-white">
          Nuestro propósito
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">
          Buscamos complementar la formación académica de los estudiantes
          de medicina mediante una herramienta que facilite el acceso a
          experiencias de práctica clínica. Queremos fomentar el
          razonamiento, la toma de decisiones y el aprendizaje continuo,
          ofreciendo un entorno donde cada simulación represente una
          oportunidad para adquirir experiencia y mejorar.
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-3">
          <div>
            <AcademicCapIcon className="mx-auto h-11 w-11 text-blue-600" />
            <h3 className="mt-3 font-bold text-slate-800 dark:text-white">
              Aprendizaje
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Aplicar y fortalecer los conocimientos médicos.
            </p>
          </div>

          <div>
            <UserGroupIcon className="mx-auto h-11 w-11 text-blue-600" />
            <h3 className="mt-3 font-bold text-slate-800 dark:text-white">
              Desarrollo
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Impulsar las habilidades de los estudiantes.
            </p>
          </div>

          <div>
            <ChartBarIcon className="mx-auto h-11 w-11 text-blue-600" />
            <h3 className="mt-3 font-bold text-slate-800 dark:text-white">
              Mejora continua
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Identificar avances y oportunidades de mejora.
            </p>
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="px-4 py-16 text-center">
        <HeartIcon className="mx-auto h-12 w-12 text-blue-600" />

        <h2 className="mt-5 text-2xl font-bold text-slate-800 md:text-3xl dark:text-white">
          Tu aprendizaje, una experiencia más práctica.
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
          Descubre una nueva forma de practicar, analizar casos clínicos
          y fortalecer tus habilidades.
        </p>

        <Link
          to="/auth/login"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Volver al inicio de sesión
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
};

export default AboutView;
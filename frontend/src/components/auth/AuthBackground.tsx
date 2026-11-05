
const pulsePath =
  "M 0 350 H 120 L 155 350 L 180 310 L 205 390 L 235 155 L 265 350 H 430 L 465 350 L 490 310 L 515 390 L 545 155 L 575 350 H 740 L 775 350 L 800 310 L 825 390 L 855 155 L 885 350 H 1020 L 1055 350 L 1080 310 L 1105 390 L 1135 155 L 1165 350 H 1440";

const AuthBackground = () => {
  return (
    <div className="auth-background" aria-hidden="true">

      {/* Decoraciones del modo claro */}
      <div className="auth-background__medical">

        <span className="auth-medical auth-medical--cross auth-medical--one" />
        <span className="auth-medical auth-medical--pill auth-medical--two" />
        <span className="auth-medical auth-medical--cross auth-medical--three" />
        <span className="auth-medical auth-medical--pill auth-medical--four" />
        <span className="auth-medical auth-medical--cross auth-medical--five" />
        <span className="auth-medical auth-medical--pill auth-medical--six" />
        <span className="auth-medical auth-medical--ring auth-medical--seven" />
        <span className="auth-medical auth-medical--pulse auth-medical--eight" />
        <span className="auth-medical auth-medical--cross auth-medical--nine" />
        <span className="auth-medical auth-medical--pill auth-medical--ten" />
        <span className="auth-medical auth-medical--ring auth-medical--eleven" />
        <span className="auth-medical auth-medical--pulse auth-medical--twelve" />

      </div>

      {/* Cuadrícula del modo oscuro */}
      <div className="auth-background__grid" />

      {/* Resplandor del monitor */}
      <div className="auth-background__glow" />

      {/* Monitor de signos vitales */}
      <svg
        className="auth-background__ecg"
        viewBox="0 0 2880 700"
        preserveAspectRatio="none"
      >

        <defs>
          <linearGradient id="clira-ecg-gradient">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>

        <g className="auth-background__ecg-lines">

          <path d={pulsePath} />

          <path
            d={pulsePath}
            transform="translate(1440 0)"
          />

        </g>

        <g className="auth-background__ecg-secondary">
          <path
            d={pulsePath}
            transform="translate(0 170)"
          />
          <path
            d={pulsePath}
            transform="translate(1440 170)"
          />
        </g>

      </svg>

    </div>
  );
};

export default AuthBackground;
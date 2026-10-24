
import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { changePasswordAccount } from "../../api/authApi";

type Preferences = {
  emailNotifications: boolean;
  darkMode: boolean;
  showRanking: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  emailNotifications: true,
  darkMode: false,
  showRanking: true,
};

const SettingsView = () => {
  const user = useAppStore((state) => state.user);

  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);

  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem("CLIRA_PREFERENCES");

      if (storedPreferences) {
        const parsed = JSON.parse(storedPreferences);

        setPreferences({
          emailNotifications:
            typeof parsed.emailNotifications === "boolean"
              ? parsed.emailNotifications
              : DEFAULT_PREFERENCES.emailNotifications,
          darkMode:
            typeof parsed.darkMode === "boolean"
              ? parsed.darkMode
              : DEFAULT_PREFERENCES.darkMode,
          showRanking:
            typeof parsed.showRanking === "boolean"
              ? parsed.showRanking
              : DEFAULT_PREFERENCES.showRanking,
        });
      }
    } catch {
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      preferences.darkMode
    );
  }, [preferences.darkMode]);

  const updatePreference = (key: keyof Preferences) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));

    setSaved(false);
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(
        "CLIRA_PREFERENCES",
        JSON.stringify(preferences)
      );

      setSaved(true);
    } catch {
      setSaved(false);
      window.alert("No se pudieron guardar las preferencias.");
    }
  };

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
        !passwords.currentPassword ||
        !passwords.newPassword ||
        !passwords.repeatPassword
    ) {
        window.alert("Completa todos los campos.");
        return;
    }

    if (passwords.newPassword.length < 8) {
        window.alert(
            "La nueva contraseña debe tener al menos 8 caracteres."
        );
        return;
    }

    if (passwords.newPassword !== passwords.repeatPassword) {
        window.alert("Las contraseñas nuevas no coinciden.");
        return;
    }

    try {
        const message = await changePasswordAccount({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        });

        window.alert(message);

        setPasswords({
            currentPassword: "",
            newPassword: "",
            repeatPassword: ""
        });

        setShowPasswordForm(false);
    } catch (error) {
        window.alert(
            error instanceof Error
                ? error.message
                : "No se pudo cambiar la contraseña."
        );
    }
  };

  const Toggle = ({
    checked,
    onClick,
    label,
  }: {
    checked: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-slate-800 dark:bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-full bg-slate-50 px-4 py-8 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">
            Configuración
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Personaliza tu cuenta y tus preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Perfil y preferencias */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold">
              Perfil
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Nombre completo
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={`${user.name ?? ""} ${user.lastName ?? ""}`.trim()}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  value={user.email ?? ""}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="mt-7">
              <h2 className="mb-5 text-lg font-bold">
                Preferencias
              </h2>

              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Notificaciones por correo
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Recibir avisos sobre nuevos casos
                    </p>
                  </div>

                  <Toggle
                    checked={preferences.emailNotifications}
                    onClick={() =>
                      updatePreference("emailNotifications")
                    }
                    label="Notificaciones por correo"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Modo oscuro
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Cambiar la apariencia de la plataforma
                    </p>
                  </div>

                  <Toggle
                    checked={preferences.darkMode}
                    onClick={() => updatePreference("darkMode")}
                    label="Modo oscuro"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Mostrar mi posición en ranking
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Permitir que otros vean mi posición
                    </p>
                  </div>

                  <Toggle
                    checked={preferences.showRanking}
                    onClick={() => updatePreference("showRanking")}
                    label="Mostrar mi posición en ranking"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-6 text-lg font-bold">
              Seguridad
            </h2>

            <p className="text-sm font-semibold">
              Contraseña
            </p>

            <p className="mt-2 text-sm tracking-widest text-slate-400">
              ••••••••••••
            </p>

            <button
              type="button"
              onClick={() => setShowPasswordForm((value) => !value)}
              className="mt-5 w-full rounded-lg border border-slate-400 px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              {showPasswordForm
                ? "Cancelar"
                : "Cambiar contraseña"}
            </button>

            {showPasswordForm && (
              <form
                onSubmit={handlePasswordChange}
                className="mt-5 space-y-3"
              >
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Contraseña actual"
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: event.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nueva contraseña"
                  value={passwords.newPassword}
                  onChange={(event) =>
                    setPasswords({
                      ...passwords,
                      newPassword: event.target.value,
                    })
                  }
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirmar contraseña"
                  value={passwords.repeatPassword}
                  onChange={(event) =>
                    setPasswords({
                      ...passwords,
                      repeatPassword: event.target.value,
                    })
                  }
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <p className="text-xs text-amber-700 dark:text-amber-400">
                  El cambio de contraseña todavía necesita conectarse
                  al backend.
                </p>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Continuar
                </button>
              </form>
            )}

            <div className="mt-8">
              <p className="text-sm font-semibold">
                Sesiones activas
              </p>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Sesión actual
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Administrada mediante tu inicio de sesión actual
              </p>

              <button
                type="button"
                disabled
                title="Esta función requiere soporte de sesiones en el backend"
                className="mt-6 w-full cursor-not-allowed rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-400 dark:border-slate-700"
              >
                Cerrar otras sesiones
              </button>

              <p className="mt-2 text-xs text-slate-400">
                Disponible cuando se implemente la administración
                de sesiones en el backend.
              </p>
            </div>
          </section>
        </div>

        {/* Guardar preferencias */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={savePreferences}
            className="rounded-lg bg-slate-800 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Guardar cambios
          </button>

          {saved && (
            <p
              role="status"
              className="text-sm text-green-700 dark:text-green-400"
            >
              Preferencias guardadas en este navegador.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

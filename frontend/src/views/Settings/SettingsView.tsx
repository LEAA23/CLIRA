import { useEffect, useState, type FormEvent } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { changePasswordAccount } from "../../api/authApi";
import {
  getUserById,
  updateProfileImage,
} from "../../api/userApi";
import {
  ArrowUpTrayIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/16/solid";

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

const loadPreferences = (): Preferences => {
  try {
    const stored = localStorage.getItem("CLIRA_PREFERENCES");

    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored);

    return {
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
    };
  } catch (error) {
    console.error(
      "Error al cargar las preferencias:",
      error
    );

    return DEFAULT_PREFERENCES;
  }
};

const SettingsView = () => {
  const user = useAppStore((state) => state.user);

  const [preferences, setPreferences] =
    useState<Preferences>(loadPreferences);

  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  // Datos de la foto de perfil
  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [savingPhoto, setSavingPhoto] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(true);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  // Cargar la foto actual del usuario autenticado.
  useEffect(() => {
    const userId = user.id;
    let active = true;

    const loadProfileImage = async () => {
      if (typeof userId !== "number") {
        setLoadingPhoto(false);
        return;
      }

      setLoadingPhoto(true);

      try {
        const profile = await getUserById(userId);

        if (active) {
          setProfileImage(profile?.profileImage ?? null);
        }
      } catch (error) {
        console.error(
          "No se pudo cargar la foto de perfil:",
          error
        );
      } finally {
        if (active) {
          setLoadingPhoto(false);
        }
      }
    };

    void loadProfileImage();

    return () => {
      active = false;
    };
  }, [user.id]);

  // Crear y liberar la vista previa de la imagen seleccionada.
  useEffect(() => {
    if (!selectedPhoto) {
      setPhotoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedPhoto);

    setPhotoPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedPhoto]);

  // Aplicar el tema seleccionado.
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
    } catch (error) {
      console.error(
        "No se pudieron guardar las preferencias:",
        error
      );

      setSaved(false);
      window.alert(
        "No se pudieron guardar las preferencias."
      );
    }
  };

  // Seleccionar una nueva foto.
  const handlePhotoSelection = (
    event: FormEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert(
        "Selecciona un archivo de imagen válido."
      );

      input.value = "";
      setSelectedPhoto(null);
      return;
    }

    setSelectedPhoto(file);
  };

  // Guardar la foto en el servidor.
  const saveProfilePhoto = async () => {
    const userId = user.id;

    if (typeof userId !== "number") {
      window.alert(
        "No se pudo identificar al usuario. Inicia sesión nuevamente."
      );
      return;
    }

    if (!selectedPhoto) {
      window.alert("Selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();

    formData.append("image", selectedPhoto);

    setSavingPhoto(true);

    try {
      await updateProfileImage({
        id: userId,
        formData,
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la foto de perfil."
      );

      setSavingPhoto(false);
      return;
    }

    // La imagen ya fue subida. Consultar su URL actualizada.
    try {
      const updatedProfile = await getUserById(userId);

      setProfileImage(
        updatedProfile?.profileImage ?? null
      );

      setSelectedPhoto(null);

      window.alert(
        "Foto de perfil actualizada correctamente."
      );
    } catch (error) {
      console.error(
        "La imagen se subió, pero no se pudo actualizar su vista:",
        error
      );

      setSelectedPhoto(null);

      window.alert(
        "La imagen se guardó, pero no se pudo actualizar la vista previa. Recarga la página para ver los cambios."
      );
    } finally {
      setSavingPhoto(false);
    }
  };

  // Cambiar contraseña.
  const handlePasswordChange = async (
    event: FormEvent<HTMLFormElement>
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

    if (
      passwords.newPassword !== passwords.repeatPassword
    ) {
      window.alert(
        "Las contraseñas nuevas no coinciden."
      );
      return;
    }

    try {
      const message = await changePasswordAccount({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      window.alert(message);

      setPasswords({
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
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

  // Interruptor reutilizable para las preferencias.
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
        checked
          ? "bg-slate-800 dark:bg-blue-500"
          : "bg-slate-300 dark:bg-slate-600"
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
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">
            Configuración
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Personaliza tu cuenta y tus preferencias.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Perfil y preferencias */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold">
              Perfil
            </h2>

            {/* Editor de foto */}
            <div className="mb-7 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800 sm:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-slate-200 dark:bg-slate-700 dark:ring-slate-600">
                {photoPreview || profileImage ? (
                  <img
                    src={photoPreview || profileImage || ""}
                    alt="Vista previa de la foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : loadingPhoto ? (
                  <span className="text-xs text-slate-400">
                    Cargando...
                  </span>
                ) : (
                  <UserCircleIcon className="h-full w-full text-slate-400" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="font-semibold">
                  Foto de perfil
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Elige una imagen para personalizar tu cuenta.
                </p>

                <label
                  htmlFor="profile-photo"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition hover:bg-white dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  Seleccionar imagen
                </label>

                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoSelection}
                />

                {selectedPhoto && (
                  <p className="mt-2 break-all text-xs text-slate-500 dark:text-slate-400">
                    Archivo: {selectedPhoto.name}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => void saveProfilePhoto()}
                disabled={!selectedPhoto || savingPhoto}
                className="w-full shrink-0 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
              >
                {savingPhoto ? "Guardando..." : "Guardar foto"}
              </button>
            </div>

            {/* Información del usuario */}
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

            {/* Preferencias */}
            <div className="mt-8">
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
                      Recibir avisos sobre nuevos casos.
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
                      Cambiar la apariencia de la plataforma.
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
                      Preferencia de visibilidad en el ranking.
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

          {/* Seguridad: sin sesiones activas */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
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
              onClick={() =>
                setShowPasswordForm((value) => !value)
              }
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
                    setPasswords((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
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
                    setPasswords((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
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
                    setPasswords((current) => ({
                      ...current,
                      repeatPassword: event.target.value,
                    }))
                  }
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Continuar
                </button>
              </form>
            )}

            <div className="mt-8 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />

                <p className="text-sm font-semibold">
                  Protección de la cuenta
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Mantén tu contraseña segura y no la compartas
                con otras personas.
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
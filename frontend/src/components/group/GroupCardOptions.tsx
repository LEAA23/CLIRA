import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from "@headlessui/react";

import {
    EllipsisVerticalIcon,
    PencilIcon,
    TrashIcon,
    UserGroupIcon
} from "@heroicons/react/16/solid";

import { useAppStore } from "../../stores/useAppStore";
import { useLocation, useNavigate } from "react-router-dom";

type GroupCardOptionsProps = {
    id: number;
};

const GroupCardOptions = ({ id }: GroupCardOptionsProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppStore(state => state.user);

    if (user.rol !== "teacher") {
        return null;
    }

    return (
        <Menu as="div" className="relative">
            <MenuButton
                type="button"
                aria-label="Opciones del grupo"
                className="p-2 rounded-full text-gray-500
                hover:bg-gray-100 dark:hover:bg-gray-700
                hover:text-blue-600 transition"
            >
                <EllipsisVerticalIcon className="h-6 w-6" />
            </MenuButton>

            <MenuItems
                anchor="bottom end"
                className="z-30 min-w-52 bg-white dark:bg-gray-800
                border border-gray-100 dark:border-gray-700
                p-2 rounded-xl shadow-xl outline-none"
            >
                <MenuItem>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                location.pathname +
                                `?EditGroupModal=true&Group=${id}`
                            )
                        }
                        className="flex w-full items-center gap-3 p-3
                        rounded-lg text-gray-700 dark:text-gray-200
                        data-[focus]:bg-blue-50 dark:data-[focus]:bg-gray-700"
                    >
                        <PencilIcon className="h-5 w-5" />
                        Editar grupo
                    </button>
                </MenuItem>

                <MenuItem>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                location.pathname +
                                `?MembersModal=true&Group=${id}`
                            )
                        }
                        className="flex w-full items-center gap-3 p-3
                        rounded-lg text-gray-700 dark:text-gray-200
                        data-[focus]:bg-blue-50 dark:data-[focus]:bg-gray-700"
                    >
                        <UserGroupIcon className="h-5 w-5" />
                        Administrar integrantes
                    </button>
                </MenuItem>

                <MenuItem>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                location.pathname +
                                `?DeleteGroupModal=true&Group=${id}`
                            )
                        }
                        className="flex w-full items-center gap-3 p-3
                        rounded-lg text-red-600
                        data-[focus]:bg-red-50 dark:data-[focus]:bg-red-900/20"
                    >
                        <TrashIcon className="h-5 w-5" />
                        Eliminar grupo
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};

export default GroupCardOptions;
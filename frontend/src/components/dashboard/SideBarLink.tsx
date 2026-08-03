import { NavLink } from "react-router-dom";

type SideBarLinkProps = {
    url: string;
    text: string;
    icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
                title?: string;
                titleId?: string;
            } & React.RefAttributes<SVGSVGElement>>
}

const SideBarLink = ( { url, text, icon : Icon } : SideBarLinkProps ) => {
  return (
    <>
        <NavLink to={url}>
            {({ isActive }) => (
                <div
                    className={`group relative text-xs overflow-hidden cursor-pointer rounded-sm px-1 py-2 -ml-3 ${
                        isActive
                        ? "border-l-6 border-l-white font-bold text-blue-700"
                        : "text-white font-medium"
                    }`}
                >
                    <span
                        className={`absolute inset-0 origin-left transition-transform duration-300 ${
                        isActive
                            ? "bg-white/70 scale-x-100"
                            : "bg-white/20 scale-x-0 group-hover:scale-x-100"
                        }`}
                    />

                    <div className="relative z-10 flex items-center gap-2">
                        <Icon className="h-6"/>
                        {text}
                    </div>
                </div>
            )}
        </NavLink>
    </>
  )
}

export default SideBarLink
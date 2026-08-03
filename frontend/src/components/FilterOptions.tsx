import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

type FilterOptionsProps ={
    startedFilters: boolean;
}

const FilterOptions = ({startedFilters} : FilterOptionsProps) => {
  return (
    <div className="flex w-full justify-center">
        <div className="flex flex-col md:flex-row items-center gap-3">
            <p className="font-bold text-gray-500 md:mr-3">Filtros:</p>
            {startedFilters? (
                <>
                    <Popover>
                        <PopoverButton 
                        className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                        data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                        >
                        Estado
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                        [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Insights</p>
                            <p className="text-black">Measure actions your users take</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Automations</p>
                            <p className="text-black">Create your own targeted content</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Reports</p>
                            <p className="text-black">Keep track of your growth</p>
                            </a>
                        </div>
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Documentation</p>
                            <p className="text-black">Start integrating products and tools</p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Popover>

                    <Popover>
                        <PopoverButton 
                        className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                        data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                        >
                        Calificaci&oacute;n
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                        [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Insights</p>
                            <p className="text-black">Measure actions your users take</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Automations</p>
                            <p className="text-black">Create your own targeted content</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Reports</p>
                            <p className="text-black">Keep track of your growth</p>
                            </a>
                        </div>
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Documentation</p>
                            <p className="text-black">Start integrating products and tools</p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Popover>

                    <Popover>
                        <PopoverButton 
                        className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                        data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                        >
                        Fecha
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                        [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Insights</p>
                            <p className="text-black">Measure actions your users take</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Automations</p>
                            <p className="text-black">Create your own targeted content</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Reports</p>
                            <p className="text-black">Keep track of your growth</p>
                            </a>
                        </div>
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Documentation</p>
                            <p className="text-black">Start integrating products and tools</p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Popover>
                </>
            ): (
                <>
                    <Popover>
                        <PopoverButton 
                        className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                        data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                        >
                        Completados
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                        [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Insights</p>
                            <p className="text-black">Measure actions your users take</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Automations</p>
                            <p className="text-black">Create your own targeted content</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Reports</p>
                            <p className="text-black">Keep track of your growth</p>
                            </a>
                        </div>
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Documentation</p>
                            <p className="text-black">Start integrating products and tools</p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Popover>

                    <Popover>
                        <PopoverButton 
                        className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                        data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                        >
                        Extremidad
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                        [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Insights</p>
                            <p className="text-black">Measure actions your users take</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Automations</p>
                            <p className="text-black">Create your own targeted content</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Reports</p>
                            <p className="text-black">Keep track of your growth</p>
                            </a>
                        </div>
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Documentation</p>
                            <p className="text-black">Start integrating products and tools</p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Popover>

                    <Popover>
                        <PopoverButton 
                        className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                        data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                        >
                        Paciente
                        </PopoverButton>

                        <PopoverPanel
                        transition
                        anchor="bottom"
                        className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                        [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                        >
                        <div className="p-3">
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Insights</p>
                            <p className="text-black">Measure actions your users take</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Automations</p>
                            <p className="text-black">Create your own targeted content</p>
                            </a>
                            <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                            <p className="font-semibold text-gray-400">Reports</p>
                            <p className="text-black">Keep track of your growth</p>
                            </a>
                        </div>
                        </PopoverPanel>
                    </Popover>


                    
                </>
            )}
            
            <Popover>
                <PopoverButton 
                className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 
                data-focus:outline data-focus:outline-white data-hover:text-blue-500"
                >
                Dificultad
                </PopoverButton>

                <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
                [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                >
                <div className="p-3">
                    <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-gray-400">Insights</p>
                    <p className="text-black">Measure actions your users take</p>
                    </a>
                    <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-gray-400">Automations</p>
                    <p className="text-black">Create your own targeted content</p>
                    </a>
                    <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-gray-400">Reports</p>
                    <p className="text-black">Keep track of your growth</p>
                    </a>
                </div>
                </PopoverPanel>
            </Popover>
        </div>
    </div>
  )
}

export default FilterOptions
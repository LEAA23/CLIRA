import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { QuestionMarkCircleIcon, ChartPieIcon, BeakerIcon } from "@heroicons/react/16/solid";

const MedicalHistoryOptions = () => {
  return (
    <>
        <Popover>
            <PopoverButton 
            className="text-sm/6 font-bold text-gray-500 bg-white shadow hover:shadow-xl hover:-translate-y-1 transition-all 
            duration-200 p-5 rounded-2xl max-w-full focus:outline-none data-active:text-blue-500 data-focus:outline 
            data-focus:outline-white data-hover:text-blue-500 flex justify-start items-center gap-x-5 cursor-pointer"
            >
                <QuestionMarkCircleIcon className="text-orange-400 h-8"/>
                Hacer preguntas al paciente
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
            className="text-sm/6 font-bold text-gray-500 bg-white shadow hover:shadow-xl hover:-translate-y-1 transition-all 
            duration-200 p-5 rounded-2xl max-w-full focus:outline-none data-active:text-blue-500 data-focus:outline 
            data-focus:outline-white data-hover:text-blue-500 flex justify-start items-center gap-x-5 cursor-pointer"
            >
                <ChartPieIcon className="text-green-400 h-8"/>
                Tomar metricas corporales
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
            className="text-sm/6 font-bold text-gray-500 bg-white shadow hover:shadow-xl hover:-translate-y-1 transition-all 
            duration-200 p-5 rounded-2xl max-w-full focus:outline-none data-active:text-blue-500 data-focus:outline 
            data-focus:outline-white data-hover:text-blue-500 flex justify-start items-center gap-x-5 cursor-pointer"
            >
                <BeakerIcon className="text-purple-400 h-8"/>
                Realizar estudios especiales
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
  )
}

export default MedicalHistoryOptions;
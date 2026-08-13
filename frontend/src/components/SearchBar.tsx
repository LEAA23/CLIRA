import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import FilterOptions from "./FilterOptions";

type SearchBarProps = {
  pendingCases: boolean;
  filters: boolean
}

const SearchBar = ({pendingCases, filters} : SearchBarProps) => {
    //state local para identificar cuanod el usuario esta escribiendo en el input de buscar
    const [isWriting, setIsWriting] = useState(false);
    //State local para identificar cuando el filter esta activo y asi poder desplegarlo
    const [isFiltersActive, setIsFiltersActive] = useState(false);

    const handleChange = () => setIsWriting(true);
    const handleClick = () => setIsFiltersActive( prevValue => !prevValue );
  return (
      
    <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch md:justify-start gap-x-3">
        {filters && (
          <div className="bg-white rounded-lg shadow mb-5 md:mb-10 w-12 md:w-auto aspect-square flex justify-center items-center cursor-pointer">
            <button
              onClick={handleClick}
            >
              <AdjustmentsHorizontalIcon
                className="text-gray-400 w-8 hover:text-blue-500 cursor-pointer"
              />
            </button>
          </div>
        )}
        {isFiltersActive && (
          <div className="bg-white rounded-lg shadow mb-10 p-5">
            <FilterOptions
              startedFilters={pendingCases}
            />
          </div>
        )}

        <div className={`bg-white ${filters? "md:max-w-1/4" : "w-full"} rounded-lg shadow mb-10`}>
          <form
            className="flex justify-between items-center"
          >
            <input 
              type="text"
              onChange={handleChange}
              placeholder="Buscar simulacion clinica" 
              className="focus:outline-none p-5 w-full"
            />
            <button
              type="button" 
              className="mx-5 cursor-pointer"
            >
              <MagnifyingGlassIcon 
                className={`w-8 ${isWriting? "text-blue-500" : "text-gray-400 hover:text-blue-500 "}`}
              />
            </button>
          </form>
        </div>

    </div>
  )
}

export default SearchBar;
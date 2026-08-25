import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import FilterOptions from "./FilterOptions";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type SearchBarProps = {
  pendingCases: boolean;
  filters: boolean;
  inputType: string;
  inputName: string;
  placeholder: string;
  fn: (formData: any) => void;
}

const SearchBar = ({pendingCases, filters, inputType, inputName, placeholder, fn} : SearchBarProps) => {
    //State local para identificar cuando el filter esta activo y asi poder desplegarlo
    const [isFiltersActive, setIsFiltersActive] = useState(false);

    const handleClick = () => setIsFiltersActive( prevValue => !prevValue );

    const { register, reset, formState: { errors }, handleSubmit } = useForm();

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
            noValidate
            onSubmit={ handleSubmit(fn) }
          >
            <input 
              type={ inputType }
              placeholder={ placeholder }
              className="focus:outline-none p-5 w-full"
              {...register(inputName, {
                required: "El email es obligatorio",
                pattern: {
                  value:  /\S+@\S+\.\S+/,
                  message: "E-mail no valido"
                }
              })}
            />
            <button
              type="submit" 
              className="mx-5 cursor-pointer"
            >
              <MagnifyingGlassIcon 
                className="w-8 text-gray-400 hover:text-blue-500 transition-all ease-in-out duration-200"
              />
            </button>
          </form>
          
          {errors[inputName] && (
            <ErrorMessage>{errors[inputName].message?.toString()}</ErrorMessage>
          )}
        </div>

    </div>
  )
}

export default SearchBar;
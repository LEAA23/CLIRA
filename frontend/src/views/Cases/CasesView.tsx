import { useNavigate } from "react-router-dom";
import CaseCard from "../../components/cases/CaseCard";
import PreviewCaseModal from "../../components/cases/PreviewCaseModal";
import SearchBar from "../../components/SearchBar";
import { PlusIcon } from "@heroicons/react/16/solid";
import CreateCaseModal from "../../components/cases/CreateCaseModal";

const CasesView = () => {

  const navigate = useNavigate();
  
  return (
    <>
      <h1 className="text-center font-bold text-5xl my-10 text-blue-500">Casos Clinicos</h1>

      <div className="flex justify-between items-center">
        <SearchBar
          pendingCases={false}
          filters={true}
          inputType="cambiarPorField"
          inputName="cambiarPorField"
          placeholder="Busca al usuario escribiendo su correo electronico"
          fn={ () => 1 }
        />

        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigate( location.pathname + "?CreateCase=true" ) }
            className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg hover:cursor-pointer 
            hover:transition-colors hover:bg-purple-600 w-full md:w-fit whitespace-nowrap flex justify-start items-center gap-x-2"
          >
            <PlusIcon className="h-6"/>
            Crear caso clinico
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <CaseCard
          started={false}
        />
        <CaseCard
          started={false}
        />
        <CaseCard
          started={false}
        />
        <CaseCard
          started={false}
        />
        <CaseCard
          started={false}
        />

      </div>

      <PreviewCaseModal
        started={false}
      />
      <CreateCaseModal/>
    </>
  )
}

export default CasesView;
import CaseCard from "../../components/cases/CaseCard"
import PreviewCaseModal from "../../components/cases/PreviewCaseModal"
import SearchBar from "../../components/SearchBar"

const ProgressView = () => {
  return (
    <>
      <h1 className="text-blue-500 text-center font-bold text-5xl my-10">Mi Progreso</h1>
      
      <SearchBar
        pendingCases={true}
        filters={true}
        inputType="cambiarPorField"
        inputName="cambiarPorField"
        placeholder="Busca al usuario escribiendo su correo electronico"
        fn={ () => 1 }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <CaseCard
          started={true}
        />
        <CaseCard
          started={true}
        />
        <CaseCard
          started={true}
        />
        <CaseCard
          started={true}
        />
        <CaseCard
          started={true}
        />

      </div>

      <PreviewCaseModal
        started={true}
      />

    </>
  )
}

export default ProgressView;
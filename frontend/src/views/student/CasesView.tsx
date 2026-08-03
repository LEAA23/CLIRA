import CaseCard from "../../components/cases/CaseCard";
import PreviewCaseModal from "../../components/cases/PreviewCaseModal";
import SearchBar from "../../components/SearchBar";

const CasesView = () => {
  
  return (
    <>
      <h1 className="text-center font-bold text-4xl my-10 text-blue-500">Casos Clinicos</h1>

      <SearchBar
        pendingCases={false}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
    </>
  )
}

export default CasesView;
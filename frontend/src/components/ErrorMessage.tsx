
const ErrorMessage = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="bg-red-300 border border-l-6 border-l-red-600 text-white uppercase font-bold p-2">{children}</div>
  )
}

export default ErrorMessage;
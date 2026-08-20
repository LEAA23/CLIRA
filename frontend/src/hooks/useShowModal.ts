import { useLocation } from "react-router-dom";


export const useShowModal = ( param : string ) => {
    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const createGroupParam = queryParams.get( param );
    const showModal = createGroupParam? true: false;
    return showModal;
}
// import {useAuth} from "../hooks/useAuth";
import { Navigate } from "react-router";
import Navbar from '../../../components/Navbar/Navbar';
import { useAuth0 } from "@auth0/auth0-react";

const Protected = ({children}) => {
    // const {user, loading} = useAuth()
const {isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
     if(isLoading){
        return (<main><h1>Loading...</h1></main>)
    }
    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default Protected;
import {createBrowserRouter} from "react-router";
import Protected from "./features/auth/components/Protected";
import Dashboard from "./features/interview/pages/Dashboard"; 
import Interview from "./features/interview/pages/Interview";
import Home from "./features/landing/pages/Home";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },{
    path: "/dashboard",
    element: <Protected><Dashboard/></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview/></Protected>  
  }
])
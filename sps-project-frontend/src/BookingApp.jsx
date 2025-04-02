import { Routes, Route } from "react-router-dom";
import { Fragment, Suspense, lazy } from "react";
import { CircularProgress } from "@mui/material";
import NavBare from "./UserReservation/Layout/NavBare";
import  LoginForm  from "./UserReservation/Auth/LoginForm";
import RegisterForm from "./UserReservation/Auth/RegisterForm";

const Test = lazy(() => import("./UserReservation/ChambreList"));
const ReservationForm = lazy(() => import("./UserReservation/pages/ReservationForm"));

function GradientCircularProgress() {
  return (
    <Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </Fragment>
  );
}

const BookingApp = () => {
  return (
    <Suspense
      fallback={
        <div className="modal-overlay-loaders ">
          
          <GradientCircularProgress />
          
        </div>
      }
    >
      <Routes>
        <Route path="/login"  element={<LoginForm/>}/>
          <Route path="/register"  element={<RegisterForm/>}/>
        <Route  path="/" element={<NavBare/>}  >
        <Route index element={<Test />} />
        <Route path="/reservation/" element={<ReservationForm />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BookingApp;

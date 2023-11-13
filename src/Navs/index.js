import React,{useContext} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Outlet, Navigate } from 'react-router-dom';
import LandingPage from '../components/pages/LandingPage';
import AuthenticationPage from '../components/pages/AuthenticationPage';
import CandidateOnboarding from '../components/candidate/CandidateOnboarding';
import CandidateProfile from '../components/candidate/CandidateProfile';
import CandidateJobs from '../components/candidate/CandidateJobs';
import CandidateApplications from '../components/candidate/CandidateApplications';
import CandidateConversations from '../components/candidate/CandidateConversation';
import EmployerOnboarding from '../components/pages/employerPages/EmployerOnboarding/index';
import EmployerProfile from '../components/pages/employerPages/EmployerProfile/index';
import EmployerJobs from '../components/pages/employerPages/EmployerJobs';
import EmployerConversations from '../components/pages/employerPages/EmployerConversations';
import EmployerHoc from '../HOC/EmployerHoc';
import CandidateHoc from '../HOC/CandidateHoc';
import EmployerApplicants from '../components/pages/employerPages/EmployerApplicants';
import { userContext } from '../context/userContext';

const Navs = () => {

    const [state,dispatch] = useContext(userContext);

    const user_auth = state?.isAuth;
    const user_type = state?.userInfo?.type;

    const ProtectedCandidateRoutes = () => {

        if (user_auth && user_type === 'candidate') {
            return <Outlet />;
        }
        else {
            return <Navigate to="/candidate/auth" />;
        }
    }

    const ProtectedEmployerRoutes = () => {

        if (user_auth && user_type === 'employer') {
            return <Outlet />;
        }
        else {
            return <Navigate to="/employer/auth" />;
        }
    }

    const OnBoardingProtectedRoutes = () => {
        if(user_auth){
            return <Outlet/>
        }else{
            return <Navigate to="/" />
        }
    }

    return (
        <Router>
            <Routes>

                <Route path="/" element={<LandingPage />} />
                <Route path="/candidate/auth" element={<AuthenticationPage type='candidate' />} />
                <Route path="/employer/auth" element={<AuthenticationPage type='employer' />} />

                <Route element = {<OnBoardingProtectedRoutes/>}>
                <Route path="/candidate/onboarding" element={<CandidateOnboarding />} />
                <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
                </Route>

                <Route element={<ProtectedCandidateRoutes />}>

                <Route path="/candidate/profile" element={<CandidateHoc><CandidateProfile /></CandidateHoc>} />
                <Route path="/candidate/jobs" element={<CandidateHoc><CandidateJobs /></CandidateHoc>} />
                <Route path="/candidate/applications" element={<CandidateHoc><CandidateApplications /></CandidateHoc>} />
                <Route path="/candidate/conversation" element={<CandidateHoc><CandidateConversations /></CandidateHoc>} />
                </Route>

                <Route element={<ProtectedEmployerRoutes />}>
                <Route path="/employer/profile" element={<EmployerHoc><EmployerProfile /></EmployerHoc>} />
                <Route path="/employer/jobs" element={<EmployerHoc><EmployerJobs /></EmployerHoc>} />
                <Route path="/employer/applicants" element={<EmployerHoc><EmployerApplicants /></EmployerHoc>} />
                <Route path="/employer/conversation" element={<EmployerHoc><EmployerConversations /></EmployerHoc>} />
                </Route>

            </Routes>
        </Router>
    )
}

export default Navs
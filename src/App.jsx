import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/AuthPages/LoginPage';
import IyteRegister from './Components/AuthPages/IyteRegister';
import CompanyRegister from './Components/AuthPages/CompanyRegister';
import ForgotPassword from './Components/AuthPages/ForgotPassword';
import ResetPassword from './Components/AuthPages/ResetPassword';
import StudentHomePage from './Components/StudentPages/StudentHomePage';
import CompanyHomePage from './Components/CompanyPages/CompanyHomePage';
import StaffHomePage from './Components/StaffPages/StaffHomePage';
import InternshipOpportunities from './Components/StudentPages/InternshipOpportunities';
import OpportunityDetail from './Components/StudentPages/OpportunityDetail';
import CreateInternshipAnnouncement from './Components/CompanyPages/CreateInternshipAnnouncement';
import ManageInternshipOpportunities from './Components/StaffPages/ManageInternshipOpportunities';
import ManageOpportunityDetails from './Components/StaffPages/ManageOpportunityDetails';
import ManageCompanies from './Components/StaffPages/ManageCompanies';
import ApprovedInternship from './Components/CompanyPages/ApprovedInternship';
import ApprovedApplication from './Components/StudentPages/ApprovedApplication';
import ApprovedInternshipDetail from './Components/CompanyPages/ApprovedInternshipDetail';
import SGKDetail from './Components/StaffPages/SGKDetail';
import SGK from './Components/StaffPages/SGK';
import ApplicationForm from './Components/CompanyPages/ApplicationForm';  
import ApplicationFormDetail from './Components/CompanyPages/ApplicationFormDetail';
import ApproveForms from './Components/StaffPages/ApproveForms';
import ApproveFormDetail from './Components/StaffPages/ApproveFormDetail';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/iyteregister" element={<IyteRegister/>} />
          <Route path="/companyregister" element={<CompanyRegister/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/resetpassword" element={<ResetPassword/>} />
          <Route path="/studenthomepage" element={<StudentHomePage/>} />
          <Route path="/companyhomepage" element={<CompanyHomePage/>} />
          <Route path="/staffhomepage" element={<StaffHomePage/>} />
          <Route path="/internshipopportunities" element={<InternshipOpportunities/>} />
          <Route path="/opportunitydetail/:offerid" element={<OpportunityDetail/>} />
          <Route path="/createinternshipannouncement" element={<CreateInternshipAnnouncement/>} />
          <Route path="/manageinternshipopportunities" element={<ManageInternshipOpportunities/>} />
          <Route path="/manageopportunitydetails/:offerid" element={<ManageOpportunityDetails/>} />
          <Route path="/managecompanies" element={<ManageCompanies/>} />
          <Route path="/approvedinternship" element={<ApprovedInternship/>} />
          <Route path="/approvedapplication" element={<ApprovedApplication/>} />
          <Route path="/approvedinternshipdetail/:applicationId" element={<ApprovedInternshipDetail/>} />
          <Route path="/sgk" element={<SGK/>} />
          <Route path="/sgkdetail/:applicationId" element={<SGKDetail/>} />
          <Route path="/applicationform" element={<ApplicationForm/>} />
          <Route path="*" element={<LoginPage/>} />
          <Route path="/" element={<LoginPage/>} />
          <Route path="/applicationformdetail/:applicationId" element={<ApplicationFormDetail/>} />
          <Route path="/approveforms" element={<ApproveForms/>} />
          <Route path="/approveformdetail/:applicationId" element={<ApproveFormDetail/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

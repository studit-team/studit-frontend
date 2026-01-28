import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Test from "./pages/Test.jsx";
import ConnectTest from "./pages/ConncetTest.jsx";
import StudyList from "./pages/study/StudyList.jsx";
import StudyDetail from "./pages/study/StudyLayout.jsx";
import StudyHome from "./pages/study/StudyHome.jsx";
import StudyLayout from "./pages/study/StudyLayout.jsx";
import StudyNotice from "./pages/study/StudyNotice.jsx";
import StudySchedule from "./pages/study/StudySchedule.jsx";
import StudyAssignment from "./pages/study/StudyAssignment.jsx";
import StudyFreeBoard from "./pages/study/StudyFreeBoard.jsx";
import SingupPage from "./pages/user/SingupPage.jsx";
import StudyCreatePage from "./pages/study/StudyCreatePage.jsx";

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/test" element={<Test />} />
        <Route exact path="/connect-test" element={<ConnectTest />} />
        <Route exact path="/study/list" element={<StudyList />} />
        <Route path="/study/create" element={<StudyCreatePage />} />
        <Route path="/study/:studyId" element={<StudyLayout />}>
          <Route index element={<StudyHome />} />
          <Route path="notice" element={<StudyNotice />} />
          <Route path="schedule" element={<StudySchedule />} />
          <Route path="assignment" element={<StudyAssignment />} />
          <Route path="free" element={<StudyFreeBoard />} />
        </Route>
        <Route exact path="/user/singup" element={<SingupPage />} />
      </Routes>
    </>
  );
}

export default App;

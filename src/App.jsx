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
import SingupPage from "./pages/user/SingupPage.jsx";

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

        <Route exact path="/user/singup" element={<SingupPage />} />
      </Routes>
    </>
  );
}

export default App;

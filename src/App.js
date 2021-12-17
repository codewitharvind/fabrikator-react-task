/*
#############################################################################
# Name : App.js
# Created by : Arvind Yadav
# Date       : 7th Dec 2021
# Purpose    : This file is used for routing and imports the pages.
#############################################################################
*/
import "./App.css";
import CreatePurchaseOrder from "./createPurchaseOrder";
import DisplayPurchaseOrder from "./displayPurchaseOrder";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    /*  <CreatePurchaseOrder />   */
    <Router>
      <Routes>
        <Route path="/" element={<CreatePurchaseOrder />} />
        <Route path="/purchase-details" element={<DisplayPurchaseOrder />} />
      </Routes>
    </Router>
  );
}

export default App;

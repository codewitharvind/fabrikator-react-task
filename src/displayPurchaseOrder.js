import React, {  } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DisplayPurchaseOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buttonHandler = () => {
    navigate("../", { replace: true });
  };
  return (
    <div>
      <div className="heading">
        <h4>Purchase Order Detail</h4>
        <div className="btn_group">
          <button className="btn" type="button" onClick={buttonHandler}>
            Back
          </button>
        </div>
      </div>
      <table>
        <tr>
          <td>Order No</td>
          <td>{location.state.order_no}</td>
        </tr>
        <tr>
          <td>Customer</td>
          <td>{location.state.customer}</td>
        </tr>
        <tr>
          <td>Order Date</td>
          <td>{location.state.order_date}</td>
        </tr>
        <tr>
          <td>Arrival Date</td>
          <td>{location.state.arrival_date}</td>
        </tr>
        <tr>
          <td>Note</td>
          <td>{location.state.note}</td>
        </tr>
      </table>
    </div>
  );
};

export default DisplayPurchaseOrder;

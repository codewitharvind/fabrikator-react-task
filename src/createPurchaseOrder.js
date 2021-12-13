/*
#############################################################################
# Name : createPurchaseOrder.js
# Created by : Arvind Yadav
# Date       : 7th Dec 2021
# Purpose    : This file is used for creating the purchase order and storing the data of purchase order
#############################################################################
*/
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

const CreatePurchaseOrder = () => {
  /* validationSchema function starts here this function is used for validating the purchase order form */
  const validationSchema = Yup.object().shape({
    supplier: Yup.string().required("Supplier is required"),
    quantity: Yup.string().required("Quantity is required"),
    product: Yup.string().required("Product is required"),
    reference: Yup.string().required("Reference is required"),
    note: Yup.string().required("Note is required"),
    orderDate: Yup.string()
      .required("Order Date is required")
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Order Date must be a valid date in the format YYYY-MM-DD"
      ),
    arrivalDate: Yup.string()
      .required("Arrival Date is required")
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Arrival Date must be a valid date in the format YYYY-MM-DD"
      ),
  });
  /* validationSchema function ends here */

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

   /* onSubmit function starts here */
  function onSubmit(data) {
    var purchaseData = {
      purchase_order: {
        order_date: data.orderDate,
        due_date: data.arrivalDate,
        customer_id: 2,
        order_no: data.reference,
        note: data.note,
        line_items_attributes: [
          { quantity: data.quantity, product: { id: parseInt(data.product) } },
        ],
      },
    };
    axios
      .post(
        "https://api-staging.fabrikator.io/v1/2/purchase_orders",
        purchaseData,
        {
          headers: {
            Authorization: "LHL22QxJv5b5y7xbT8mtp5PAdB7bjpbgFvh2SCT9kNEpVoRb",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }
   /* onSubmit function ends here */

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="heading">
          <h4>Create Purchase order</h4>
          <div className="btn_group">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </div>
        <div className="form_wrapper">
          <div className="form_wrap">
            <div className="form_group">
              <label>SUPPLIER</label>
              <select
                name="supplier"
                {...register("supplier")}
                className={`form_control ${
                  errors.supplier ? "is-invalid" : ""
                }`}
              >
                <option value="">Please select a supplier</option>
                <option value="Supplier from EU">Supplier from EU</option>
                <option value="Anecdote">Anecdote</option>
                <option value="Awesome">Awesome</option>
              </select>
              <div className="invalid-feedback">{errors.supplier?.message}</div>
            </div>
            <div className="form_group">
              <label>ORDER DATE</label>
              <input
                name="orderDate"
                type="date"
                {...register("orderDate")}
                className={`form_control ${
                  errors.orderDate ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors.orderDate?.message}
              </div>
            </div>
            <div className="form_group">
              <label>ARRIVAL DATE</label>
              <input
                name="arrivalDate"
                type="date"
                {...register("arrivalDate")}
                className={`form_control ${
                  errors.arrivalDate ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors.arrivalDate?.message}
              </div>
            </div>
            <div className="form_group">
              <label>REFERENCE NO</label>
              <input
                name="reference"
                type="number"
                {...register("reference")}
                className={`form_control ${
                  errors.reference ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">
                {errors.reference?.message}
              </div>
            </div>
            <div className="form_group">
              <label>NOTE</label>
              <textarea
                name="note"
                type="text"
                {...register("note")}
                className={`form_control ${errors.note ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.note?.message}</div>
            </div>
          </div>
          <div className="form_wrap form_wrap2 product_heading">
            <div className="product">
              <h6>Product</h6>
            </div>
            <div className="quantity">
              <h6>Quantity</h6>
            </div>
          </div>
          <div className="form_wrap form_wrap2">
            <div className="form_group product">
              <select
                name="product"
                {...register("product")}
                className={`form_control ${errors.product ? "is-invalid" : ""}`}
              >
                <option value="">Type to search products</option>
                <option value="1">Candy Striped Dress</option>
              </select>
              <div className="invalid-feedback">{errors.product?.message}</div>
            </div>
            <div className="form_group quantity">
              <input
                name="quantity"
                type="number"
                {...register("quantity")}
                className={`form_control ${
                  errors.quantity ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">{errors.quantity?.message}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;

/*
#############################################################################
# Name : createPurchaseOrder.js
# Created by : Arvind Yadav
# Date       : 7th Dec 2021
# Purpose    : This file is used for creating the purchase order and storing the data of purchase order
#############################################################################
*/
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [productData, setProduct] = useState();
  const [customerData, setCustomer] = useState();
  const [timer, setTimer] = useState(null);
  const [productDetail, setProductDetail] = useState([]);
  const [productSelect, setProductSelected] = useState([]);
  const [showForm, setIsForm] = useState(false);
  const [displaySuggestions, setDisplay] = useState(false);
  const [productSuggestion, setProductSuggestion] = useState();

  useEffect(() => {
    const fetchProductData = async () => {
      axios
        .get("https://api-staging.fabrikator.io/v1/2/products", {
          headers: {
            Authorization: "LHL22QxJv5b5y7xbT8mtp5PAdB7bjpbgFvh2SCT9kNEpVoRb",
          },
        })
        .then((response) => {
          setProduct(response.data.products);
        })
        .catch((error) => {
          console.log(error.data);
        });
    };
    const fetchCustomerData = async () => {
      axios
        .get("https://api-staging.fabrikator.io/v1/2/customers", {
          headers: {
            Authorization: "LHL22QxJv5b5y7xbT8mtp5PAdB7bjpbgFvh2SCT9kNEpVoRb",
          },
        })
        .then((response) => {
          setCustomer(response.data.customers);
        })
        .catch((error) => {
          console.log(error.data);
        });
    };

    fetchProductData();
    fetchCustomerData();
  }, []);
  /* validationSchema function starts here this function is used for validating the purchase order form */
  const validationSchema = Yup.object().shape({
    supplier: Yup.string().required("Supplier is required"),
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
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const handleAddrTypeChange = (e, id) => {
    productData
      .filter((product) => product.id == id)
      .map((filteredProduct) => {
        setProductDetail((productDetail) => [
          ...productDetail,
          filteredProduct,
        ]);
        setIsForm((current) => !current);
      });
  };
  const buttonHandler = () => {
    setIsForm((current) => !current);
  };
  const buttonClose = (id) => {
    setProductDetail(productDetail.filter((item) => item.id != id));
  };
  const handleInputChange = (e, id) => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        productSelect.push({ quantity: e.target.value, product: { id: id } });
      }, 1000)
    );
  };

  const handleChange = (e) => {
    const test = productData.filter((team) => {
      return team.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setProductSuggestion(test);
    setDisplay(true);
  /*   console.log(productSuggestion); */
  };
  /* onSubmit function starts here */
  function onSubmit(data) {
    var purchaseData = {
      purchase_order: {
        order_date: data.orderDate,
        due_date: data.arrivalDate,
        customer_id: parseInt(data.supplier),
        order_no: data.reference,
        note: data.note,
        line_items_attributes: productSelect,
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
      .then((response) => {/* 
        console.log(response.data.purchase_order); */
        navigate("../purchase-details", {
          state: {
            order_no: response.data.purchase_order.order_no,
            customer: response.data.purchase_order.customer.name,
            order_date: response.data.purchase_order.order_date,
            arrival_date: response.data.purchase_order.due_date,
            note: response.data.purchase_order.note,
          },
        });
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
                {customerData &&
                  customerData.map((customer, c) => (
                    <option value={customer.id} key={c}>
                      {customer.name}
                    </option>
                  ))}
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
            <div className="stock">
              <h6>In Stock</h6>
            </div>
            <div className="quantity">
              <h6>Quantity</h6>
            </div>
          </div>
          {productDetail.length > 0
            ? productDetail.map((productInfo, i) => (
                <div className="form_wrap form_wrap2" key={i}>
                  {productInfo.name && (
                    <div className="form_group product">
                      <div className="form_group image">
                        <img src={productInfo.product_image_url} />
                      </div>

                      <div className="form_control after_selected_data">
                        {productInfo.name}
                      </div>
                    </div>
                  )}
                  <div className="form_group stock">
                    <p>{productInfo.stock_count}</p>
                  </div>
                  {productInfo.stock_count && (
                    <div className="form_group quantity">
                      <input
                        name={"quantity" + i}
                        type="number"
                        {...register("quantity" + i)}
                        className={`form_control ${
                          errors.quantity ? "is-invalid" : ""
                        }`}
                        onChange={(e) => handleInputChange(e, productInfo.id)}
                      />
                      <div
                        className="close"
                        onClick={() => buttonClose(productInfo.id)}
                        type="button"
                      >
                        X
                      </div>
                    </div>
                  )}
                </div>
              ))
            : null}

          {showForm && (
            <div className="form_wrap form_wrap2">
              <div className="form_group product">
                <div className="form_group image">
                  <img src="" />
                </div>
                {/* <select
                  name="product"
                  {...register("product")}
                  onChange={(e) => handleAddrTypeChange(e)}
                  className="form_control"
                >
                  <option value="">Type to search products</option>
                  {productData &&
                    productData.map((product, p) => (
                      <option value={product.id} key={p}>
                        {product.name}
                      </option>
                    ))}
                </select> */}
                <input
                  type="text"
                  className="form_control"
                  placeholder="Enter Product"
                  onChange={(e) => handleChange(e)}
                  onBlur={() =>
                    setTimeout(() => {
                      setDisplay(false);
                    }, 300)
                  }
                  // onFocus={this.handleChange.bind(this, i)}
                />

                {displaySuggestions == true ? (
                  <ul className="product_list">
                    {productSuggestion.map((item) => {
                      return (
                        <li
                          key={"bnhfc" + item.id}
                          onClick={(e) => handleAddrTypeChange(e, item.id)}
                        >
                          <span className="img">
                            <img src={item.images} alt="" />
                          </span>
                          <span className="name">{item.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
              <div className="form_group stock">
                <p>-</p>
              </div>
              <div className="form_group quantity">
                <input
                  name="quantitySelect"
                  type="number"
                  {...register("quantitySelect")}
                  className={`form_control ${
                    errors.quantity ? "is-invalid" : ""
                  }`}
                />
              </div>
            </div>
          )}
          <div className="add_btn text-center">
            <button className="btn" onClick={buttonHandler} type="button">
              Add New Line
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;

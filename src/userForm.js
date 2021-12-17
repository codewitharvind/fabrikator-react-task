import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { Moment } from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
const UserForm = () => {
  const validationSchema = Yup.object().shape({
    select: Yup.string().required("Supplier is required"),
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

  const formOptions = { resolver: yupResolver(validationSchema) };
  const [products, setProducts] = useState([
    { products: "", orderQuantity: "" },
  ]);
  const { control, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = handleSubmit((data) => console.log(data));

  const handleChange = (date, field) => {
    console.log(date);
    field.onChange(date);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="heading">
          <h4>Create Purchase order</h4>
          <div className="btn_group">
            <button className="btn cancel">Cancel</button>
            <button className="btn" type="submit">
              Save as draft
            </button>
          </div>
        </div>
        <div className="form_wrapper">
          <div className="form_wrap">
            <div className="form_group">
              <label>SUPPLIER</label>
              <Controller
                name="select"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    className={`form_control ${errors.select ? "is-invalid" : ""
                      }`}
                    placeholder="Please select a supplier"
                    {...field}
                    options={[
                      { value: "Supplier from EU", label: "Supplier from EU" },
                      { value: "Anecdote", label: "Anecdote" },
                      { value: "Awesome", label: "Awesome" },
                    ]}
                  />
                )}
              />
            </div>
            <div className="form_group">
              <label>ORDER DATE</label>
              <Controller
                name="orderDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    className="form_control"
                    dateFormat="dd.MM.yyyy"
                    onChange={(date) => handleChange(date, field)}
                    selected={field.value}
                  />
                )}
              />
            </div>
            <div className="form_group">
              <label>ARRIVAL DATE</label>
              <Controller
                name="arrivalDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="form_control"
                    dateFormat="dd.MM.yyyy"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    selected={field.value}
                  />
                )}
              />
            </div>
            <div className="form_group">
              <label>REFERENCE NO</label>
              <Controller
                render={({ field }) => (
                  <div className="form_control_wrap">
                    <input className="form_control" {...field} />
                  </div>
                )}
                name="referenceNo"
                control={control}
                defaultValue=""
              />
            </div>
            <div className="form_group">
              <label>NOTE</label>
              <Controller
                render={({ field }) => (
                  <div className="form_control_wrap">
                    <textarea className="form_control" {...field} />
                  </div>
                )}
                name="Note"
                control={control}
                defaultValue=""
              />
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
              <Controller
                name="product"
                control={control}
                render={({ field }) => (
                  <Select
                    className="form_control"
                    placeholder="Type to search products"
                    {...field}
                    options={[
                      {
                        value: "Candy Striped Dress",
                        label: "Candy Strip Dress",
                      },
                    ]}
                  />
                )}
              />
            </div>
            <div className="form_group quantity">
              <Controller
                render={({ field }) => (
                  <input className="form_control" type="number" {...field} />
                )}
                name="orderQuantity"
                control={control}
                defaultValue=""
              />
              <button className="close">X</button>
            </div>
          </div>
          <div className="form_group" style={{ textAlign: "center" }}>
            <button className="btn">+ Add New Line</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

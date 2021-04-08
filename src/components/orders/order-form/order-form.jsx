import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormData } from "../../../hooks/useFormData";
import { FormDetails } from "./order-form-details";
import WidgetHeader from "../../general/widget-header";
import { BASE_API_URL } from "../../../hooks/API";
import StatusModal from "../../general/modal/status-modal";
import { errorOrderData, successfulOrderData } from "./order-form-data";
import LoadingButton from "../../general/loading-button";
const OrderForm = () => {
  const [order, setOrder] = useState();
  const [products, setProducts] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() =>
    axios.get(`${BASE_API_URL}/api/v1/product/list.php`).then((res) => {
      console.log(res.data);
      const data = res.data.data;
      const newArray = data.unshift({
        id: "0",
        product: "Select Product",
        price: 0,
      });
      console.log("New Array", newArray);
      console.log("New Data", data);
      setProducts(data);
    }, [])
  );

  const handleOrderChange = () => {
    // Get form values with document,getById
    const qtyValue = document.getElementById("qty").value;
    console.log("Qty Value: ", qtyValue);
    const truckNoValue = document.getElementById("truckNo").value;
    console.log("truckNo Value: ", truckNoValue);
    const selectValue = document.getElementById("select").value;
    console.log("Select Value: ", selectValue);

    // Filter Products Array to get single product
    const product = products.filter((product) => product.id === selectValue);
    console.log("Product: ", product);
    // Calculate the cost of an order
    const orderCost = qtyValue * product[0].price;
    console.log("Order Cost: ", orderCost);
    // Set the value of an order to the UI
    setTotalPrice(orderCost);

    return {
      product,
    };
  };

  const handleOrderSubmit = () => {
    const qtyValue = document.getElementById("qty").value;
    const truckNoValue = document.getElementById("truckNo").value;
    const selectValue = document.getElementById("select").value;
    const { product } = handleOrderChange();
    console.log("Submitted Product", product);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User Object: ", user);
    const addOrderData = {
      "product-id": selectValue,
      product: product[0].product,
      user: user.username,
      "user-id": user.id,
      qty: qtyValue,
      unit: product[0].unit,
      "unit-price": product[0].price,
      measurement: product[0].measurement,
      "total-price": totalPrice,
      "truck-no": truckNoValue,
      description: product[0].description,
    };
    if (error || !error) {
      setLoading(true);
      document.getElementById("loading-btn").disabled = true;
    }
    axios
      .post(`${BASE_API_URL}/api/v1/order/add.php`, addOrderData)
      .then((res) => {
        console.log("ADD ORDER: ", res.data);
        if (res.data.error) {
          setError(true);
          setShowModal(true);
          setErrorMsg(res.data.message);
        } else {
          setError(false);
          setShowModal(true);
          setOrder(res.data.data);
          document.getElementById("qty").value = "";
          document.getElementById("truckNo").value = "";
          document.getElementById("select").value = 0;
          setTotalPrice(0);
        }
      });
  };
  const { formData } = useFormData(products, totalPrice);

  return (
    <div id="basic" className="col-lg-12 layout-spacing">
      <div className="statbox widget box box-shadow">
        {/* HEADER TITLE FOR THE FORM */}
        <WidgetHeader title="Make an order" />
        <div
          className="widget-content widget-content-area"
          style={{ padding: "3rem" }}
        >
          <div className="row">
            <div className="col-lg-6 col-12 mx-auto">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  {/* SUB-TITLE FOR THE FORM */}
                  <p>Fill in order details</p>

                  {formData?.map((item, i) => (
                    <FormDetails
                      key={i}
                      item={item}
                      handleChange={handleOrderChange}
                    />
                  ))}
                  <LoadingButton
                    handleSubmit={handleOrderSubmit}
                    loading={loading}
                    text="Place Order"
                  />
                </div>
              </form>
            </div>
          </div>
          {showModal && (
            <StatusModal
              status={error}
              showModal={showModal}
              setLoading={setLoading}
              setShowModal={setShowModal}
              itemSuccess={successfulOrderData}
              itemError={errorOrderData}
              errorMsg={errorMsg}
              orderId={order}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;

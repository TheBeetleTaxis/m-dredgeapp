import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../hooks/API";
import CustomTableList from "../../general/custom-table-list/custom-table-list";

const DispatchOrderList = () => {
  const [bodyData, setBodyData] = useState(null);
  useEffect(
    () =>
      axios
        .get(`${BASE_API_URL}/api/v1/order/dispatch-list.php`)
        .then((res) => {
          let body = [];
          console.log("Table Body: ", res.data.data);
          res.data.data.map((item) => {
            const dispatchId = item.id;
            const orderId = item.order_id;
            const orderRef = item.order_ref;
            const product = item.product;
            const loaded = item.loaded;
            const inspected = item.inspected;
            const cleared = item.security;
            console.log(
              "Body Items: ",
              dispatchId,
              orderId,
              orderRef,
              product,
              loaded,
              inspected,
              cleared
            );
            const currentDispatch = {
              id: dispatchId,
              fields: [
                {
                  orderId: orderId,
                  class: "text-left",
                  itemClass: "text-center",
                  item: product,
                },
                {
                  orderId: orderId,
                  class: "text-left",
                  itemClass: "text-center",
                  item: orderRef,
                },
                {
                  orderId: orderId,
                  class: "text-left",
                  itemClass:
                    loaded === "0"
                      ? "shadow-none badge badge-warning"
                      : "shadow-none badge badge-primary",
                  item: loaded === "0" ? "pending" : "Loaded",
                },
                {
                  orderId: orderId,
                  class: "text-left",
                  itemClass:
                    inspected === "0"
                      ? "shadow-none badge badge-warning"
                      : "shadow-none badge badge-primary",
                  item: inspected === "0" ? "pending" : "Inspected",
                },
                {
                  orderId: orderId,
                  class: "text-left",
                  itemClass:
                    cleared === "0"
                      ? "shadow-none badge badge-warning"
                      : "shadow-none badge badge-primary",
                  item: cleared === "0" ? "pending" : "Cleared",
                },
                {
                  orderId: orderId,
                  class: "text-center",
                  itemClass:
                    loaded && inspected && cleared === "0"
                      ? "shadow-none badge badge-warning"
                      : loaded && inspected === "0" && cleared === "1"
                      ? "shadow-none badge badge-warning"
                      : inspected && cleared === "0" && loaded === "1"
                      ? "shadow-none badge badge-warning"
                      : loaded && cleared === "0" && inspected === "1"
                      ? "shadow-none badge badge-warning"
                      : "shadow-none badge badge-success",
                  item:
                    loaded && inspected && cleared === "0"
                      ? "Not Completed"
                      : loaded && inspected === "0" && cleared === "1"
                      ? "Not Completed"
                      : inspected && cleared === "0" && loaded === "1"
                      ? "Not Completed"
                      : loaded && cleared === "0" && inspected === "1"
                      ? "Not Completed"
                      : "Completed",
                },
              ],
            };
            console.log("Current Dispatch: ", currentDispatch);
            return (body = body.concat(currentDispatch));
          });
          setBodyData(body);
          console.log("BODY ARRAY: ", body);
        }),
    [bodyData]
  );

  const dispatchListData = {
    tableTitle: "Dispatch List",
    header: [
      { class: "", title: "Product" },
      { class: "", title: "Order Ref" },
      { class: "", title: "Loaded" },
      { class: "", title: "Inspected" },
      { class: "", title: "Cleared" },
      { class: "text-center", title: "Status" },
    ],

    body: bodyData,
  };
  return (
    <>
      <CustomTableList content={dispatchListData} />
    </>
  );
};

export default DispatchOrderList;
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BASE_API_URL } from "../../hooks/API";
import { showLogItem } from "../cards/custom-activities-summary";
import CustomTableList from "../general/custom-table-list/custom-table-list";

const ActivityReportList = () => {
  const [activityReportList, setActivityReportList] = useState(["loading"]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const response = async () => {
      let activityReportListBody = [];
      try {
        await axios
          .get(`${BASE_API_URL}/api/v1/task/list.php`)
          .then((res) => {
            console.log("Impound Truck list response data: ", res.data);
            if (res.data.error) {
              let title = "Server Error Response",
                text = res.data.message;
              errorAlert(title, text);
            } else {
              const activityReportListItems = res.data.data;
              activityReportListItems.reverse().map((item) => {
                const user_name = item.user,
                  user_id = parseInt(item.user_id),
                  date = item.date_in,
                  work_week = item.work_week,
                  completed_tasks = item.completed_task,
                  ongoing_tasks = item.ongoing_task,
                  next_week_tasks = item.next_week_task;

                const task_id = parseInt(item.id);
                item["item_log"] = "item-log";
                console.log("Item log: ", item);
                const activityReportItemData = {
                  "user-id": user_id,
                  user: user_name,
                  "task-id": task_id,
                };

                const currentActivityReportItem = {
                  id: task_id,
                  fields: [
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      item: date,
                    },
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      item: work_week,
                    },
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      item: user_name,
                    },
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      item: completed_tasks,
                    },
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      item: ongoing_tasks,
                    },
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      item: next_week_tasks,
                    },
                    {
                      class: "text-left",
                      itemClass: "text-center",
                      delete: true,
                      onClick: () =>
                        warningAlert(
                          `Are you sure you want to delete this activity report?`,
                          activityReportItemData
                        ),
                    },
                    {
                      class: "text-left",
                      link: () => showLogItem(item),
                      userLog: true,
                      linkText: "View Activity Report",
                      itemClass: "btn btn-primary",
                    },
                  ],
                };

                return (activityReportListBody = activityReportListBody.concat(
                  currentActivityReportItem
                ));
              });
              setActivityReportList(activityReportListBody);
              console.log("Impound Truck List Body: ", activityReportList);
            }
          })
          .catch((error) => {
            console.log("API error: ", error);
            let title = "Network Error",
              text = error;
            errorAlert(title, text);
          });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Axios Error: ", error);
        } else {
          throw error;
        }
      }
    };

    response();

    return () => {
      source.cancel();
    };
  }, []);

  /** Multipurpose success, error and warning pop-ups for handling and displaying errors, success and warning alerts */
  const successAlert = (title, text, link) => {
    Swal.fire({
      icon: "success",
      title: title,
      text: text,
      footer: link,
      showConfirmButton: false,
    });
  };
  const errorAlert = (title, text) => {
    Swal.fire({
      icon: "error",
      title: title,
      text: text,
      showConfirmButton: false,
    });
  };

  const warningAlert = (title, deleteItem) => {
    Swal.fire({
      icon: "warning",
      title: title,
    }).then((value) => {
      if (value.isConfirmed) {
        handleDeleteReportTruck(deleteItem);
      }
    });
  };

  const handleDeleteReportTruck = (deleteItem) => {
    axios
      .post(`${BASE_API_URL}/api/v1/task/delete.php`, deleteItem)
      .then((res) => {
        if (res.data.error) {
          let title = "Server Error Response",
            text = res.data.message;
          errorAlert(title, text);
        } else {
          let title = "Report Deleted Successfully",
            text = res.data.message,
            link = `<a href="/reportlist">View Report List</a>`;
          successAlert(title, text, link);
        }
      });
  };
  /** machinery List Table Data */
  const activityReportListTableData = {
    tableTitle: "",
    header: [
      { class: "", title: "Date" },
      { class: "", title: "Work week" },
      { class: "", title: "Submitted by" },
      { class: "", title: "Completed tasks" },
      { class: "", title: "Ongoing tasks" },
      { class: "", title: "Next week tasks" },
      { class: "", title: "" },
      { class: "", title: "" },
    ],

    body: activityReportList,
  };
  return <CustomTableList content={activityReportListTableData} />;
};

export default ActivityReportList;
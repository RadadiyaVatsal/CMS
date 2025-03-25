import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { SET_ERRORS } from "../../../redux/actionTypes";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { AgCharts } from "ag-charts-react";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const attendance = useSelector((state) => state.student.attendance);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  useEffect(() => {
    if (attendance?.result) {
      const formattedData = attendance.result.map((item) => ({
        subject: item.subject,
        attended: item.attended,
        total: item.total,
        percentage: ((item.attended / item.total) * 100).toFixed(2), // Percentage calculation
      }));
      setChartData(formattedData);
    }
  }, [attendance]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1>All Subjects</h1>
        </div>
        <div className="mr-10 bg-white rounded-xl pt-6 pl-6 h-[29.5rem]">
          <div className="col-span-3 mr-6">
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Loading"
                  height={50}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {error.noSubjectError && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noSubjectError}
                </p>
              )}
            </div>
            <AgCharts
              options={{
                title: { text: "Attendance Summary" },
                data: chartData,
                // tooltip: {
                //   enabled: true,
                //   renderer: ({ datum }) => ({
                //     title: datum.subject,
                //     content: `Attended: ${datum.attended}/${datum.total} (${datum.percentage}%)`,
                //   }),
                // },
                series: [
                  {
                    type: "bar",
                    xKey: "subject",
                    yKey: "attended",
                    yName: "Attended Lectures",
                    tooltip: {
                      renderer: ({ datum }) => ({
                        title: `${datum.percentage}%`,
                        data: null,
                      }),
                    },
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;

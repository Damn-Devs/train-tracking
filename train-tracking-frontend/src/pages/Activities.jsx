import React, { useState, useEffect } from "react";
import { request, GET } from "../api/ApiAdapter";
import { format } from "date-fns";
import { Tab, Tabs, TabPanel, TabList } from "react-tabs";

const Activities = () => {
  const [completedList, setCompletedList] = useState([]);
  const [pendingList, setPendingList] = useState([]);

  const getOngoing = async () => {
    const res = await request(`/passenger/activity/ongoing`, GET);
    if (!res.error) {
      setPendingList(res);
    } else {
      console.log(res);
      // toast.error('Unable to load shuttle data..!');
    }
  };

  const getCompleted = async () => {
    const res = await request(`/passenger/activity/completed`, GET);
    if (!res.error) {
      setCompletedList(res);
    } else {
      console.log(res);
      // toast.error('Unable to load shuttle data..!');
    }
  };

  useEffect(() => {
    getOngoing();
    getCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" min-h-[52vh]">
      <Tabs>
        <TabList>
          <Tab>Ongoing</Tab>
          <Tab>Completed</Tab>
        </TabList>

        <TabPanel>
          {pendingList.map((activity) => (
            <div className=" border-3 rounded-md mt-2 mb-2 border-slate-400 ml-4 w-3/4 flex">
              <div className=" w-1/6">
                <img
                  src="https://adaderanaenglish.s3.amazonaws.com/1659868127-train-services.jpg"
                  alt=""
                  style={{ maxWidth: "200px" }}
                  className="p-2"
                />
              </div>
              <div className=" w-2/6">
                <div className=" text-2xl font-bold">
                  {activity?.schedule?.train?.name}
                </div>
                <div className=" text-sm text-slate-700 -mt-2 font-bold">
                  Date
                </div>
                <div className="flex">
                  <div className="mr-5">
                    Start at{" "}
                    {format(
                      new Date(activity?.schedule?.departureTime),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </div>
                  <div>
                    Stop at{" "}
                    {format(
                      new Date(activity?.schedule?.arrivalTime),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </div>
                </div>
              </div>
              <div className="w-1/6 justify-center flex items-center">
                <div className=" text-2xl font-bold pr-2">Price =</div>
                <div className=" text-2xl font-bold">
                  Rs: {activity?.payment?.total}/=
                </div>
              </div>
              <div className="w-2/6">
                <div
                  className={`ml-4 mt-4 text-xl font-bold ${
                    activity?.schedule?.location?.name ? "visible" : "hidden"
                  }`}
                >
                  Current Location - {activity?.schedule?.location?.name}{" "}
                  Station
                </div>
                <div
                  className={`text-red-400 ml-4 mt-2 text-xl font-bold ${
                    activity?.schedule?.delay ? "visible" : "hidden"
                  }`}
                >
                  Train Delay - {activity?.schedule?.delay}
                </div>
              </div>
            </div>
          ))}
        </TabPanel>
        <TabPanel>
          {completedList.map((activity) => (
            <div className=" border-3 rounded-md mt-2 mb-2 border-slate-400 ml-4 w-3/4 flex">
              <div className=" w-1/6">
                <img
                  src="https://adaderanaenglish.s3.amazonaws.com/1659868127-train-services.jpg"
                  alt=""
                  style={{ maxWidth: "200px" }}
                  className="p-2"
                />
              </div>
              <div className=" w-2/6">
                <div className=" text-2xl font-bold">
                  {activity?.schedule?.train?.name}
                </div>
                <div className=" text-sm text-slate-700 -mt-2 font-bold">
                  Date
                </div>
                <div className="flex">
                  <div className="mr-5">
                    Start at{" "}
                    {format(
                      new Date(activity?.schedule?.departureTime),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </div>
                  <div>
                    Stop at{" "}
                    {format(
                      new Date(activity?.schedule?.arrivalTime),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </div>
                </div>
              </div>
              <div className="w-1/6 justify-center flex items-center">
                <div className=" text-2xl font-bold pr-2">Price =</div>
                <div className=" text-2xl font-bold">
                  Rs: {activity?.payment?.total}/=
                </div>
              </div>
              <div className="w-2/6">
                <div
                  className={`ml-4 mt-4 text-xl font-bold ${
                    activity?.schedule?.location?.name ? "visible" : "hidden"
                  }`}
                >
                  Current Location - {activity?.schedule?.location?.name}{" "}
                  Station
                </div>
                <div
                  className={`text-red-400 ml-4 mt-2 text-xl font-bold ${
                    activity?.schedule?.delay ? "visible" : "hidden"
                  }`}
                >
                  Train Delay - {activity?.schedule?.delay}
                </div>
              </div>
            </div>
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Activities;

import React, { useEffect, useState } from "react";
import "../styles/train-revenue.css";
import { useParams } from "react-router-dom";
import TrackingChart from "../charts/TrackingChart";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import trainStaticsData from "../assets/dummy-data/trainStatics";
import train01 from "../assets/images/slider-img/slider-1.jpg";
import bookingTrains from "../assets/dummy-data/booking-train";
import { request, GET, POST, PATCH, PUT } from "../api/ApiAdapter";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;
const TrainRevenue = () => {
  const { slug } = useParams();
  const [revenueData, setRevenueData] = useState({});
  const [chartData, setChartData] = useState([]);
  const singleTrainItem = bookingTrains.find((item) => item.trainName === slug);

  //! For testing purposes
  const loadTrainRevenueData = async () => {
    const res = await request(`revenue/get/name/${slug}`, GET);
    if (!res.error) {
      setRevenueData(res);
    } else {
      console.log(res);
    }
  };

  //! For testing purposes
  const loadChartData = async () => {
    const res = await request(`train/get/chart/name/${slug}`, GET);
    if (!res.error) {
      setChartData(res);
    } else {
      console.log(res);
    }
  };

  const connect = () => {
    let Sock = new SockJS(`http://localhost:39388/tracker/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, () => {
      console.error("fail");
    });
  };

  const onConnected = () => {
    stompClient.subscribe("/dashboard/booking/change", onBookingChange);
  };

  const onBookingChange = (payload) => {
    loadTrainRevenueData();
    loadChartData();
  };

  useEffect(() => {
    connect();
    loadTrainRevenueData();
    loadChartData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sell__train">
      <div className="sell__train-wrapper">
        <h2 className="sell__train-title">Train Revenue</h2>
        <div className="sell__train-top">
          <div className="sell__train-img">
            <h2>{singleTrainItem?.trainName}</h2>
            <img src={train01} alt="" />
          </div>

          <div className="tracking__history">
            <h3>Revenue Statistic</h3>
            <TrackingChart data={chartData} />
          </div>
        </div>

        <div className="offer__wrapper">
          <div className="offer__top">
            <h2 className="sell__train-title">Ticket Statistics</h2>
          </div>
          <div className="offer__list">
            {/* FIRST CLASS */}
            <div className="offer__item">
              <div className="box__01">
                <h3 className="client__name">First Class</h3>
                <h6 className="avg__price">
                  LKR {revenueData?.firstClassRevenueResponse?.total}{" "}
                  <span>Total Income</span>
                </h6>

                <h6 className="market__price">
                  Selling average is LKR{" "}
                  {revenueData?.firstClassRevenueResponse?.averageSellingRate?.toFixed(
                    2
                  )}
                </h6>
                <span className="arrow__key">
                  <i class="ri-arrow-right-line"></i>
                </span>
              </div>
              <div className="circle__wrapper">
                <div className="box__02">
                  <CircularProgressbar
                    value={
                      revenueData?.firstClassRevenueResponse?.revenueProportion
                    }
                    text={`${revenueData?.firstClassRevenueResponse?.revenueProportion}%`}
                    styles={buildStyles({
                      pathColor: "#01d293",
                      textColor: "#fff",
                      trailColor: "#0b0c28",
                      textSize: "18px",
                    })}
                  />
                </div>
                <h4>Ticket Revenue</h4>
              </div>
              <div className="box__03">
                <span className="model__spend-icon">
                  <i class="ri-train-line"></i>
                </span>
                <h6 className="spend__amount">
                  {revenueData?.firstClassRevenueResponse?.ticketsSold}
                </h6>
                <p className="spend__title">Tickets sold</p>
              </div>
              <div className="box__04">
                <span className="model__spend-icon">
                  <i class="ri-share-forward-line"></i>
                </span>
                <h6 className="spend__amount">
                  {revenueData?.firstClassRevenueResponse?.ticketsBooked}
                </h6>
                <p className="spend__title">Tickets Booked</p>
              </div>
            </div>

            {/* SECOND CLASS */}
            <div className="offer__item">
              <div className="box__01">
                <h3 className="client__name">Second Class</h3>
                <h6 className="avg__price">
                  LKR {revenueData?.secondClassRevenueResponse?.total}{" "}
                  <span>average price</span>
                </h6>
                <h6 className="market__price">
                  Selling average is LKR{" "}
                  {revenueData?.secondClassRevenueResponse?.averageSellingRate?.toFixed(
                    2
                  )}
                </h6>
                <span className="arrow__key">
                  <i class="ri-arrow-right-line"></i>
                </span>
              </div>
              <div className="circle__wrapper">
                <div className="box__02">
                  <CircularProgressbar
                    value={
                      revenueData?.secondClassRevenueResponse?.revenueProportion
                    }
                    text={`${revenueData?.secondClassRevenueResponse?.revenueProportion}%`}
                    styles={buildStyles({
                      pathColor: "#01d293",
                      textColor: "#fff",
                      trailColor: "#0b0c28",
                      textSize: "18px",
                    })}
                  />
                </div>
                <h4>Ticket Revenue</h4>
              </div>
              <div className="box__03">
                <span className="model__spend-icon">
                  <i class="ri-train-line"></i>
                </span>
                <h6 className="spend__amount">
                  {revenueData?.secondClassRevenueResponse?.ticketsSold}
                </h6>
                <p className="spend__title">Tickets sold</p>
              </div>
              <div className="box__04">
                <span className="model__spend-icon">
                  <i class="ri-share-forward-line"></i>
                </span>
                <h6 className="spend__amount">
                  {revenueData?.secondClassRevenueResponse?.ticketsBooked}
                </h6>
                <p className="spend__title">Tickets Booked</p>
              </div>
            </div>

            {/* THIRD CLASS */}
            <div className="offer__item">
              <div className="box__01">
                <h3 className="client__name">Third Class</h3>
                <h6 className="avg__price">
                  LKR {revenueData?.thirdClassRevenueResponse?.total}{" "}
                  <span>average price</span>
                </h6>
                <h6 className="market__price">
                  Selling average is LKR{" "}
                  {revenueData?.thirdClassRevenueResponse?.averageSellingRate?.toFixed(
                    2
                  )}
                </h6>
                <span className="arrow__key">
                  <i class="ri-arrow-right-line"></i>
                </span>
              </div>
              <div className="circle__wrapper">
                <div className="box__02">
                  <CircularProgressbar
                    value={
                      revenueData?.thirdClassRevenueResponse?.revenueProportion
                    }
                    text={`${revenueData?.thirdClassRevenueResponse?.revenueProportion}%`}
                    styles={buildStyles({
                      pathColor: "#01d293",
                      textColor: "#fff",
                      trailColor: "#0b0c28",
                      textSize: "18px",
                    })}
                  />
                </div>
                <h4>ticket values</h4>
              </div>
              <div className="box__03">
                <span className="model__spend-icon">
                  <i class="ri-train-line"></i>
                </span>
                <h6 className="spend__amount">
                  {revenueData?.thirdClassRevenueResponse?.ticketsSold}
                </h6>
                <p className="spend__title">Tickets sold</p>
              </div>
              <div className="box__04">
                <span className="model__spend-icon">
                  <i class="ri-share-forward-line"></i>
                </span>
                <h6 className="spend__amount">
                  {revenueData?.thirdClassRevenueResponse?.ticketsBooked}
                </h6>
                <p className="spend__title">Tickets Booked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainRevenue;

/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Col } from "reactstrap";
import "../../styles/train-item.css";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const TrainItem = (props) => {
  // const { trainName } = props.item;
  const name = props.item.train.name;
  const depTime = props.item.departureTime;
  const startime = props.item.arrivalTime;
  const cla = props.clas;
  const st = props.start;
  const en = props.end;
  const coun = props.count;
  const dat = props.date;
  const shed = props.item.id;
  const navigate = useNavigate();
  // console.log(shed);
  const handleFindTrainDetails = () => {
    navigate(`/trains/${name}/${cla}/${st}/${en}/${coun}/${dat}/${shed}`);
  };

  return (
    <Col lg="8" md="6" sm="6" className="mb-2">
      <div className="searchItem flex">
        <div className="w-20 h-full">
          <img
            src={
              "https://adaderanaenglish.s3.amazonaws.com/1659868127-train-services.jpg"
            }
          />
        </div>
        <div className="siDesc">
          <h1 className="siTitle">{name}</h1>
          <span className="siSubtitle">
            {"Arival Time : " + format(new Date(startime), "yyyy-MM-dd HH:mm")}
          </span>
          <span className="siSubtitle">
            {"Departure Time : " +
              format(new Date(depTime), "yyyy-MM-dd HH:mm")}
          </span>
          {/* <span className="siPrice">LKR {price}</span> */}
        </div>
        <div>
          <Button color="primary" onClick={handleFindTrainDetails}>
            Book Now
          </Button>{" "}
        </div>
      </div>
    </Col>
  );
};

export default TrainItem;

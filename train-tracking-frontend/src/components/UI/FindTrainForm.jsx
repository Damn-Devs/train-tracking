import React, { useState, useEffect } from "react";
import "../../styles/find-train-form.css";
import Select from "react-select";
import { Form, FormGroup } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { request, GET } from "../../api/ApiAdapter";
import { useNavigate } from "react-router-dom";

const FindTrainForm = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [startSt, setStartSt] = useState();
  const [endDt, setEndSt] = useState();
  const [find, setFind] = useState({
    date: "",
    count: "",
  });

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClassSelect = (event) => {
    setSelectedClass(event.target.value);
  };
  // console.log(endDt.label);
  const navigate = useNavigate();
  const handleFindTrain = () => {
    // console.log(selectedClass);
    navigate(
      `/trains/list/${selectedClass}/${startSt.value.id}/${endDt.value.id}/${find.count}/${find.date}`
    );
  };
  const [stations, setStations] = useState([]);

  const getAllStations = async () => {
    const res = await request(`/station/getustation`, GET);
    if (!res.error) {
      const newStation = [];
      res.forEach((item) => {
        newStation.push({ label: item.name, value: item });
      });
      setStations(newStation);
    }
  };

  useEffect(() => {
    getAllStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFindChange = (e) => {
    // console.log(e);
    setFind((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Form className="form">
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <FormGroup className="form__group">
          {/* <input type="text" placeholder="From Station" required /> */}
          <Select
            options={stations}
            onChange={(e) => {
              setStartSt(e);
            }}
            value={startSt}
            placeholder="From Station"
          />
        </FormGroup>

        <FormGroup className="form__group">
          {/* <input type="text" placeholder="To Station" required /> */}
          <Select
            options={stations}
            onChange={(e) => {
              setEndSt(e);
            }}
            value={endDt}
            placeholder="To Station"
          />
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="date"
            name="date"
            id="date"
            value={find.date}
            onChange={(e) => onFindChange(e)}
            placeholder="Journey date"
            required
          />
        </FormGroup>

        <FormGroup className="form__group">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              caret
              style={{
                backgroundColor: "transparent",
                color: "#000",
                fontSize: "16px",
                padding: "10px 20px",
                width: "100%",
              }}
            >
              {selectedClass ? selectedClass : "Select Class"}
            </DropdownToggle>
            <DropdownMenu
              style={{
                backgroundColor: "#fff",
                border: "none",
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                width: "100%",
              }}
            >
              <DropdownItem value="First" onClick={handleClassSelect}>
                First Class
              </DropdownItem>
              <DropdownItem value="Second" onClick={handleClassSelect}>
                Second Class
              </DropdownItem>
              <DropdownItem value="Third" onClick={handleClassSelect}>
                Economy
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormGroup>

        <FormGroup className="form__group">
          <input
            type="text"
            id="count"
            name="count"
            onChange={(e) => onFindChange(e)}
            value={find.count}
            placeholder="No of Passengers"
            required
          />
        </FormGroup>

        <FormGroup className="form__group">
          <button
            className="btn find__train-btn"
            disabled={
              startSt === undefined ||
              endDt === undefined ||
              find.date === "" ||
              selectedClass === null ||
              find.count === ""
            }
            onClick={handleFindTrain}
          >
            Find Train
          </button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default FindTrainForm;

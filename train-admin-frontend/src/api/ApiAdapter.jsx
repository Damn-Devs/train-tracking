import axios from "axios";

const GET = "get";
const POST = "post";
const PUT = "put";
const DELETE = "delete";
const PATCH = "patch";

//
// Handles all the API calls using axios
//
const request = async (
  url,
  type,
  data,
  params,
  headers = { "Content-Type": "application/json" }
) => {
  const baseUrl = process.env.REACT_APP_API_ENDPOINT;
  // console.log("tt");
  const routePath = baseUrl + url;

  const token = localStorage.getItem("token");

  const instance = axios.create(
    token
      ? {
          headers: {
            "Content-type": "Application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        }
      : {
          headers: {
            "Content-type": "Application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
  );

  const options = {
    method: type,
    url: routePath,
    data,
    params,
    headers,
  };

  let result;
  try {
    result = await instance(options);
    return result.data;
  } catch (error) {
    // console.log(error.response.data.message);
    if (error.response) {
      if (error.response.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        result = 0;
      } else if (
        error.response.status === 406 &&
        error.response.data.message === "No message available"
      ) {
        localStorage.clear();
        window.location.href = "/page/login";
        result = 0;
      } else {
        result = { error };
      }
    }
    return result;
  }
};

export { GET, POST, PUT, PATCH, DELETE, request };

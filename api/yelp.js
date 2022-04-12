import axios from "axios";

const yelp = axios.create({
  baseURL: "https://api.yelp.com/v3/businesses",
  headers: {
    Authorization:
      "Bearer cZRZHgWj8kLjAvoTZOAziF2prAy-vWaYmMC15bhP9XpohEIPk1IfFpIi-r0R2R5zVzfkhpV3-1RnefJbsPc0MVoKQroV9LTpadlba2133BaY14gZphrFti3yLb_qYXYx",
  },
});

export default yelp;

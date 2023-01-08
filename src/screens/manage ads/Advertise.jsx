import React from "react";
import { Helmet } from "react-helmet-async";
import Advert from "../../component/manage ads/Advert";

function Advertise() {
  return (
    <div>
      <Helmet>
        <title>Manage Ads</title>
      </Helmet>
      <Advert />
    </div>
  );
}

export default Advertise;

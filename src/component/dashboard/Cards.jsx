import React from "react";

import "./styles.scss";

function Cards(props) {
  const { summary } = props;
  console.log(summary);

  //TOTAL VIEWS
  const numViews = summary.dailySummary
    ? summary?.dailySummary[0]?.totalViews
    : 0;
  const TotalViews = numViews?.toLocaleString("en-GB");

  //TOTAL USERS
  const numOfSubscribers = summary.subscribers
    ? summary?.subscribers[0]?.numSubscribers
    : 0;
  const TotalSubscriber = numOfSubscribers?.toLocaleString("en-GB");

  //TOTAL USERS
  const numPost = summary.posts ? summary?.posts[0]?.totalPosts : 0;
  const TotalPost = numPost?.toLocaleString("en-GB");

  //TOTAL DOWNLOADS
  const numDownloads = summary.dailySummary
    ? summary?.dailySummary[0]?.downloads
    : 0;
  const TotalDownloads = numDownloads?.toLocaleString("en-GB");

  return (
    <div className="card_box">
      <div className="card">
        <div>
          <div className="numbers">{TotalViews}</div>
          <div className="card_name">Views</div>
        </div>
        <div className="icon_box">
          <i className="fa-solid fa-eye"></i>
        </div>
      </div>
      <div className="card">
        <div>
          <div className="numbers">{TotalSubscriber}</div>
          <div className="card_name">Subscriber</div>
        </div>
        <div className="icon_box">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      <div className="card">
        <div>
          <div className="numbers">{TotalPost}</div>
          <div className="card_name">Posts</div>
        </div>
        <div className="icon_box">
          <i className="fa-solid fa-comment"></i>
        </div>
      </div>
      <div className="card">
        <div>
          <div className="numbers">{TotalDownloads}</div>
          <div className="card_name">Downloads</div>
        </div>
        <div className="icon_box">
          <i className="fa-solid fa-cloud-arrow-down"></i>
        </div>
      </div>
    </div>
  );
}

export default Cards;

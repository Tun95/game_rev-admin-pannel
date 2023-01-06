import React from 'react'
import "./styles.css"

function MessageBox(props) {
	return (
    <div id="load-err">
      <div className={`alert alert-${props.variant || "info"}`}>
        {props.children}
      </div>
    </div>
  );
}

export default MessageBox
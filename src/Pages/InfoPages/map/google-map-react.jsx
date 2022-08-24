import React from "react";
import GoogleMapReact from "google-map-react";
import pin from "../../../Assets/images/pin.png";
import { Link } from "react-router-dom";

const markerStyle = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translate(-50%, -100%)",
};

class GoogleMap extends React.Component {
  static defaultProps = {
    center: {
      lat: 28.62474,
      lng: 77.08351,
    },
    zoom: 11,
  };
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "380px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBMTZWXHM2difV8CW_WD_m3dzdq7brseRo",
          }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {this.props.locations.map((item) => {
            if (item.address.length !== 0) {
              return item.address.map((i) => {
                return (
                  <Link to={"/" + item.name} key={i.id} lat={i.lat} lng={i.lng}>
                    <img style={markerStyle} src={pin} alt="pin" />
                  </Link>
                );
              });
            }
          })}
        </GoogleMapReact>
      </div>
    );
  }
}

export default GoogleMap;

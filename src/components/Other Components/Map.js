import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
 
 
class Map extends Component {
  static defaultProps = {
    center: {
      lat: 48.856613,
      lng:2.352222
    },
    zoom: 11
  };
 
  render() {
    const location = this.props.user_location.lat && this.props.user_location.lng ? this.props.user_location : {lat: 48.896553, lng: 2.318391}
    return (
      <div style={{ height: '185px', width: '100%'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCjmNYM7MuRfmbw-bDqOTZugSdMfQwZHxY" }}
          center={location}
		      defaultZoom={this.props.zoom}
        >
            <Marker
              lat={location.lat}
              lng={location.lng}
              name="you"
              color="#FF1744"
            />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default Map;

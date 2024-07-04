import React, { useEffect, useState, useRef } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import keyConfig from "../../../config/keys.config";

const MarkerMap = withScriptjs(
    withGoogleMap(
        ({ defaultCenter, marks, onMapClick }) => {
            const mapRef = useRef(null);
            const fitBounds = () => {
                const bounds = new window.google.maps.LatLngBounds();
                marks.map(mark => {
                    bounds.extend({ lat: mark?.latitude, lng: mark?.longitude });
                    return mark
                });
                mapRef.current.fitBounds(bounds);
            };

            useEffect(() => {
                fitBounds();
            }, [marks]);

            return (
                <GoogleMap
                    ref={mapRef}
                    defaultCenter={defaultCenter}
                    onClick={e => onMapClick(e)}
                >
                    {marks.map(
                        (mark, index) => (
                            <Marker
                                key={`marker_${index}`}
                                position={{ lat: mark?.latitude, lng: mark?.longitude }}
                                icon={{ url: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + mark?.character + "|" + mark?.marker_color + "|" + mark?.marker_text_color }}
                            />
                        )
                    )}
                </GoogleMap>
            );
        })
);


export default function GetLogLat(props) {
    const { marks, height, setLatitude, setLongitude } = props;
    const [geoCenter, setGeoCenter] = useState();

    useEffect(() => {
        if (marks.length > 0) {
            let centerPoint = {
                lat: marks[0]?.latitude,
                lng: marks[0]?.longitude
            }
            setGeoCenter(centerPoint)
        }
    }, [marks])

    const setMark = (e) => {
        setLatitude(e.latLng.lat())
        setLongitude(e.latLng.lng())
    }

    return (
        <div>
            <MarkerMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${keyConfig?.mapKey}`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `${height}px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                onMapClick={setMark}
                marks={marks}
                defaultCenter={{ lat: marks[0]?.latitude, lng: marks[0]?.longitude }}
            />
        </div>
    );
}

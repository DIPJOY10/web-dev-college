import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _, { keys } from "lodash";
import { withScriptjs, withGoogleMap, GoogleMap, Circle, Marker } from "react-google-maps";
import keyConfig from "../../../config/keys.config";
import "./common.css"

const useStyles = makeStyles((theme) => ({
    labels: {
        color: "red"
    }
}));

const MarkerMap = withScriptjs(
    withGoogleMap(
        ({ defaultCenter, marks, onMapClick }) => {
            const mapRef = useRef(null);
            const [labelBool, setLabelBool] = useState(false)

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

            const handleZoomChanged = () => {
                const newZoom = mapRef.current.getZoom();
                console.log(newZoom);

                if (newZoom >= 15) {
                    setLabelBool(true);
                } else {
                    setLabelBool(false);
                }
            };

            return (
                <GoogleMap
                    ref={mapRef}
                    defaultCenter={defaultCenter}
                    onZoomChanged={handleZoomChanged}
                    onClick={e => onMapClick(e)}
                    options={function (maps) { return { mapTypeId: "satellite" } }}
                >
                    {marks.map(
                        (mark, index) => (
                            <Marker
                                label={labelBool ? {
                                    text: mark?.label ? mark?.label : "",
                                    fontSize: "18px",
                                    color: "white",
                                    className: 'marker-position',
                                } : null}
                                labelClass={"labels"}
                                key={`marker_${index}`}
                                position={{ lat: mark?.latitude, lng: mark?.longitude }}
                                icon={mark?.character ? { url: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + mark?.character + "|" + mark?.marker_color + "|" + mark?.marker_text_color } : { url: mark?.iconUrl }}
                            />
                        )
                    )}
                </GoogleMap>
            );
        })
);


const CirclerMap = withScriptjs(
    withGoogleMap(
        (mapData) => {

            return (
                <GoogleMap
                    defaultZoom={14}
                    defaultCenter={{ lat: mapData.marks[0]?.latitude, lng: mapData.marks[0]?.longitude }}
                    onClick={e => mapData.onMapClick(e)}
                >
                    {mapData.marks.map((mark, index) => (
                        <Circle
                            radius={mapData?.redius}
                            center={{ lat: mark?.latitude, lng: mark?.longitude }}
                            onMouseover={() => console.log('mouseover')}
                            onClick={() => console.log('click')}
                            onMouseout={() => console.log('mouseout')}
                            strokeColor='transparent'
                            strokeOpacity={0}
                            strokeWeight={5}
                            fillColor='#4A90F4'
                            fillOpacity={0.2}
                        />
                    ))}
                </GoogleMap>
            );
        })
);


export default function GoogleMapComponent(props) {
    const history = useHistory();
    const classes = useStyles();
    const { marks, MakerType, height, redius } = props;

    console.log(marks)
    console.log(MakerType)
    console.log(height)
    console.log(redius)


    const [geoCenter, setGeoCenter] = useState();
    const [filteredMarkers, setFilteredMarkers] = useState([]);

    useEffect(() => {
        if (marks.length > 0) {
            let filterArr = []
            let minLog = null
            let maxLog = null
            let minLat = null
            let maxLat = null
            filterArr.push(marks[0])

            marks.map((datarow) => {
                if (datarow?.latitude && datarow?.longitude && marks[0]?.latitude !== datarow?.latitude && marks[0]?.longitude !== datarow?.longitude) {
                    filterArr.push(datarow)
                }

                if (datarow?.latitude && datarow?.longitude) {
                    if (minLog === null || minLog > datarow?.longitude) {
                        minLog = datarow?.longitude
                    }
                    if (minLat === null || minLat > datarow?.latitude) {
                        minLat = datarow?.latitude
                    }
                    if (maxLog === null || maxLog < datarow?.longitude) {
                        maxLog = datarow?.longitude
                    }
                    if (maxLat === null || maxLat < datarow?.latitude) {
                        maxLat = datarow?.latitude
                    }
                }
            })

            let centerPoint = {
                lat: ((maxLat + minLat) / 2.0),
                lng: ((maxLog + minLog) / 2.0)
            }
            setGeoCenter(centerPoint)
            setFilteredMarkers(filterArr)
        }
    }, [marks])

    let MapComponent = null;

    switch (MakerType) {
        case "maker":
            MapComponent = MarkerMap
            break;
        case "circle":
            MapComponent = CirclerMap
            break;
    }

    const setMark = (e) => {
        console.log(e.latLng.lat())
        console.log(e.latLng.lng())
    }

    return (
        <div>
            <MapComponent
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${keyConfig?.mapKey}`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `${height}px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                onMapClick={setMark}
                marks={filteredMarkers}
                defaultCenter={geoCenter}
                redius={redius}
            />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Dialog from '../SearchAndAdd/AddDialog'
import MyAutocomplete from './MyAutoComplete';



const useStyles = makeStyles((theme) => ({
    avatarCont: {
        display: 'flex',
        alignItems: 'center',
    }
}));

export default function AvatarGroupShow(props) {
    const {
        picNameArr,
        maxLen,
        widthHeight
    } = props;

    const classes = useStyles();
    const { } = classes;
    let currentLen = picNameArr?.length


    return (<>
        {picNameArr?.length > 0 && (<>
            <div className={classes.avatarCont} >
                {currentLen > maxLen ? (<>
                    {picNameArr.map((data, i) => (
                        i < maxLen && (<>
                            <Avatar
                                style={{ width: `${widthHeight}`, height: `${widthHeight}`, position: 'relative', left: `-${i * 8}px`, zIndex: `${i + 9}` }}
                                alt={data?.parent?.displayName}
                                src={data?.parent?.displayPicture?.url}
                            />
                        </>)
                    ))}
                    <div
                        style={{
                            width: `${widthHeight}`,
                            height: `${widthHeight}`,
                            position: 'relative',
                            left: `-${8 * maxLen + 25}px`,
                            zIndex: `${maxLen + 9}`,
                            backgroundColor: "rgba(255,255,255,0.6)",
                            fontSize: "20px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "550"
                        }}
                    >
                        +{parseInt(currentLen) - parseInt(maxLen)}
                    </div>
                </>) : (<>
                    {picNameArr.map((data, i) => (<>
                        <Avatar
                            style={{ width: `${widthHeight}`, height: `${widthHeight}`, position: 'relative', left: `-${i * 8}px`, zIndex: `${i + 9}` }}
                            alt={data?.parent?.displayName}
                            src={data?.parent?.displayPicture?.url}
                        />
                    </>))}
                </>)}
            </div>
        </>)}
    </>
    );
}

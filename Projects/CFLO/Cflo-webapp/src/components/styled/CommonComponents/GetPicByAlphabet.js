import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import imgOfB from "../../../Assets/Allalphabet/b.png"
import imgOfC from "../../../Assets/Allalphabet/c.png"
import imgOfA from "../../../Assets/Allalphabet/a.png"
import imgOfD from "../../../Assets/Allalphabet/d.png"
import imgOfE from "../../../Assets/Allalphabet/e.png"
import imgOfF from "../../../Assets/Allalphabet/f.png"
import imgOfG from "../../../Assets/Allalphabet/g.png"
import imgOfH from "../../../Assets/Allalphabet/h.png"
import imgOfI from "../../../Assets/Allalphabet/i.png"
import imgOfJ from "../../../Assets/Allalphabet/j.png"
import imgOfK from "../../../Assets/Allalphabet/k.png"
import imgOfL from "../../../Assets/Allalphabet/l.png"
import imgOfM from "../../../Assets/Allalphabet/m.png"
import imgOfN from "../../../Assets/Allalphabet/n.png"
import imgOfO from "../../../Assets/Allalphabet/o.png"
import imgOfP from "../../../Assets/Allalphabet/p.png"
import imgOfQ from "../../../Assets/Allalphabet/q.png"
import imgOfR from "../../../Assets/Allalphabet/r.png"
import imgOfS from "../../../Assets/Allalphabet/s.png"
import imgOfT from "../../../Assets/Allalphabet/t.png"
import imgOfU from "../../../Assets/Allalphabet/u.png"
import imgOfV from "../../../Assets/Allalphabet/v.png"
import imgOfW from "../../../Assets/Allalphabet/w.png"
import imgOfX from "../../../Assets/Allalphabet/x.png"
import imgOfY from "../../../Assets/Allalphabet/y.png"
import imgOfZ from "../../../Assets/Allalphabet/z.png"
import Avatar from '@material-ui/core/Avatar';

export default function GetPicByAlphabet(props) {
    const { nameStr, dpUrl } = props

    let firstLetter = nameStr.charAt(0);
    let firstLetterInLowerCase = firstLetter.toLowerCase();
    let alphabetImgUrl

    switch (firstLetterInLowerCase) {
        case "a":
            alphabetImgUrl = imgOfA;
            break;
        case "b":
            alphabetImgUrl = imgOfB;
            break;
        case "c":
            alphabetImgUrl = imgOfC;
            break;
        case "d":
            alphabetImgUrl = imgOfD;
            break;
        case "e":
            alphabetImgUrl = imgOfE;
            break;
        case "f":
            alphabetImgUrl = imgOfF;
            break;
        case 'g':
            alphabetImgUrl = imgOfG;
            break;
        case "h":
            alphabetImgUrl = imgOfH;
            break;
        case "i":
            alphabetImgUrl = imgOfI;
            break;
        case "j":
            alphabetImgUrl = imgOfJ;
            break;
        case "k":
            alphabetImgUrl = imgOfK;
            break;
        case "l":
            alphabetImgUrl = imgOfL;
            break;
        case "m":
            alphabetImgUrl = imgOfM;
            break;
        case "n":
            alphabetImgUrl = imgOfN;
            break;
        case "o":
            alphabetImgUrl = imgOfO;
            break;
        case "p":
            alphabetImgUrl = imgOfP;
            break;
        case "q":
            alphabetImgUrl = imgOfQ;
            break;
        case "r":
            alphabetImgUrl = imgOfR;
            break;
        case "s":
            alphabetImgUrl = imgOfS;
            break;
        case "t":
            alphabetImgUrl = imgOfT;
            break;
        case "u":
            alphabetImgUrl = imgOfU;
            break;
        case "v":
            alphabetImgUrl = imgOfV;
            break;
        case "w":
            alphabetImgUrl = imgOfW;
            break;
        case "x":
            alphabetImgUrl = imgOfX;
            break;
        case "y":
            alphabetImgUrl = imgOfY;
            break;
        case "z":
            alphabetImgUrl = imgOfZ;
            break;
    }

    return (
        <>
            {dpUrl ? (
                <Avatar
                    alt={nameStr}
                    src={dpUrl}
                />
            ) : (
                <Avatar
                    alt={nameStr}
                    src={alphabetImgUrl}
                />
            )}
        </>
    )
}



















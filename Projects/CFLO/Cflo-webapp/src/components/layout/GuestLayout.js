import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../landing/footer/footer";
import GuestLayoutHeader from "../Navbar/GuestLayout.Header";

const useStyles = makeStyles((theme) => ({
    mainComponentCont: {
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#F5F7FA",
    }
}));


const GuestLayout = ({ children, dontNeedFooter = false, HeaderProp, headerHeight, ...props }) => {
    const classes = useStyles();
    const Header = HeaderProp ? HeaderProp : GuestLayoutHeader;
    const hight = headerHeight ? headerHeight : "70px"
    const paddingB = headerHeight ? "0px" : "6rem"

    return (
        <>
            <Header height={hight} />
            <div
                className={classes.mainComponentCont}
                style={{ height: `calc(100vh - ${hight})`, paddingBottom: paddingB }}
            >
                {children}
            </div>
            {!dontNeedFooter && (<Footer />)}
        </>
    );
};

export default GuestLayout;
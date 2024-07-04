import React from "react";
import { Route } from "react-router-dom";
import GuestLayout from "../layout/GuestLayout";


const SharePageRouter = ({
    component: Component, HeaderProp, dontNeedFooter, headerHeight, ...rest
}) => {

    return (
        <Route
            {...rest}
            render={(props) => (
                <GuestLayout HeaderProp={HeaderProp} headerHeight={headerHeight} dontNeedFooter={dontNeedFooter} >
                    <Component {...props} {...rest} />
                </GuestLayout>
            )}
        />
    );
};

export default SharePageRouter;

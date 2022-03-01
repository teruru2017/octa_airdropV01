
import React from "react"

const DefaultLayout = ({ children, ...rest }) => {
    return (
        <main>{children}</main>
    );
};

export default DefaultLayout;
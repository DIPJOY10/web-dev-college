import React, { useState, useEffect } from 'react';

export default function LessText(props) {
    const { limit, string } = props;
    const [orgStr, setOrgStr] = useState("");


    useEffect(() => {
        if (string && string?.length > 0) {
            const trimmedStr = string.substr(0, limit)
            let str = trimmedStr
            if (string.length > limit) {
                str = str + "..."
            }
            setOrgStr(str)
        }
    }, [limit, string]);


    return (
        <>{orgStr}</>
    );
}

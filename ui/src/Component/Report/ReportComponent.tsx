import * as React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportLogic } from "./ReportLogic";

export function ReportComponent() {
    const { reports, autoRefresh, updated, requestTime, timeout } = useValues(ReportLogic);
    const { update } = useActions(ReportLogic);

    useEffect(() => {
        if (updated && autoRefresh) {
            const actualTimeout = requestTime >= timeout ? 0 : (timeout - requestTime);

            let timeoutId = setTimeout(() => {
                update();
            }, actualTimeout);

            return () => clearInterval(timeoutId);
        }
    }, [updated, autoRefresh]);

    return (
        <Container>
            <pre>
                <code>
                    {JSON.stringify(reports, null, "  ")}
                </code>
            </pre>
        </Container>
    );
}

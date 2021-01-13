export interface SystemServiceDefinition {
    Unit?: {
        Description?: string;
        Requires?: string;
        After?: string;
    },

    Service: {
        Type?: "oneshot" | "simple",
        ExecStartPost?: string[];
        ExecStart?: string[];
        RestartSec?: number;
        Restart?: "always" | "on-failure";
        KillSignal?: NodeJS.Signals;
        StandardOutput?: "syslog" | string;
        StandardError?: "syslog" | string;
        SyslogIdentifier?: string;
        User?: string;
    }

    Install?: {
        WantedBy?: "multi-user.target";
    }
}

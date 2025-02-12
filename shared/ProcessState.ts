export enum ProcessState {
    /** The process has been stopped due to a stop request or has never been started. */
    STOPPED  = 0,

    /**  The process is starting due to a start request. */
    STARTING = 10,

    /**  The process is running. */
    RUNNING  = 20,

    /** The process entered the STARTING state but subsequently exited too quickly (before the time defined in startsecs) to move to the RUNNING state. */
    BACKOFF  = 30,

    /** The process is stopping due to a stop request. */
    STOPPING = 40,

    /** The process exited from the RUNNING state (expectedly or unexpectedly). */
    EXITED   = 100,

    /** The process could not be started successfully. */
    FATAL    = 200,

    /** The process is in an unknown state (supervisord programming error). */
    UNKNOWN  = 1000,

}

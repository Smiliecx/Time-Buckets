import React from "react";
import { connect } from "react-redux";
import { Segment, Icon } from "semantic-ui-react";
import {
    setTimerDuration,
    removeTimerByID,
    incrementTimerDurationByID,
    restartTimerByID
} from "../../Redux/Actions/TimerActions";
import moment from "moment";
import { subscribe } from "../../Redux/StoreSubscriber";
import EditTimerModal from "./EditTimerModal";
import { increaseBucketAmountByColor } from "../../Redux/Actions/TimeBucketActions";

class Timer extends React.Component {
    state = {
        invervalID: null,
        previousRecordedTime: null,
        startingDuration: 0,
        bDisplayEditTimerModal: false,
        unsubscribeFromStore: null,
        bIsPlaying: false
    };

    constructor(props) {
        super(props);
        this.countDown = this.countDown.bind(this);
    }

    countDown() {
        const { timerData } = this.props;

        const timeElapsed = moment().diff(this.state.previousRecordedTime);
        const timeElapsedInSeconds = Math.round(
            moment.duration(timeElapsed).asSeconds()
        );

        this.props.incrementTimerDurationByID(
            timerData.id,
            -timeElapsedInSeconds
        );

        if (timerData.duration < 0) {
            this.props.increaseBucketAmountByColor(
                timerData.timerBucketColor,
                timeElapsedInSeconds
            );
        }

        this.setState({
            previousRecordedTime: moment()
        });
    }

    displayEditTimerModal = () => {
        this.setState({
            bDisplayEditTimerModal: true
        });
    };

    closeModals = () => {
        this.setState({
            bDisplayEditTimerModal: false
        });
    };

    removeTimer = () => {
        this.stopTimer();
        this.props.removeTimerByID(this.props.timerData.id);
    };

    timerListChanged = (newState, prevState) => {
        const newTimerList = newState.Timers.timerList;

        const newTimer = newTimerList.find((timer) => {
            return timer.id === this.props.timerData.id;
        });

        if (newTimer.startingDuration !== this.state.startingDuration) {
            this.setState({
                previousRecordedTime: moment(),
                startingDuration: newTimer.startingDuration
            });
        }
    };

    restartTimer = () => {
        this.props.restartTimerByID(this.props.timerData.id);
    }

    toggleTimer = () => {
        if (this.state.bIsPlaying) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    };

    startTimer = () => {
        this.setState({
            intervalID: setInterval(this.countDown, 1000),
            previousRecordedTime: moment(),
            unsubscribeFromStore: subscribe(
                "Timers.timerList",
                this.timerListChanged
            ),
            startingDuration: this.props.startingDuration,
            bIsPlaying: true
        });
    };

    stopTimer = () => {
        clearInterval(this.state.intervalID);
        this.state.unsubscribeFromStore();
        this.setState({
            bIsPlaying: false
        });
    };

    componentDidMount = () => {
        if (this.props.bIsFirstTimer) {
            this.startTimer();
        }
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.bIsFirstTimer !== this.props.bIsFirstTimer) {
            if (this.props.bIsFirstTimer) {
            } else {
                this.stopTimer();
            }
        }
    };

    render() {
        const { timerData, bIsFirstTimer } = this.props;
        const { bDisplayEditTimerModal, bIsPlaying } = this.state;
        return (
            <React.Fragment>
                <Segment color={timerData.bucketColor} raised>
                    <span
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <h3 style={{ padding: 0, marginBottom: 3 }}>
                                Timer
                            </h3>
                            <Icon
                                style={{ paddingLeft: 5 }}
                                onClick={this.displayEditTimerModal}
                                name="edit"
                                size="small"
                                color="yellow"
                                link
                            />
                        </span>

                        <div
                            style={
                                timerData.duration >= 0
                                    ? { color: "black" }
                                    : { color: "red" }
                            }>
                            {timerData.duration}
                        </div>

                        <Icon
                            onClick={this.toggleTimer}
                            size="small"
                            link={bIsFirstTimer}
                            color={bIsPlaying ? "red" : "green"}
                            name={bIsPlaying ? "stop" : "play"}
                            disabled={!bIsFirstTimer}
                        />
                        <Icon onClick={this.restartTimer} name="repeat" size="small" link color="yellow" />
                    </span>
                </Segment>
                {bDisplayEditTimerModal && (
                    <EditTimerModal
                        closeModal={this.closeModals}
                        removeTimer={this.removeTimer}
                        timerID={timerData.id}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default connect(
    null,
    {
        setTimerDuration,
        removeTimerByID,
        increaseBucketAmountByColor,
        incrementTimerDurationByID,
        restartTimerByID
    }
)(Timer);

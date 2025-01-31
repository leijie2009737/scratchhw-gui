import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratchhw-vm';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SB3Downloader from './sb3-downloader.jsx';
import AlertComponent from '../components/alerts/alert.jsx';
import {openConnectionModal, openUploadProgress} from '../reducers/modals';
import {showStandardAlert} from '../reducers/alerts';
import {setConnectionModalExtensionId} from '../reducers/connection-modal';
import {manualUpdateProject} from '../reducers/project-state';

class Alert extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOnCloseAlert',
            'handleDownloadFirmware',
            'handleOnReconnect'
        ]);
    }
    handleOnCloseAlert () {
        this.props.onCloseAlert(this.props.index);
    }
    handleDownloadFirmware () {
        if (this.props.peripheralName) {
            this.props.vm.uploadFirmwareToPeripheral(this.props.extensionId);
            this.props.onOpenUploadProgress();
        } else {
            this.props.onNoPeripheralIsConnected();
        }
        this.handleOnCloseAlert();
    }
    handleOnReconnect () {
        this.props.onOpenConnectionModal(this.props.extensionId);
        this.handleOnCloseAlert();
    }
    render () {
        const {
            closeButton,
            content,
            extensionName,
            extensionMessage,
            index, // eslint-disable-line no-unused-vars
            level,
            iconSpinner,
            iconURL,
            message,
            onSaveNow,
            showDownload,
            showDownloadFirmware,
            showReconnect,
            showSaveNow
        } = this.props;
        return (
            <SB3Downloader>{(_, downloadProject) => (
                <AlertComponent
                    closeButton={closeButton}
                    content={content}
                    extensionName={extensionName}
                    extensionMessage={extensionMessage}
                    iconSpinner={iconSpinner}
                    iconURL={iconURL}
                    level={level}
                    message={message}
                    showDownload={showDownload}
                    showDownloadFirmware={showDownloadFirmware}
                    showReconnect={showReconnect}
                    showSaveNow={showSaveNow}
                    onCloseAlert={this.handleOnCloseAlert}
                    onDownload={downloadProject}
                    onReconnect={this.handleOnReconnect}
                    onDownloadFirmware={this.handleDownloadFirmware}
                    onSaveNow={onSaveNow}
                />
            )}</SB3Downloader>
        );
    }
}

const mapStateToProps = state => ({
    peripheralName: state.scratchGui.connectionModal.peripheralName
});

const mapDispatchToProps = dispatch => ({
    onOpenConnectionModal: id => {
        dispatch(setConnectionModalExtensionId(id));
        dispatch(openConnectionModal());
    },
    onOpenUploadProgress: () => dispatch(openUploadProgress()),
    onNoPeripheralIsConnected: () => dispatch(showStandardAlert('connectAPeripheralFirst')),
    onSaveNow: () => {
        dispatch(manualUpdateProject());
    }
});

Alert.propTypes = {
    closeButton: PropTypes.bool,
    content: PropTypes.element,
    extensionId: PropTypes.string,
    extensionName: PropTypes.string,
    extensionMessage: PropTypes.string,
    iconSpinner: PropTypes.bool,
    iconURL: PropTypes.string,
    index: PropTypes.number,
    level: PropTypes.string.isRequired,
    message: PropTypes.string,
    onCloseAlert: PropTypes.func.isRequired,
    onOpenConnectionModal: PropTypes.func,
    onOpenUploadProgress: PropTypes.func,
    onNoPeripheralIsConnected: PropTypes.func.isRequired,
    onSaveNow: PropTypes.func,
    peripheralName: PropTypes.string,
    showDownload: PropTypes.bool,
    showDownloadFirmware: PropTypes.bool,
    showReconnect: PropTypes.bool,
    showSaveNow: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Alert);

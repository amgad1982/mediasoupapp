import { Router } from "mediasoup/lib/types";
import { config } from '../config'


const createWebRtcTransport = async (mediasoupRouter: Router) => {
    const {
        maxIncomeBitRate,
        initialAvailableOutgoingBitrate,
    } = config.mediasoup.webRtcTransport;

    const transport = await mediasoupRouter.createWebRtcTransport({
        listenIps: config.mediasoup.webRtcTransport.listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate
    });

    if (maxIncomeBitRate) {
        try {
            await transport.setMaxIncomingBitrate(maxIncomeBitRate);
        } catch (error) {
            console.error(error);
        }
    }
    return {
        transport,
        params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters:transport.dtlsParameters
        },
    }
}
export { createWebRtcTransport };




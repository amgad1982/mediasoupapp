import { RtpCodecCapability } from "mediasoup/lib/RtpParameters";
import { TransportListenIp } from "mediasoup/lib/Transport";
import { WorkerLogTag } from "mediasoup/lib/Worker";
import os from "os";

export const config = {
  listenIp: "0.0.0.0",
  listenPort: 3016,

  mediasoup: {
    numWorkers: Object.keys(os.cpus()).length,
    worker: {
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
      logLevel: "debug",
      logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"] as WorkerLogTag[],
    },
    router: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 20,
        },
        {
          kind: "video",
          mimeType: "video/VP8",
          clockRate: 90000,
          parameters: {
            "x-google-start-biterate": 1000,
          },
        },
      ] as RtpCodecCapability[],
    },
    webRtctransport: {
      listenIps: [
        {
          ip: "0.0.0.0",
          announcedIp: "127.0.0.1", //change to public ip
        },
      ] as TransportListenIp[],
    },
  },
} as const;

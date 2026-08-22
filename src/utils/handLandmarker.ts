import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

let handLandmarkerInstance: HandLandmarker | null = null;
let isInitializing = false;
let initPromise: Promise<HandLandmarker | null> | null = null;

/**
 * Initializes and returns a cached HandLandmarker instance.
 * Uses MediaPipe Vision wasm assets and official hand landmark model.
 */
export async function getHandLandmarker(): Promise<HandLandmarker | null> {
  if (handLandmarkerInstance) {
    return handLandmarkerInstance;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      handLandmarkerInstance = landmarker;
      return landmarker;
    } catch (error) {
      console.warn('GPU delegate failed or CDN error, trying CPU fallback:', error);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        handLandmarkerInstance = landmarker;
        return landmarker;
      } catch (fallbackError) {
        console.warn('MediaPipe HandLandmarker initialization failed:', fallbackError);
        return null;
      }
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

export interface HandStatus {
  hasHand: boolean;
  isInsideFrame: boolean;
  isSizeAppropriate: boolean;
  isOpenPalm: boolean;
  isStable: boolean;
  stabilityProgress: number; // 0 to 100
  qualityFeedback: string;
  landmarks?: { x: number; y: number; z: number }[];
  boundingBox?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
}

/**
 * Analyzes landmarks to check if hand is open, well-framed, and facing camera
 */
export function evaluateHandPose(
  landmarks: { x: number; y: number; z: number }[],
  language: string = 'English'
): {
  isInsideFrame: boolean;
  isSizeAppropriate: boolean;
  isOpenPalm: boolean;
  qualityFeedback: string;
  boundingBox: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number };
} {
  const isHindi = language === 'Hindi';

  // 1. Calculate bounding box
  let minX = 1,
    minY = 1,
    maxX = 0,
    maxY = 0;

  for (const pt of landmarks) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const boundingBox = { minX, minY, maxX, maxY, width, height };

  // 2. Check if all key landmarks are inside frame bounds (with safe padding margin)
  const isInsideFrame = minX >= 0.05 && maxX <= 0.95 && minY >= 0.05 && maxY <= 0.95;

  if (!isInsideFrame) {
    return {
      isInsideFrame: false,
      isSizeAppropriate: false,
      isOpenPalm: false,
      qualityFeedback: isHindi ? 'हथेली को कैमरे के बीच में लाएँ' : 'Center your palm in the frame',
      boundingBox,
    };
  }

  // 3. Check hand size (hand should cover a good portion of frame, not tiny or overflowing)
  const area = width * height;
  const isTooSmall = area < 0.06 || width < 0.2 || height < 0.25;
  const isTooBig = area > 0.85 || width > 0.9 || height > 0.9;

  if (isTooSmall) {
    return {
      isInsideFrame: true,
      isSizeAppropriate: false,
      isOpenPalm: false,
      qualityFeedback: isHindi ? 'हथेली को कैमरे के थोड़ा पास लाएँ' : 'Move palm slightly closer',
      boundingBox,
    };
  }

  if (isTooBig) {
    return {
      isInsideFrame: true,
      isSizeAppropriate: false,
      isOpenPalm: false,
      qualityFeedback: isHindi ? 'हथेली को कैमरे से थोड़ा दूर रखें' : 'Move palm slightly back',
      boundingBox,
    };
  }

  // 4. Check if palm is open & facing camera
  // Landmarks: 0 (wrist), 5 (index MCP), 9 (middle MCP), 13 (ring MCP), 17 (pinky MCP)
  // Tips: 8 (index tip), 12 (middle tip), 16 (ring tip), 20 (pinky tip)
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const middleTip = landmarks[12];
  const indexTip = landmarks[8];
  const ringTip = landmarks[16];

  const wristToMcpDist = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y);
  const wristToMiddleTipDist = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
  const wristToIndexTipDist = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
  const wristToRingTipDist = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);

  // An open palm facing camera has fingers extended outward
  const isOpenPalm =
    wristToMiddleTipDist > wristToMcpDist * 1.35 &&
    wristToIndexTipDist > wristToMcpDist * 1.25 &&
    wristToRingTipDist > wristToMcpDist * 1.25;

  if (!isOpenPalm) {
    return {
      isInsideFrame: true,
      isSizeAppropriate: true,
      isOpenPalm: false,
      qualityFeedback: isHindi ? 'कृपया हथेली को खोलकर सामने रखें' : 'Open palm facing the camera',
      boundingBox,
    };
  }

  return {
    isInsideFrame: true,
    isSizeAppropriate: true,
    isOpenPalm: true,
    qualityFeedback: isHindi ? 'हथेली पहचानी गई' : 'Palm detected',
    boundingBox,
  };
}

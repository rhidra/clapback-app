// import { MediaCapture } from '@ionic-native/media-capture/ngx';
import {Observable, Observer} from 'rxjs';

export interface MediaFile {
    /**
     * The name of the file, without path information.
     */
    name: string;
    /**
     * The full path of the file, including the name.
     */
    fullPath: string;
    /**
     * The file's mime type
     */
    type: string;
    /**
     * The date and time when the file was last modified.
     */
    lastModifiedDate: Date;
    /**
     * The size of the file, in bytes.
     */
    size: number;
    /**
     * Retrieves the format information of the media file.
     */
    getFormatData(successCallback: (data: MediaFileData) => any, errorCallback?: (err: any) => any): void;
}
export interface MediaFileData {
    /**
     * The actual format of the audio and video content.
     */
    codecs: string;
    /**
     * The average bitrate of the content. The value is zero for images.
     */
    bitrate: number;
    /**
     * The height of the image or video in pixels. The value is zero for audio clips.
     */
    height: number;
    /**
     * The width of the image or video in pixels. The value is zero for audio clips.
     */
    width: number;
    /**
     * The length of the video or sound clip in seconds. The value is zero for images.
     */
    duration: number;
}
export interface CaptureError {
    code: string;
}
export interface CaptureAudioOptions {
    /**
     * Maximum number of audio clips. Defaults to 1.
     * On iOS you can only record one file.
     */
    limit?: number;
    /**
     * Maximum duration of an audio sound clip, in seconds. This does not work on Android devices.
     */
    duration?: number;
}
export interface CaptureImageOptions {
    /**
     * Maximum number of images to capture. This limit is not supported on iOS, only one image will be taken per invocation.
     */
    limit?: number;
}
export interface CaptureVideoOptions {
    /**
     * Maximum number of video clips to record. This value is ignored on iOS, only one video clip can be taken per invocation.
     */
    limit?: number;
    /**
     * Maximum duration per video clip. This will be ignored on BlackBerry.
     */
    duration?: number;
    /**
     * Quality of the video. This parameter can only be used with Android.
     */
    quality?: number;
}
export interface ConfigurationData {
    /**
     * The ASCII-encoded lowercase string representing the media type.
     */
    type: string;
    /**
     * The height of the image or video in pixels. The value is zero for sound clips.
     */
    height: number;
    /**
     * The width of the image or video in pixels. The value is zero for sound clips.
     */
    width: number;
}

export class MediaCaptureMock /* extends MediaCapture */ {
    /**
     * The recording image sizes and formats supported by the device.
     */
    supportedImageModes: ConfigurationData[];
    /**
     * The audio recording formats supported by the device.
     */
    supportedAudioModes: ConfigurationData[];
    /**
     * The recording video resolutions and formats supported by the device.
     */
    supportedVideoModes: ConfigurationData[];
    /**
     * Start the audio recorder application and return information about captured audio clip files.
     */
    captureAudio(options?: CaptureAudioOptions): Promise<MediaFile[] | CaptureError> {
        const response: Array<MediaFile> = [];
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    }

    /**
     * Start the camera application and return information about captured image files.
     */
    captureImage(options?: CaptureImageOptions): Promise<MediaFile[] | CaptureError> {
        const response: Array<MediaFile> = [];
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    }

    /**
     * Start the video recorder application and return information about captured video clip files.
     */
    captureVideo(options?: CaptureVideoOptions): Promise<MediaFile[] | CaptureError> {
        const response: Array<MediaFile|any> = [{
            getFormatData: (successCallback: (data: MediaFileData) => any, errorCallback?: (err: any) => any) => {},
            name: 'VID_20200314_185158.mp4',
            localURL: 'cdvfile://localhost/sdcard/DCIM/Camera/VID_20200314_185158.mp4',
            type: 'video/mp4',
            lastModified: null,
            lastModifiedDate: 1584208322000 as any,
            size: 20105825,
            start: 0,
            end: 0,
            fullPath: 'file:///storage/emulated/0/DCIM/Camera/VID_20200314_185158.mp4',
        }];
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    }

    /**
     * is fired if the capture call is successful
     */
    onPendingCaptureResult(): Observable<MediaFile[]> {
        const response: Array<MediaFile> = [];
        return Observable.create((observer: Observer<any>) => {
            observer.next(response);
            observer.complete();
        });
    }

    /**
     * is fired if the capture call is unsuccessful
     */
    onPendingCaptureError(): Observable<CaptureError> {
        const response: Array<MediaFile> = [];
        return Observable.create((observer: Observer<any>) => {
            observer.next(response);
            observer.complete();
        });
    }
}

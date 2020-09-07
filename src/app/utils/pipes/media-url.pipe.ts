import { Pipe, PipeTransform } from '@angular/core';
import {environment as env} from "../../../environments/environment";
import {verifyHostBindings} from "@angular/compiler";

/*
 * Format a media URL according to the backend expectation.
 * Usage:
 *    {{ fileId | mediaUrl:'[image|video|thumbnail|videoMP4]' :quality :width :height }}
 */
@Pipe({
  name: 'mediaUrl'
})
export class MediaUrlPipe implements PipeTransform {

  buildOpt(quality: number, width: number, height: number) {
    let opt = '';
    if (quality !== -1) {
      opt += '_q' + quality;
    }
    if (width !== -1) {
      opt += '_w' + width;
    }
    if (height !== -1) {
      opt += '_h' + height;
    }
    return opt;
  }

  transform(id: string, type: 'image' | 'video' | 'thumbnail' | 'videoMP4' | 'avatar', quality: number = -1, width: number = -1, height: number = -1): string {
    const opt = this.buildOpt(quality, width, height);

    switch (type) {
      case 'videoMP4':
        return `${env.apiUrl}media/video/${id}/mp4`;
      case 'video':
        return `${env.apiUrl}media/video/${id}/hls`;
      case 'thumbnail':
        return `${env.apiUrl}media/video/${id}${opt}/thb`;
      case 'image':
        const [_, fileId, ext] = /^([a-zA-Z0-9\-]*)\.(.*)$/.exec(id);
        return `${env.apiUrl}media/image/${fileId}${opt}.${ext}`;
      case 'avatar':
        if (!id) {
          return '/assets/img/avatar.png';
        }
        const [_1, fileId1, ext1] = /^([a-zA-Z0-9\-]*)\.(.*)$/.exec(id);
        return `${env.apiUrl}media/image/${fileId1}${opt}.${ext1}`;
    }
  }
}

import {
    Inject,
    Injectable,
    NgZone,
    Optional,
    TemplateRef,
  } from '@angular/core';
  import {
    DialogPosition,
    MatDialog,
    MatDialogConfig as _MatDialogConfig,
    MatDialogRef,
  } from '@angular/material/dialog';
  import { ComponentType } from '@angular/cdk/portal';
  import { Subject } from 'rxjs';
  
  const diractionMap: any = {
    left: 'left',
    right: 'left',
    top: 'top',
    bottom: 'top',
    center: 'center',
  };
  const multyMap: any = { left: 1, right: -1, top: 1, bottom: -1, center: 0 };
  
  interface AnimationOption {
    keyframes?: Keyframe[];
    keyframeAnimationOptions: KeyframeAnimationOptions;
  }
  
  export interface MatDialogConfig extends _MatDialogConfig {
    animation?:
      | {
          to: 'center' | 'aside' | 'top' | 'bottom' | 'left' | 'right';
          incomingOptions?: {
            keyframes?: Keyframe[];
            keyframeAnimationOptions: KeyframeAnimationOptions;
          };
          outgoingOptions?: {
            keyframes?: Keyframe[];
            keyframeAnimationOptions: KeyframeAnimationOptions;
          };
        }
      | {
          to?: 'center' | 'aside' | 'top' | 'bottom' | 'left' | 'right';
          incomingOptions?: {
            keyframes: Keyframe[];
            keyframeAnimationOptions: KeyframeAnimationOptions;
          };
          outgoingOptions?: {
            keyframes: Keyframe[];
            keyframeAnimationOptions: KeyframeAnimationOptions;
          };
        };
    position?: DialogPosition & { rowStart?: string; rowEnd?: string };
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class NgDialogAnimationService {
    constructor(
      private dialog: MatDialog,
      private ngZone: NgZone,
      @Optional()
      @Inject('INCOMING_OPTION')
      private incomingOptions?: AnimationOption,
      @Optional()
      @Inject('OUTGOING_OPTION')
      private outgoingOptions?: AnimationOption
    ) {}
  
    open<T, D = any, R = any>(
      componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
      config?: MatDialogConfig| any
    ): MatDialogRef<T, R> {
      const dir: 'ltr' | 'rtl' =
        config.direction ||
        (document.querySelectorAll('[dir="rtl"]').length ? 'rtl' : 'ltr');
      config.direction = config.direction || dir;
      if (config.animation) {
        if (config.position && config.position.rowEnd) {
          if (dir === 'rtl') {
            config.position.right = config.position.rowEnd;
          } else {
            config.position.left = config.position.rowEnd;
          }
        }
  
        if (config.position && config.position.rowStart) {
          if (dir === 'rtl') {
            config.position.left = config.position.rowEnd;
          } else {
            config.position.right = config.position.rowEnd;
          }
        }
      }
  
      const ref = this.dialog.open(componentOrTemplateRef, config);
      const container = document.getElementsByTagName(
        'mat-dialog-container'
      )[0] as HTMLElement;
  
      if (config.animation) {
        const incomingOptions: AnimationOption = {
          keyframeAnimationOptions: { duration: 400, easing: 'ease-in' },
        };
        const outgoingOptions: AnimationOption = {
          keyframeAnimationOptions: { duration: 400, easing: 'ease-out' },
        };
  
        const wrapper = document.getElementsByClassName(
          'cdk-global-overlay-wrapper'
        )[0];
  
        const animate = (keyframes: any, options: any) =>
          wrapper.animate(keyframes, options);
  
        const _afterClosed = new Subject();
        ref.afterClosed = () => _afterClosed.asObservable();
  
        const closeFunction = ref.close;
  
        let incomeKeyFrames = incomingOptions.keyframes;
        let outgoingKeyFrames = outgoingOptions.keyframes;
  
        if (config.animation.to) {
          const to = diractionMap[config.animation.to];
          const keyFrame100: any = {};
          const keyFrame0: any = {};
          keyFrame0[to] = 0;
          keyFrame100[to] =
            to === 'top' || to === 'bottom'
              ? container.clientHeight * multyMap[config.animation.to] + 'px'
              : container.clientWidth * multyMap[config.animation.to] + 'px';
          incomeKeyFrames = incomeKeyFrames || [keyFrame100, keyFrame0];
          outgoingKeyFrames = outgoingKeyFrames || [keyFrame0, keyFrame100];
        }
        let value: any;
        animate(incomeKeyFrames, incomingOptions.keyframeAnimationOptions);
        const closeHandler = (dialogResult?: R) => {
          _afterClosed.next(value);
          const animation = animate(
            outgoingKeyFrames,
            outgoingOptions.keyframeAnimationOptions
          );
          animation.onfinish = () => {
            (wrapper as HTMLElement).style.display = 'none';
            this.ngZone.run(() => ref.close(dialogResult));
          };
          ref.close = closeFunction;
        };
        ref.close = (dialogResult?: R) => closeHandler(dialogResult);
      }
  
      return ref;
    }
  }
  
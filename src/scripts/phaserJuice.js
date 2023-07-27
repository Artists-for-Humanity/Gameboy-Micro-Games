export default class phaserJuice {
    constructor(scene) {
      (this.scene = scene),
        (this.options = function (effectOptions, option) {
          0 === (option = option || {}).x
            ? (option.x = 1e-5)
            : 0 === option.y && (option.y = 1e-5);
          const config = {
            x: option.x || effectOptions.x,
            y: option.y || effectOptions.y,
            alpha: option.alpha || effectOptions.alpha,
            scaleX: option.scaleX || effectOptions.scaleX,
            scaleY: option.scaleY || effectOptions.scaleY,
            angle: option.angle || effectOptions.angle,
            duration: option.duration || effectOptions.duration,
            yoyo: option.yoyo || effectOptions.yoyo,
            repeat: option.repeat || effectOptions.repeat,
            ease: option.ease || effectOptions.ease,
            delay: option.delay || effectOptions.delay,
            paused: option.paused || effectOptions.paused,
            onStart: option.onStart || effectOptions.onStart,
            onComplete: option.onComplete || effectOptions.onComplete,
          };
          return config;
        });
    }
    add(target) {
      return (this.target = target), this;
    }
    shake(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const shakeConfig = {
        x: 5,
        y: 0,
        duration: 50,
        yoyo: !0,
        repeat: 8,
        ease: "Bounce.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(shakeConfig, config);
      return (
        (this.shakeTween = scene.tweens.add({
          targets: target,
          x: target.x + options.x,
          y: target.y - options.y,
          duration: options.duration,
          yoyo: options.yoyo,
          repeat: options.repeat,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && shake.remove();
          },
        })),
        this
      );
    }
    shakeY(target) {
      null == target && (target = this.target);
      const config = { x: 0, y: 5 };
      let shake = this.shake(target, config);
    }
    wobble(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const wobbleConfig = {
        x: 20,
        y: 0,
        duration: 150,
        yoyo: !0,
        repeat: 5,
        ease: "Sine.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(wobbleConfig, config);
      return (
        (this.wobbleTween = scene.tweens.add({
          targets: target,
          x: target.x + options.x,
          y: target.y + options.y,
          duration: options.duration,
          yoyo: options.yoyo,
          repeat: options.repeat,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && wobble.remove();
          },
        })),
        this
      );
    }
    wobbleY(target) {
      null == target && (target = this.target);
      const config = { x: 0, y: 20 };
      let shake = this.wobble(target, config);
    }
    scaleUp(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const growConfig = {
        scaleX: target.scaleX + 0.25,
        scaleY: target.scaleY + 0.25,
        duration: 750,
        delay: 0,
        paused: !1,
      };
      let options = this.options(growConfig, config);
      return (
        (this.scaleUpTween = scene.tweens.add({
          targets: target,
          scaleX: options.scaleX,
          scaleY: options.scaleY,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && grow.remove();
          },
        })),
        this
      );
    }
    scaleDown(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const shrinkConfig = {
        scaleX: target.scaleX - 0.25,
        scaleY: target.scaleY - 0.25,
        duration: 750,
        delay: 0,
        paused: !1,
      };
      let options = this.options(shrinkConfig, config);
      return (
        (this.scaleDown = scene.tweens.add({
          targets: target,
          scaleX: options.scaleX,
          scaleY: options.scaleY,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && shrink.remove();
          },
        })),
        this
      );
    }
    pulse(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const pulseConfig = {
        scaleX: 1.25 * target.scaleX,
        scaleY: 1.25 * target.scaleY,
        duration: 750,
        repeat: 2,
        yoyo: !0,
        ease: "Quad.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(pulseConfig, config);
      return (
        (this.pulseTween = scene.tweens.add({
          targets: target,
          scaleX: options.scaleX,
          scaleY: options.scaleY,
          yoyo: options.yoyo,
          repeat: options.repeat,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && pulse.remove();
          },
        })),
        this
      );
    }
    flash(target, duration, color) {
      const scene = this.scene;
      null == target && (target = this.target),
        null == duration && (duration = 150),
        null == color && (color = "0xffffff"),
        target.setTintFill(color);
      let flashTimer = scene.time.addEvent({
        delay: duration,
        callback: function () {
          target.setTint("0xffffff");
        },
        callbackScope: this,
      });
      return this;
    }
    rotate(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const rotateConfig = {
        angle: 360,
        duration: 500,
        ease: "Circular.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(rotateConfig, config);
      return (
        (this.rotateTween = scene.tweens.add({
          targets: target,
          angle: options.angle,
          yoyo: options.yoyo,
          repeat: options.repeat,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && rotate.remove();
          },
        })),
        this
      );
    }
    bounce(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const bounceConfig = {
        y: 25,
        duration: 1e3,
        ease: "Bounce",
        delay: 0,
        paused: !1,
      };
      let options = this.options(bounceConfig, config);
      return (
        (this.bounceTween = scene.tweens.add({
          targets: target,
          y: target.y + options.y,
          repeat: options.repeat,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && bounce.remove();
          },
        })),
        this
      );
    }
    fadeIn(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const fadeInConfig = {
        alpha: 1,
        duration: 750,
        ease: "Circular.easeIn",
        delay: 0,
        paused: !1,
      };
      let options = this.options(fadeInConfig, config);
      return (
        (this.fadeInTween = scene.tweens.add({
          targets: target,
          alpha: options.alpha,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && fadeIn.remove();
          },
        })),
        this
      );
    }
    fadeOut(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const fadeOutConfig = {
        alpha: 0,
        duration: 750,
        ease: "Circular.easeOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(fadeOutConfig, config);
      return (
        (this.fadeOutTween = scene.tweens.add({
          targets: target,
          alpha: options.alpha,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && fadeOut.remove();
          },
        })),
        this
      );
    }
    fadeInOut(target, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target), null == destroy && (destroy = !1);
      const fadeInOutConfig = {
        alpha: 0,
        duration: 500,
        yoyo: !0,
        repeat: 3,
        ease: "Circular.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(fadeInOutConfig, config);
      return (
        (this.fadeInOutTween = scene.tweens.add({
          targets: target,
          alpha: options.alpha,
          duration: options.duration,
          yoyo: options.yoyo,
          repeat: options.repeat,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && fadeInOut.remove();
          },
        })),
        this
      );
    }
    flipX(target, direction, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target),
        null == direction && (direction = !0),
        null == destroy && (destroy = !1);
      const flipXConfig = {
        scaleX: (direction = direction ? -1 : 1),
        duration: 500,
        ease: "Sine.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(flipXConfig, config);
      return (
        (this.flipXTween = scene.tweens.add({
          targets: target,
          scaleX: options.scaleX,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && flipX.remove();
          },
        })),
        this
      );
    }
    flipY(target, direction, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target),
        null == direction && (direction = !0),
        null == destroy && (destroy = !1);
      const flipYConfig = {
        scaleY: (direction = direction ? -1 : 1),
        duration: 500,
        ease: "Sine.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(flipYConfig, config);
      return (
        (this.flipYTween = scene.tweens.add({
          targets: target,
          scaleY: options.scaleY,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && flipY.remove();
          },
        })),
        this
      );
    }
    spinX(target, direction, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target),
        null == direction && (direction = !0),
        null == destroy && (destroy = !1);
      const spinXConfig = {
        scaleX: (direction = direction ? -1 : 1),
        duration: 500,
        yoyo: !0,
        repeat: 3,
        ease: "Sine.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(spinXConfig, config);
      return (
        (this.spinXTween = scene.tweens.add({
          targets: target,
          scaleX: options.scaleX,
          yoyo: options.yoyo,
          repeat: options.repeat,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && spinX.remove();
          },
        })),
        this
      );
    }
    spinY(target, direction, config, destroy) {
      const scene = this.scene;
      null == target && (target = this.target),
        null == direction && (direction = !0),
        null == destroy && (destroy = !1);
      const spinYConfig = {
        scaleY: (direction = direction ? -1 : 1),
        duration: 500,
        yoyo: !0,
        repeat: 3,
        ease: "Sine.easeInOut",
        delay: 0,
        paused: !1,
      };
      let options = this.options(spinYConfig, config);
      return (
        (this.spinYTween = scene.tweens.add({
          targets: target,
          scaleY: options.scaleY,
          yoyo: options.yoyo,
          repeat: options.repeat,
          duration: options.duration,
          ease: options.ease,
          delay: options.delay,
          paused: options.paused,
          onStart: function (tween, target) {
            void 0 !== options.onStart && options.onStart(tween, target);
          },
          onComplete: function (tween, target) {
            void 0 !== options.onComplete && options.onComplete(tween, target),
              destroy && spinY.remove();
          },
        })),
        this
      );
    }
    reset(target) {
      return (
        null == target && (target = this.target),
        target.setAlpha(1),
        target.setScale(1),
        target.setAngle(0),
        target.setTint("0xffffff"),
        this
      );
    }
  }
  
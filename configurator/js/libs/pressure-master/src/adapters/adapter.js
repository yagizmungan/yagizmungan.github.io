/*
This is the base adapter from which all the other adapters extend.
*/

class Adapter{

  constructor(el, block, options){
    this.el = el;
    this.block = block;
    this.options = options;
    this.pressed = false;
    this.deepPressed = false;
    this.nativeSupport = false;
    this.runKey = Math.random();
  }

  setPressed(boolean){
    this.pressed = boolean;
  }

  setDeepPressed(boolean){
    this.deepPressed = boolean;
  }

  isPressed(){
    return this.pressed;
  }

  isDeepPressed(){
    return this.deepPressed;
  }

  add(event, set){
    this.el.addEventListener(event, set, false);
  }

  runClosure(method){
    if(method in this.block){
      // call the closure method and apply nth arguments if they exist
      this.block[method].apply(this.el, Array.prototype.slice.call(arguments, 1));
    }
  }

  fail(event, runKey){
    if(Config.get('polyfill', this.options)){
      if(this.runKey === runKey){
        this.runPolyfill(event);
      }
    } else {
      this.runClosure('unsupported', event);
    }
  }

  bindUnsupportedEvent(){
    this.add(isMobile ? 'touchstart' : 'mousedown', (event) => this.runClosure('unsupported', event));
  }

  _startPress(event){
    if(this.isPressed() === false){
      this.setPressed(true);
      this.runClosure('start', event);
    }
  }

  _startDeepPress(event){
    if(this.isPressed() && this.isDeepPressed() === false){
      this.setDeepPressed(true);
      this.runClosure('startDeepPress', event);
    }
  }

  _changePress(force, event){
    this.nativeSupport = true;
    this.runClosure('change', force, event);
  }

  _endDeepPress(){
    if(this.isPressed() && this.isDeepPressed()){
      this.setDeepPressed(false);
      this.runClosure('endDeepPress');
    }
  }

  _endPress(){
    if(this.isPressed()){
      this._endDeepPress();
      this.setPressed(false);
      this.runClosure('end');
    }
    this.runKey = Math.random();
    this.nativeSupport = false;
  }

  runPolyfill(event){
    this.increment = 10 / Config.get('polyfillSpeed', this.options);
    this.setPressed(true);
    this.runClosure('start', event);
    this.loopPolyfillForce(0, event);
  }

  loopPolyfillForce(force, event){
    if(this.isPressed() && this.nativeSupport === false) {
      this.runClosure('change', force, event);
      force >= 0.5 ? this._startDeepPress(event) : this._endDeepPress();
      force = force + this.increment > 1 ? 1 : force + this.increment;
      setTimeout(this.loopPolyfillForce.bind(this, force, event), 10);
    }
  }

}

class Timer {
    constructor(callback, delay) {
      this.remaining = delay
      this.callback = callback
      this.timerId = undefined;
      this.start = undefined;
      this.state = undefined;
    }
    clearTimeout() {
      window.clearTimeout(this.timerId);
    }
    pause() {
          this.state = 'PAUSE'
          window.clearTimeout(this.timerId);
          this.timerId = null;
          this.remaining -= Date.now() - this.start;
    };
    
    resume() {

        if (this.timerId) {
            return;
        }
        this.state = 'RUNNING'
        this.start = Date.now();
        this.timerId = window.setTimeout(() => {this.callback(); this.state= 'STOP';} , this.remaining);
        if(this.state == 'STOP') this.clearTimeout();
      
    };
    
  }
  export default Timer
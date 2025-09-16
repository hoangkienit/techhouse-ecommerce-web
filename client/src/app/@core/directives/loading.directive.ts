import { Directive, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[isLoading]'
})
export class LoadingDirective {

  @Input('isLoading') set loading(isLoading: boolean) {
    if (isLoading) {
      this.show();
    } else {
      this.hide();
    }
  }

  private overlay!: HTMLElement;

  constructor(private renderer: Renderer2) { }

  private show() {
    if (this.overlay) return; // tránh append nhiều lần

    // Tạo overlay toàn màn hình
    this.overlay = this.renderer.createElement('div');
    this.renderer.addClass(this.overlay, 'fullscreen-loading-overlay');

    // Tạo 6 chấm
    for (let i = 0; i < 6; i++) {
      const dot = this.renderer.createElement('span');
      this.renderer.addClass(dot, 'dot');
      this.renderer.setStyle(dot, 'animation-delay', `${i * 0.1}s`);
      this.renderer.appendChild(this.overlay, dot);
    }

    // Append vào body
    this.renderer.appendChild(document.body, this.overlay);
  }

  private hide() {
    if (this.overlay) {
      this.renderer.removeChild(document.body, this.overlay);
      this.overlay = undefined!;
    }
  }
}

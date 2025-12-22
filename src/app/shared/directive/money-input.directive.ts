import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[moneyInput]',
  standalone: true,
})
export class MoneyInputDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight'];

    if (allowed.includes(event.key)) return;

    if (!/[\d,]/.test(event.key)) {
      event.preventDefault();
      return;
    }

    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (event.key === '.' && value.includes('.')) {
      event.preventDefault();
      return;
    }

    if (value.includes('.')) {
      const decimals = value.split('.')[1];
      if (decimals.length >= 2) {
        event.preventDefault();
      }
    }
  }
}

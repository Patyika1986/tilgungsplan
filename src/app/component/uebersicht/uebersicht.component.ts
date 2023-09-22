import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-uebersicht',
  templateUrl: './uebersicht.component.html',
  styleUrls: ['./uebersicht.component.scss'],
})
export class UebersichtComponent {
  constructor(private formBuilder: FormBuilder) {}

  public form = this.formBuilder.group({
    darlehnsbetrag: [
      '',
      Validators.compose([Validators.required, Validators.minLength(10)]),
    ],
    sollzins: [
      '',
      Validators.compose([Validators.required, Validators.minLength(1)]),
    ],
    tilgung: [
      '',
      Validators.compose([Validators.required, Validators.minLength(1)]),
    ],
    zinsbindung: [
      '',
      Validators.compose([Validators.required, Validators.minLength(1)]),
    ],
  });

  darlehensbetrag: number = 0;
  sollzins: number = 0;
  tilgung: number = 0;
  zinsbindung: number = 0;

  tilgungsplan: any[] = [];

  formSubmit() {
    this.darlehensbetrag = Number(this.form.value.darlehnsbetrag);
    this.sollzins = Number(this.form.value.sollzins);
    this.tilgung = Number(this.form.value.tilgung);
    this.zinsbindung = Number(this.form.value.zinsbindung);
    if (this.form.status === 'VALID') {
      this.calculateTilgungsplan();
    } else {
      alert('Das Formular ist nicht Valide!');
    }
  }

  calculateTilgungsplan() {
    this.tilgungsplan = []; // Leere den bestehenden Tilgungsplan

    const monthlyInterestRate = this.sollzins / 12 / 100; // Monatlicher Zinssatz
    const monthlyPayment =
      (this.darlehensbetrag * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -this.zinsbindung * 12)); // Monatliche Rate

    let remainingBalance = this.darlehensbetrag;
    let currentDate = new Date();

    for (let month = 0; month < this.zinsbindung * 12; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate; // Zinsen
      const principalPayment = monthlyPayment - interestPayment; // Tilgung

      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Setze das Datum auf den letzten Tag des aktuellen Monats
      currentDate = lastDayOfMonth;

      const entry = {
        date: currentDate.toLocaleDateString(),
        remainingBalance: remainingBalance.toFixed(2),
        interest: interestPayment.toFixed(2),
        repayment: principalPayment.toFixed(2),
        rate: monthlyPayment.toFixed(2),
      };

      this.tilgungsplan.push(entry);

      remainingBalance -= principalPayment;

      // Gehe zum nächsten Monat
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
    }

    // Berechne Restschuld und geleistete Zahlungen am Ende der Zinsbindung
    const finalEntry = {
      date: 'Ende der Zinsbindung',
      remainingBalance: remainingBalance.toFixed(2),
      interest: (remainingBalance * monthlyInterestRate).toFixed(2),
      repayment: (this.darlehensbetrag - remainingBalance).toFixed(2),
      rate: (remainingBalance + remainingBalance * monthlyInterestRate).toFixed(
        2
      ),
    };

    this.tilgungsplan.push(finalEntry);
  }


  finalEntry(entry:any){

  }
}

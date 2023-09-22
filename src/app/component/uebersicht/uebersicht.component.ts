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
      Validators.compose([Validators.required, Validators.minLength(1)]),
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

  public darlehensbetrag: number = 0;
  public sollzins: number = 0;
  public tilgung: number = 0;
  public zinsbindung: number = 0;

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

    const monatlicheZinsSatz = this.sollzins / 12 / 100; // Monatlicher Zinssatz
    const monatlicheZahlung =
      (this.darlehensbetrag * monatlicheZinsSatz) /
      (1 - Math.pow(1 + monatlicheZinsSatz, -this.zinsbindung * 12)); // Monatliche Rate

    let verbleibendeSume = this.darlehensbetrag;
    let aktuellesDatum = new Date();

    for (let month = 0; month < this.zinsbindung * 12; month++) {
      const zinsZahlung = verbleibendeSume * monatlicheZinsSatz; // Zinsen
      const kapitalZahlung = monatlicheZahlung - zinsZahlung; // Tilgung

      const lastDayOfMonth = new Date(
        aktuellesDatum.getFullYear(),
        aktuellesDatum.getMonth() + 1,
        0
      );

      // Setze das Datum auf den letzten Tag des aktuellen Monats
      aktuellesDatum = lastDayOfMonth;

      const entry = {
        date: aktuellesDatum.toLocaleDateString(),
        restSume: verbleibendeSume.toFixed(2),
        interest: zinsZahlung.toFixed(2),
        rueckZahlung: kapitalZahlung.toFixed(2),
        rate: monatlicheZahlung.toFixed(2),
      };

      this.tilgungsplan.push(entry);

      verbleibendeSume -= kapitalZahlung;

      // Gehe zum nächsten Monat
      aktuellesDatum = new Date(
        aktuellesDatum.getFullYear(),
        aktuellesDatum.getMonth() + 1,
        1
      );
    }

    // Berechne Restschuld und geleistete Zahlungen am Ende der Zinsbindung
    const finalEntry = {
      date: 'Ende der Zinsbindung',
      restSume: verbleibendeSume.toFixed(2),
      interest: (verbleibendeSume * monatlicheZinsSatz).toFixed(2),
      rueckZahlung: (this.darlehensbetrag - verbleibendeSume).toFixed(2),
      rate: (verbleibendeSume + verbleibendeSume * monatlicheZinsSatz).toFixed(
        2
      ),
    };

    this.tilgungsplan.push(finalEntry);
  }
}

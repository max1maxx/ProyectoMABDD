import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Patients } from '../models/patients';

import { PatientsService } from '../services/patients.service';
import Swal from 'sweetalert2';

declare var M: any;

@Component({
  selector: 'app-form-paciente',
  templateUrl: './form-paciente.component.html',
  styleUrls: ['./form-paciente.component.scss'],
  providers: [PatientsService],
})
export class FormPacienteComponent implements OnInit {
  tiposServicios: string[];

  checkGender = false;
  checkSeguro = false;

  search = String();

  constructor(public patientsService: PatientsService) {
    this.tiposServicios = [
      'Cirugía Oral',
      'Odontología',
      'Periodoncia',
      'Terapéutica dental',
    ];
    this.validador = false;
  }

  ngOnInit(): void {
    
    this.loadPatients();

    this.checkGender = false;
    this.checkSeguro = false;

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('select');
      var instances = M.FormSelect.init(elems, Option);
    });
  }

  createPatients(form: NgForm) {
    if (form.value._id) {
      this.patientsService.putPatients(form.value).subscribe((res) => {
        form.reset();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.loadPatients();
      });
    } else {
      if(this.validador==true){
      this.patientsService.postPatients(form.value).subscribe((res) => {
        form.reset();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Nuevo registro agregado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.loadPatients();
      });
    }else{
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Cédula incorrecta',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  }

  updatePatients(patients: Patients) {
    this.patientsService.selectedPatients = patients;
    this.patientsService.putPatients(patients);
  }

  deletePatients(_id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este registro se eliminará completamente',
      position: 'top',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deseo eliminarlo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientsService.deletePatients(_id).subscribe((res) => {
          Swal.fire('Eliminado!', 'Registro eliminado', 'success');
          this.loadPatients();
        });
      }
    });
  }

  loadPatients() {
    const filter = (typeof this.search == 'string' && this.search.length > 0) ? `?searchBy=${this.search}` : '';
    this.patientsService.getPatients(filter).subscribe((res) => {
      this.patientsService.patients = res as Patients[];
    });

    //console.log('busca -> ' + this.search);

  }

  resetForm(form: NgForm) {
    form.reset();
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Formulario limpiado',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  validRadioButton(form: NgForm) {
    if (form.value.sexo) {
      this.checkGender = true;
    }
    if (form.value.seguro) {
      this.checkGender = true;
    }
  }

 validador: boolean;

  validadorDeCedula(form: NgForm){
    let cedulaCorrecta = false;
    if (form.value.cedula.length == 10) {
      let tercerDigito = parseInt(form.value.cedula.substring(2, 3));
      if (tercerDigito < 6) {
        // El ultimo digito se lo considera dígito verificador
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(form.value.cedula.substring(9, 10));
        let suma: number = 0;
        let digito: number = 0;
        for (let i = 0; i < form.value.cedula.length - 1; i++) {
          digito = parseInt(form.value.cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += parseInt((digito % 10) + '') + parseInt(digito / 10 + '');
          //      console.log(suma+" suma"+coefValCedula[i]);
        }

        suma = Math.round(suma);

        //  console.log(verificador);
        //  console.log(suma);
        //  console.log(digito);

        if (
          Math.round(suma % 10) == 0 &&
          Math.round(suma % 10) == verificador
        ) {
          cedulaCorrecta = true;
        } else if (10 - Math.round(suma % 10) == verificador) {
          cedulaCorrecta = true;
        } else {
          cedulaCorrecta = false;
        }
      } else {
        cedulaCorrecta = false;
      }
    } else {
      cedulaCorrecta = false;
    }

    this.validador = cedulaCorrecta;
  }

}

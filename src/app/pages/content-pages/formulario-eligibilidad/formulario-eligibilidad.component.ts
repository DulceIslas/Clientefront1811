import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {ApiService} from '../../../shared/services/api.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";

const helper = new JwtHelperService();

@Component({
  selector: 'app-formulario-eligibilidad',
  templateUrl: './formulario-eligibilidad.component.html',
  styleUrls: ['./formulario-eligibilidad.component.scss']
})
export class FormularioEligibilidadComponent implements OnInit {


  showBtnContinuar = false;
  index = 0;
  cuestionario: any [] = [];
  respuestas: any [] = [];
  respuesta: string;
  cuestionarioLocal = [];
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
  public selection: string;
  arrPropuesta: any;
  serviciobeneficiarioid: any;

  constructor(
    private api: ApiService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
  ) {
    if (parseInt(localStorage.getItem('propuestaId')) == 0) {
      this.cuestionarioLocal = [];
    } else {
      this.cuestionarioLocal = JSON.parse(localStorage.getItem("cuestionario"));
    }
    console.log(this.api.currentTokenValue);
    console.log(this.cuestionarioLocal);


      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.getPreguntas();
        this.getPropuesta();
      });

  }

  ngOnInit(): void {
  }

  getPropuesta() {
      this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.arrPropuesta = data
        if (data.propuestaid > 0) {
          this.arrPropuesta['beneficios'].forEach((element, index) => {
            if (element.beneficioid == 1) {
              element.beneficiosbeneficiarios.forEach(bb => {
                if (bb.tipobeneficiarioid == 15) {
                  this.serviciobeneficiarioid = bb.serviciobeneficiarioid
                }
              });
            }
          });
        }
      });
  }

  checkToken() {
    if (helper.isTokenExpired(this.api.currentTokenValue)) {
      this.api.loginapp().pipe(first()).subscribe((data: any) => {});
    }
  }

  getPreguntas() {
    this.spinner.show();
    let arrTemp = [];
    this.api.getCuestionario(1, this.api.currentTokenValue).pipe(first()).subscribe((dataCuestionario:any) => {
      console.log(dataCuestionario);

        dataCuestionario['preguntas'].forEach(item => {
          arrTemp.push(
            {
              clavePregunta: item.clavePregunta,
              descripcionPregunta: item.descripcionPregunta,
              grupoPreguntasId: item.grupoPreguntasId,
              orden: item.orden,
              preguntaId: item.preguntaId,
              selected: false,
              respuesta: '',
              respuestaId: 0,
              continua: false
            }
          )
        });

        this.cuestionario = arrTemp;

        this.cuestionario = this.cuestionario.map(a => {
          const exists = this.cuestionarioLocal.find(b => b.preguntaid == a.preguntaId);

          if (exists) {
            exists.respuestaid ? a.selected = true : a.selected = false;
            a.continuar = true;
            a.respuesta = exists.respuesta;
            a.respuestaId = exists.respuestaid;
          }

          return a;
        });

        this.cuestionario.sort((a,b) => (a.orden > b.orden) ? 1 : ((b.orden > a.orden) ? -1 : 0));
        this.spinner.hide();

        if (localStorage.getItem('sexo') == 'H') {
          this.cuestionario[0].respuesta = 'no';
        }
        console.log(this.cuestionario);
        this.ref.detectChanges();
      },
      (error) => { }
    );
  }

  seleccionarRespuesta(index, value) {
    if (this.cuestionario[index].respuesta == 'si') {

    } else {
      this.cuestionario[index].respuesta = value;
    }
    if (value == 'si') {
      this.cuestionario[index].continua = false
    }
    // value == 'si' ? this.cuestionario[index].continua = false : this.cuestionario[index].continua = true;
  }

  changeStep(stepper, index, value, event){
    console.log(value);
    let arrSend = [];
    let arrSendPropuesta = [];

    if (this.cuestionario[index].respuesta == 'si') {
      let arrBeneficios = JSON.parse(localStorage.getItem('beneficios'));
      arrBeneficios = arrBeneficios.filter(e => e.beneficioId != 3);
      localStorage.setItem('beneficios', JSON.stringify(arrBeneficios));
    }

    if (index == this.cuestionario.length - 1) {
      this.respuestas=[];
      event.target.disabled = true;
      this.spinner.show();
      this.cuestionario.forEach(element => {
        if (parseInt(localStorage.getItem('propuestaId')) == 0) {
          this.respuestas.push(
            {
              "preguntaId": element.preguntaId,
              "respuesta": element.respuesta,
            }
          );
        } else {
          this.respuestas.push(
            {
              "preguntaId": element.preguntaId,
              "respuesta": element.respuesta,
              'respuestaId': element.respuestaId
            }
          );
        }

      });
      if (parseInt(localStorage.getItem('propuestaId')) == 0) {
      arrSend.push({
        "curp": localStorage.getItem('curp'),
        "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
        "beneficios": JSON.parse(localStorage.getItem('beneficios')),
        "respuestas": this.respuestas
      })
    } else {
      arrSend.push({
        "propuestaId": localStorage.getItem('propuestaId'),
        "servicioBeneficiarioId": this.serviciobeneficiarioid,
        "curp": localStorage.getItem('curp'),
        "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
        "beneficios": JSON.parse(localStorage.getItem('beneficios')),
        "respuestas": this.respuestas
      })
    }

        console.log(JSON.stringify(arrSend[0]));

        this.api.loginapp().pipe(first()).subscribe((data: any) => {
          this.api.postCuestionario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
            console.log(data);

            if (data.plan && data.propuesta) {

              // localStorage.setItem('tipoplanId', data.plan['tipoplanId']);
              // localStorage.setItem('precioAnual', data.plan['precioAnual']);
              // localStorage.setItem('precioMensual', data.plan['precioMensual']);
              // localStorage.setItem('descripcionPlan', data.propuesta['descripcionPlan']);
              localStorage.setItem('propuestaId', data.propuesta['propuestaId']);

              arrSendPropuesta.push({
                "propuestaId": data.propuesta['propuestaId'],
                "frecuenciaPagoId": 65,
                "tipoPlanId": localStorage.getItem('tipoplanId'),
                "formaPagoId": 20
              });

              this.api.postAceptarPropuesta(JSON.stringify(arrSendPropuesta[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
                console.log(data);
                if (data.servicioContratadoId) {
                  this.spinner.hide();
                  this.router.navigate(["./pages/propuesta"]);
                }
              });
            }
            },
            (error) => { }
          );
          });

      // this.router.navigate(["/pages/propuesta"]);
    } else {
      stepper.next();
      this.index++;
    }
  }

  changeStepInicial(stepper){
    if (localStorage.getItem('sexo') == 'H') {
      stepper.next();
      stepper.next();
      this.index++;
      this.index++;
      console.log(this.cuestionario);
    } else {
      stepper.next();
      this.index++;
    }
  }

  save(e) {

  }

}

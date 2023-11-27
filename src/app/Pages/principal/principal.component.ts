import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CargaCreditoService } from 'src/app/services/carga-credito.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent  implements OnInit {

  scanActive: boolean = false;
  public misCreditos:any=new Array<any>();
  public miCredito:Credito = new Credito();
  usuario:any;
  isAdmin:boolean=false;
  currentScan: any;
  constructor(public creditosService: CargaCreditoService,private qrScanner: QrscannerService ,private router:Router,private toastr: ToastrService ,public afAuth:AngularFireAuth,public alertController: AlertController)
  {

  }
  async ngOnInit()
  {
    this.afAuth.currentUser.then(user=>{
      if(user){
        this.usuario = user.email;
        if(this.usuario.includes('admin')){
          this.isAdmin=true;
        }
        console.log(this.usuario);
        console.log(this.isAdmin);
      }
    });
    await this.getMiCredito();
  }

  getMiCredito() {
    this.misCreditos = [];
    this.creditosService.getCreditos().then(resp => {
      if (resp.size > 0) {
        resp.forEach((credito: any) => {
          if(credito.data().email == this.usuario){
          this.miCredito = credito.data();
          this.misCreditos.push(credito.data());
          console.log(this.miCredito);
          }
        })
      }
    });
  }

  UpdateCredito(qrEscaneado:string){
    var cantidadNuevo=0;
    //si es admin
    if (this.isAdmin){
      if (!this.miCredito.qrs.includes(qrEscaneado))//no lo cargo
      {
        if (qrEscaneado=="8c95def646b6127282ed50454b73240300dccabc"){
          cantidadNuevo=this.miCredito.cantidad+10;
        }
        if (qrEscaneado=="ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172"){
          cantidadNuevo=this.miCredito.cantidad+50;
        }
        if (qrEscaneado=="2786f4877b9091dcad7f35751bfcf5d5ea712b2f"){
          cantidadNuevo=this.miCredito.cantidad+100;
        }
        var creditosNuevos = this.miCredito.qrs + '/'+qrEscaneado;
        this.creditosService.updateCredito(this.miCredito.id,cantidadNuevo,creditosNuevos,this.usuario);
        this.getMiCredito();
      }
      else//ya lo cargo
      { //si lo cargo 2 veces o mas NO
        if(this.YaLoCargo(qrEscaneado)){
          this.toastr.error("Código repetido.", "Error al cargar código", {timeOut: 1000});

      }
        else//esto anda raro cuando no tiene el qr la primera vez, creo que la solucion es preguntar antes si contais igual que en el else y si es true, si miro ese if que tengo
        {
          if (qrEscaneado=='8c95def646b6127282ed50454b73240300dccabc'){
            cantidadNuevo=this.miCredito.cantidad+10;
          }
          if (qrEscaneado=='ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172'){
            cantidadNuevo=this.miCredito.cantidad+50;
          }
          if (qrEscaneado=='2786f4877b9091dcad7f35751bfcf5d5ea712b2f'){
            cantidadNuevo=this.miCredito.cantidad+100;
          }
          var creditosNuevos = this.miCredito.qrs + '/'+qrEscaneado;
          this.creditosService.updateCredito(this.miCredito.id,cantidadNuevo,creditosNuevos,this.usuario);
          console.log(cantidadNuevo);
          this.getMiCredito();
        }
      }
    }else//no es admin
    {
      if (this.miCredito.qrs.includes(qrEscaneado))//ya lo cargo
      {
        // alert("en if qr escaneado" + qrEscaneado);
        this.toastr.error("Código ya cargado.", "Error al cargar código", {timeOut: 1000});
      }else//no lo cargo aun
      {
        // alert("en else qr escaneado" + qrEscaneado);

        if (qrEscaneado=='8c95def646b6127282ed50454b73240300dccabc'){
          //alert("cantidad " + cantidadNuevo +" " +this.miCredito.cantidad);
          cantidadNuevo=this.miCredito.cantidad+10;
        }
        if (qrEscaneado=='ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172'){
          //alert("cantidad " + cantidadNuevo +" " +this.miCredito.cantidad);
          //cantidadNuevo=this.miCredito.cantidad+50;//no anda el de 50 vaya a saber uno por que
          cantidadNuevo=this.miCredito.cantidad+50;
        }
        if (qrEscaneado=='2786f4877b9091dcad7f35751bfcf5d5ea712b2f'){
          //alert("cantidad " + cantidadNuevo +" " +this.miCredito.cantidad);
          cantidadNuevo=this.miCredito.cantidad+100;
        }
        var creditosNuevos = this.miCredito.qrs + '/'+qrEscaneado;
        // alert("creditosNuevos" + creditosNuevos);
        this.creditosService.updateCredito(this.miCredito.id,cantidadNuevo,creditosNuevos,this.usuario);
        console.log(cantidadNuevo);
        this.getMiCredito();
      }
    }
  }

  Limpiar(){
    this.creditosService.updateCredito(this.miCredito.id,0,"",this.usuario);
    this.getMiCredito();
  }

  YaLoCargo(qrs:string){

  var firstIndex = this.miCredito.qrs.indexOf(qrs);
  // alert("INDICE PRIMERO "+firstIndex);
  // alert("LAST INDEX "+this.miCredito.qrs.lastIndexOf(qrs));
  var result = firstIndex !=  this.miCredito.qrs.lastIndexOf(qrs) && firstIndex != -1;
  // alert("RESULT "+result);
  return result;

  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  startScanner() {
    setTimeout(() => {
      this.scanActive = true;
      this.qrScanner.startScan().then((result) => {
        this.currentScan = result?.trim();
        this.UpdateCredito(this.currentScan);
        console.log(this.currentScan);
        this.scanActive = false;
      });
    }, 2000);
  } // end of startScan

  stopScanner() {
    setTimeout(() => {
      this.scanActive = false;
      this.qrScanner.stopScanner();
    }, 2000);
  } // end of stopScan


  // ionViewWillLeave() {
  //   BarcodeScanner.stopScan();
  //   this.scanActive = false;
  // }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alertCancel',
      header: '¿Estás seguro?',
      message: 'Al confirmar eliminarás tu saldo.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          id: 'confirm-button',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Okay');
            this.Limpiar();
          }
        }
      ]
    });

    await alert.present();
  }

  logOut(){
    this.afAuth.signOut().then(() => this.router.navigate([""]));
  }
}

export class Credito{
  qrs!:string;
  cantidad!:number;
  email!:string;
  id!:string;
}







// user: any = null;
// userAuth: any = this.angularFireAuth.authState;
// pressedButton: boolean = false;
// currentScan: any;
// credit: number = 0;
// qr10: string = '8c95def646b6127282ed50454b73240300dccabc';
// qr50: string = 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172';
// qr100: string = '2786f4877b9091dcad7f35751bfcf5d5ea712b2f';

// scanActive: boolean = false;
//   router: any;

// constructor(
//   private toast:ToastController,
//   private qrScanner: QrscannerService,
//   private angularFireAuth: AngularFireAuth
// ) {}

// ngOnInit(): void {
//   StatusBar.hide()
//   this.pressedButton = true;
//   this.angularFireAuth.currentUser.then((user: any) => {
//     if (user) {
//       this.pressedButton = false;
//       this.user = user;
//       this.credit = this.user.userCredit;
//       this.qrScanner.scanPrepare();
//       this.userAuth = this.angularFireAuth.authState.subscribe((user) => {
//         this.userAuth = user;
//       });
//     }
//   });
// } // end of ngOnInit

// logoutUser() {
//   this.angularFireAuth.signOut().then(() =>
//   this.credit = 0,
//    this.router.navigate([""]));
// } // end of logoutUser

// restartCredit() {
//   this.pressedButton = true;
//   setTimeout(() => {
//     this.user.userCredit = 0;
//     this.credit = this.user.userCredit;
//     this.user.userQrCredit = [];
//     this.updateUser();
//     this.pressedButton = false;
//     this.MostrarToast('El saldo fue eliminado', 'success');
//   }, 2000);
// } // end of restartCredit

// startScan() {
//   this.pressedButton = true;
//   setTimeout(() => {
//     this.pressedButton = false;
//     this.scanActive = true;
//     this.qrScanner.startScan().then((result) => {
//       this.currentScan = result?.trim();
//       this.scanActive = false;
//       this.checkCreditCharge(this.currentScan);
//     });
//   }, 2000);
// } // end of startScan

// stopScan() {
//   this.pressedButton = true;
//   setTimeout(() => {
//     this.pressedButton = false;
//     this.scanActive = false;
//     this.qrScanner.stopScanner();
//   }, 2000);
// } // end of stopScan


// checkCreditCharge(qrCode: string) {
//   if (this.user.includes('admin')) {
//     if (this.checkUserQrCode(qrCode) < 2) {
//       if (qrCode === this.qr10) {
//         this.user.userCredit += 10;
//         this.credit = this.user.userCredit;
//         this.user.userQrCredit.push(qrCode);
//         this.updateUser();
//         this.MostrarToast('Cargaste $10 con éxito', 'success');
//       } else if (qrCode === this.qr50) {
//         this.user.userCredit += 50;
//         this.credit = this.user.userCredit;
//         this.user.userQrCredit.push(qrCode);
//         this.updateUser();
//         this.MostrarToast('Cargaste $50 con éxito', 'success');
//       } else if (qrCode === this.qr100) {
//         this.user.userCredit += 100;
//         this.credit = this.user.userCredit;
//         this.user.userQrCredit.push(qrCode);
//         this.updateUser();
//         this.MostrarToast('Cargaste $100 con éxito', 'success');
//       }
//     } else {
//       this.MostrarToast(
//         'No es posible cargar más de 2 veces el código',
//         'danger'
//       );
//     }
//   } else {
//     if (this.checkUserQrCode(qrCode) < 1) {
//       if (qrCode === this.qr10) {
//         this.user.userCredit += 10;
//         this.credit = this.user.userCredit;
//         this.user.userQrCredit.push(qrCode);
//         this.updateUser();
//         this.MostrarToast('Cargaste $10 con éxito', 'success');
//       } else if (qrCode === this.qr50) {
//         this.user.userCredit += 50;
//         this.credit = this.user.userCredit;
//         this.user.userQrCredit.push(qrCode);
//         this.updateUser();
//         this.MostrarToast('Cargaste $50 con éxito', 'success');
//       } else if (qrCode === this.qr100) {
//         this.user.userCredit += 100;
//         this.credit = this.user.userCredit;
//         this.user.userQrCredit.push(qrCode);
//         this.updateUser();
//         this.MostrarToast('Cargaste $100 con éxito', 'success');
//       }
//     } else {
//       this.MostrarToast(
//         'No es posible cargar más de una vez el código',
//         'danger'
//       );
//     }
//   }
// } // end of checkCreditCharge

// checkUserQrCode(qrCode: string) {
//   return this.user.userQrCredit.filter((qr:any) => qr == qrCode).length;
// } // end of checkUserQrCode

// async MostrarToast(mensaje:string,color:string)
// {
//   const toast = await this.toast.create({
//     message:mensaje,
//     color:color,
//     duration:2000,
//     position:'top'
//   })

//   await toast.present()
// }
// }

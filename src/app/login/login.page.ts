import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './registra-usuario/usuario.service';
import{Router, NavigationExtras} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from './registra-usuario/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  user={
    usuario:'',
    password:''
  };

  usuarioServiceS: Usuario;


  campo: string;

  constructor(public router: Router, public toastController: ToastController,public usuarioService: UsuarioService) { 
  }

  ngOnInit() {
  }

  ingresar(){

    console.log(this.usuarioService.listaUsuarios)

    const navigationExtras: NavigationExtras = {
      state: {
        user: this.user
      }
    };
    if(this.validateModel(this.user)){
      this.usuarioServiceS=this.usuarioService.getUsuario(this.user.usuario);
      if(this.usuarioService.getUsuario(this.user.usuario).password === this.user.password){
        this.router.navigate(['/menu/bienvenida'],navigationExtras);
        localStorage.setItem('ingresado','true');
      }else{
        this.presentToast('Usuario o password no validos');
      }
    }
    else
    {
      this.presentToast('Falta completar: '+this.campo);
    }

  }


  async presentToast(message: string, duration?: number){
    const toast = await this.toastController.create(
      {
        message,
        duration:duration?duration:2000
      }
    );
    toast.present();
  }
/**
 * validateModel sirve para validar que se ingrese algo en los
 * campos del html mediante su modelo
 */
  validateModel(model: any){
  // Recorro todas las entradas que me entrega Object entries y obtengo su clave, valor
  for (const [key, value] of Object.entries(model)) {
    // Si un valor es "" se retornara false y se avisara de lo faltante
    if (value==='') {
      // Se asigna el campo faltante
      this.campo=key;
      // Se retorna false
      return false;
    }
  }
  return true;
}



}

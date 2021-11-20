import { Injectable } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import {Usuario} from './usuario.model'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public listaUsuarios : Usuario [] = [];
  usuario: Usuario;
  db: DataBaseService;
  
  constructor(db : DataBaseService) {
    this.db = db;
    console.log('xxxx-0');
   }

   getDatabaseState()
   {
     return this.db.getDatabaseState();
   }


   getUsuarios(){
    console.log('xxxx-6 ');
    this.db.getDatabaseState().subscribe(rdy => {
      if(rdy){
        this.db.getUsuarios().subscribe(usuario => {
          this.listaUsuarios = usuario;
        });
      }
    });
    return this.listaUsuarios;
  }

  getUsuario(usuarioInput: string)
  {
    console.log(this.listaUsuarios);
    return {
            ...this.getUsuarios().find(usuario => {return usuario.usuario === usuarioInput })
           }
    }

  getDetalle(usuario :string): Promise<Usuario> 
  {
    console.log('xxxx-7 ');
    return this.db.getUsuario(usuario).then(data => {
      this.usuario = data;
      console.log('xxxx-8 ');
      return this.usuario;
    });
  }

  addUsuario(usuario:string, password:string)
  {
    this.db.getDatabaseState().subscribe(rdy => {
      if(rdy){
        this.db.addUsuario(usuario,password);
      }
    });
  }

}

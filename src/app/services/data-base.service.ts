import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Usuario } from '../login/registra-usuario/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private dbReady = new BehaviorSubject<boolean>(false);
  private dataBase: SQLiteObject;
  private http: HttpClient;
  private  sqlPorter: SQLitePorter;
  private sqlite: SQLite;

  listaUsuarios = new BehaviorSubject([]);

  private usuario: Usuario;

  constructor(http: HttpClient,plataforma: Platform,sqlite: SQLite, sqlPorter: SQLitePorter) {  //Detectar Plataforma
    console.log("xxxx-01");
 plataforma.ready()
   .then(() => {
      this.sqlite=sqlite;
      this.http=http;
      this.sqlPorter=sqlPorter;
      // Crear o abrir la base de datos DataBaseProyectoUno.db;
      this.sqlite.create({
        name: 'DataBaseProyectoUno.db',
        location: 'default',
        createFromLocation: 1
      })
      .then((db: SQLiteObject) => {
        console.log("xxxx-2");
        this.dataBase = db;
          this.crearTablas();
        console.log('xxxx-1 ');
        }).catch(e =>{
          alert('Error conexiÃ³n'  );
          console.error(e);
          console.error('Error ConexiÃ³n '+ e.message);
        });
   }).catch(e => alert('Plataforma no leida.'));
  }
  crearTablas() {
    // Obtener el archivo que contiene las sentencias SQL
  this.http.get('../assets/db/CreateDatabase.sql',{responseType: 'text'})
      .subscribe(sql => {
        // Ejecutar las sentencias SQL del archivo
        this.sqlPorter.importSqlToDb(this.dataBase, sql)
          .then(async _ => {
            // Informar que la base de datos estÃ¡ lista
            console.log('xxxx-2 ');
             this.cargarUsuarios();
             console.log('xxxx-3 ');
            this.dbReady.next(true);
            console.log('xxxx-4 ');
          }).catch(e => {
            alert('Error al importar la base de datos');
            console.error(e);
            console.error('Error al importar la base de datos', e.message);
          });
      });
    }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getUsuarios(): Observable<Usuario[]>{
    return this.listaUsuarios.asObservable();
  }

  cargarUsuarios(){
    return this.dataBase.executeSql('SELECT * FROM usuarios', []).then(data => {
      let usuarios: Usuario[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
            usuarios.push(
              data.rows.item(i));
        }
      }
      this.listaUsuarios.next(usuarios);
    });
  }

  getUsuario(usuario): Promise<Usuario> {
    return this.dataBase.executeSql('SELECT * FROM usuarios WHERE usuario = ?', [usuario]).then(resSelect => { 
        return {
              usuario: resSelect.rows.item(0).usuario,
              password: resSelect.rows.item(0).password
        }
      });
  }

  addUsuario(usuario,password) {
    let data = [ usuario, password ];
    return this.dataBase.executeSql('INSERT INTO usuarios (usuario,password) VALUES (?, ?)', data)
    .then(res => {
     this.cargarUsuarios();
    });
  }


}

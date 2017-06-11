import { Component } from '@angular/core';
import { NavController,ModalController,ActionSheetController,AlertController } from 'ionic-angular';
import {MyModal} from './modal';
import {DBService} from '../../service/dbservice';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tasks=[];
  constructor(public navCtrl: NavController,public modalCtrl:ModalController,private dbService:DBService,
      private actionsheet:ActionSheetController,private alert:AlertController) {
    this.tasks = []
    this.showTasks();
  }

  showTasks(){
    this.dbService.getTask().then((data)=>{
      if(data)
      {
        this.tasks = JSON.parse(data);
      }
    })
  }

  showModal(task){
    let modal = this.modalCtrl.create(MyModal,{"task":task});
    modal.onDidDismiss((data)=>{
      this.showTasks();
    })
    modal.present();
  }

  delTask(task){
    let actionsheet = this.actionsheet.create({
      title:"Remove task",
      buttons:[
        {
          text:"Delete",
          role: 'destructive',
          handler: ()=>{
              this.removeTaskFromDB(task);
          }
        }
        ,
        {
          text:"Canel",
          role: 'cancel',
          handler:()=>{
            console.log("cancle clicked");
          }
        }
      ]
    });
    actionsheet.present();
  }

removeTaskFromDB(task){
      let t = task.task;   

      let selectedTaskIndex = this.tasks.findIndex(function(item,i){
          return item.task === t;
      });
      if(selectedTaskIndex >= 0)
      {
          this.tasks.splice(selectedTaskIndex,1);
          this.dbService.setTask(JSON.stringify(this.tasks));
          let deleteConfirmAlert = this.alert.create({
            title:"Success",
            subTitle:"Task Removed",
            buttons:[{
              text:"OK",
              handler:()=>{
                this.showTasks()
              }
            }]
          })
          deleteConfirmAlert.present(); 
    }  
    else{
      console.log("task could not be deleted")
    }
  }

 doneTask(task){
      let t = task.task;   

      let selectedTaskIndex = this.tasks.findIndex(function(item,i){
          return item.task === t;
      });
      if(selectedTaskIndex >= 0)
      {
          if(task.status == 'pending'){
            task.status = 'done';
          }else{
            task.status = 'pending';
          }
          let updatingtask = this.tasks[selectedTaskIndex];
          updatingtask.status = task.status;
          this.dbService.setTask(JSON.stringify(this.tasks));
          let saveSuccessAlert = this.alert.create({
              title:"Success",
              subTitle:"task updated successfully",
              buttons:[{
                  text:"OK"
              }]
          });
          saveSuccessAlert.present();  
    }  
    else{
      console.log("task could not be updated")
    }
 } 
}


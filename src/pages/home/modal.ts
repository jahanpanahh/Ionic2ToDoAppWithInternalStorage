import { Component } from '@angular/core';
import { NavController,ModalController,NavParams,ViewController,AlertController,ActionSheet } from 'ionic-angular';
import {DBService} from '../../service/dbservice';
@Component({
    templateUrl: 'model.html'
})

export class MyModal{
    
    tasks = [];
    taskid: number;
    label:string;
    task:string;
    priority:string;
    selectedTask:any;
    constructor(private nav:NavController, private params:NavParams, private viewCtrl:ViewController,
        private dbService:DBService,private ionicAlert:AlertController){
        let task = this.params.get("task");
        if(task)
        {
            this.label = "Edit";
            this.task = task.task;
            this.priority = task.priority;
            this.selectedTask = task;
        }
        else
        {
            this.label = "Add";
            this.priority = "normal";
            this.selectedTask = {};
        }
        this.taskid = params.get('taskId');
        this.dbService.getTask().then((data)=>
        {
            if(data)
            {
                this.tasks = JSON.parse(data);
            }
        })

    }
    
    
    close(){
        this.viewCtrl.dismiss();
    }

    saveTask(){
        if(this.task === "undefined")
        {
            let taskValidationAlert = this.ionicAlert.create({
                title:"Warning",
                subTitle:"Please enter task",
                buttons:["OK"]
            });
            taskValidationAlert.present();
        }
        else{
            let t = this.selectedTask.task;
            let selectedTaskIndex = this.tasks.findIndex(function(item,i){
                return item.task === t;
            });
            if(selectedTaskIndex === -1)
            {
                let item = {
                    task:this.task,
                    priority:this.priority,
                    status:"pending"
                }
                this.tasks.push(item);
                this.dbService.setTask(JSON.stringify(this.tasks));
                let saveSuccessAlert = this.ionicAlert.create({
                    title:"Success",
                    subTitle:"task added successfully",
                    buttons:[{
                        text:"OK",
                        handler:() => {
                            this.close();
                        }
                    }]
                });
                saveSuccessAlert.present();   
            }        
            else{
                let t = this.selectedTask.task;
                let selectedTaskIndex = this.tasks.findIndex(function(item,i){
                    return item.task === t;
                });
                let updatingtask = this.tasks[selectedTaskIndex];
                updatingtask.task = this.task;
                updatingtask.priority = this.priority;
                this.dbService.setTask(JSON.stringify(this.tasks));
                let saveSuccessAlert = this.ionicAlert.create({
                    title:"Success",
                    subTitle:"task updated successfully",
                    buttons:[{
                        text:"OK",
                        handler:() => {
                            this.close();
                        }
                    }]
                });
                saveSuccessAlert.present();  
            } 
        }
    }
}

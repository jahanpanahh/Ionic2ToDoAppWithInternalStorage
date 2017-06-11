import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';

@Injectable()
export class DBService{
    constructor(public storage:Storage){
    }

    getTask():any
    {
        return this.storage.get('tasks');
    }

    setTask(items)
    {
        this.storage.set('tasks',items);
    }
}

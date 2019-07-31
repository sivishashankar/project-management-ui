export class Task {
    taskId: number;
    taskName: string;
    parentTaskName: string;
    parentId: number;
    priority: number;
    startDateStr: string;
    endDateStr: string;
    deleteFlag: string;
    projectName: string;
    userString: string;
    completed: string;

    constructor() {
        
    }
}
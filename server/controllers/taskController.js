const DAO = require('../includes/db.js');

const QUERY = require('../includes/queries');

exports.getTasks = async function(req, res){
    DAO.connect();
    await DAO.TASK.find(req.query.status ? {status : req.query.status} : {})
        .then(rows => {
            DAO.disconnect();
            res.status(200).send(rows); 
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(404)
        });
}

exports.getTasksQL = async function(status){
    return await QUERY.getTasks(status);
}

exports.deleteTaskQL = async function(id){
    return await QUERY.deleteTask(id);
}

exports.deleteTask = async function(req, res){
    let id = req.url.substring(1, req.url.length);
    DAO.connect();
    await DAO.TASK.deleteOne({_id : id})
        .then(()=>{
            DAO.disconnect();
            res.sendStatus(200);
        })
        .catch(err =>{
            console.log(err);
            res.sendStatus(404);
        });
}

exports.createTaskQL = async function(newTaskInfo){
    // let _fileName = null;
    // if(req.file)
    //     _fileName = req.file.filename;
    return await QUERY.insertTask(newTaskInfo, null);

}

exports.createTask = async function(req, res){
    let _fileName = null;
    if(req.file)
        _fileName = req.file.filename;

    DAO.connect();
    let task = new DAO.TASK({
        status : 'inProgress',
        birthDate : Date.now(),
        deathDate : null,
        name : req.body.task_name,
        fileName : _fileName,
         
    });
    await task.save()
            .then(obj => {
                DAO.disconnect();
                res.sendStatus(201);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500)
            });     
}

exports.downloadFile = function(req, res){
    let url = req.url;
    const regexpLastWord = /\w+.txt$/;
    const file =  './server/attached_files/' + url.match(regexpLastWord)[0];
    res.download(file);
}

exports.updateTaskQL = async function(taskInfo, _fileName){
    let d = new Date(Date.parse(taskInfo.deathDate));
    console.log(d);
    let fileName = _fileName;
    if (taskInfo.fileName || (!taskInfo.fileName && !taskInfo.deleteFlag)) {
        fileName = taskInfo.fileName ? Date.now().toString() + '-' +taskInfo.fileName : taskInfo.prev_file;
    }
    taskInfo.deathDate = d;
    return await QUERY.updateTask(taskInfo, fileName);
}

exports.updateTask = async function(req, res){
    let id = req.url.substring(1, req.url.length);
    let _fileName = null;
    if(req.file || (!req.file && !req.body.deleteFlag)){
        console.log('okay')
        _fileName = req.file ? req.file.filename : req.body.prev_file;
    }

    console.log(req.path);

    let d = new Date(Date.parse(req.body.deathDate));

    console.log( { "name" : req.body.name, "fileName" : _fileName,
    "status" : req.body.status, "deathDate" : d})
    DAO.connect();
    await DAO.TASK.findByIdAndUpdate(id, { "$set" : { "name" : req.body.name, "fileName" : _fileName,
                                                                "status" : req.body.status, "deathDate" : d}},
                                     {new : true})
                                    .then(obj => {
                                        DAO.disconnect();
                                        res.sendStatus(200);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.sendStatus(404)
                                    }); 
}
var dateScalar = require('../includes/gql/dateDef')
const { createWriteStream, existsSync, mkdirSync } = require("fs");
var path = require('path');

const TASK_CONTROLLER = require('../controllers/taskController');
const ACCOUNT_CONTROLLER = require('../controllers/accountController');


const resolvers = {
    Date: dateScalar,
    Query: {
        helloWorld: () => 'hello world',
        getTasks: async (_, { status }) => {
            return await TASK_CONTROLLER.getTasksQL(status);
        },
        downloadFile: () => {
            return { code: 202 }
        },
        logout: (_, {}, { request }) => {
            let cookie = request.res.cookie('auth-token', "", {maxAge: -1000});
        }
    },
    Mutation: {
        createTask: async (_, { name }, { request }, info) => {
            return await TASK_CONTROLLER.createTaskQL({ task_name: name });
        },
        deleteTask: async (_, { id }) => {
            return await TASK_CONTROLLER.deleteTaskQL(id);
        },
        updateTask: async (_, { task }) => {
            return await TASK_CONTROLLER.updateTaskQL(task, task.fileName);
        },
        register: async (_, { user }, { request }) => {
            let token = await ACCOUNT_CONTROLLER.registerQL(user)
            if( token ){
                const options = {
                    maxAge: 2 * 60 * 1000,
                    httpOnly: true
                }
                request.res.cookie('auth-token', token, options);
                //request.res.sendStatus(401);
                return { code: 201 };
            }
            let err = new Error();
            err.code = 401;
            err.message = 'Unauthorized'
            return err
        },
        login: async (_, { user }, { request }) => {
            const token = await ACCOUNT_CONTROLLER.loginQL(user);
            if (token) {
                const options = {
                    maxAge: 2 * 60 * 1000,
                    httpOnly: true
                }
                request.res.cookie('auth-token', token, options);
                return { code: 200 };
            }
            let err = new Error();
            err.code = 401;
            err.message = 'Unauthorized'
            return err
        },
        uploadFile: async (_, { file, fileName }) => {
            const { createReadStream, _filename } = await file;
            console.log(file);
         //   console.log(path.join(__dirname, "./attached_files", filename))
            await new Promise(res =>
              createReadStream()
                .pipe(createWriteStream(path.join(__dirname, "../attached_files", fileName )))
                .on("close", res)
            );
      
            return true;
        }
    }
}

module.exports = resolvers;

const { last } = require('rxjs');
const db = require('../db/connection');
const Role = require('./Role');
const newRole = new Role();

class Employee {
    constructor(first_name, last_name, role_id, manager_id) {
        this.first_name=first_name;
        this.last_name=last_name;
        this.role_id= role_id;
        this.manager_id =manager_id;
    }

    async questionsNewEmp()
    {            
        const roleChoices = await newRole.getRoles();
        const managerChoices = await this.getEmpForManager();
        const employeeQuestions=  [
            {
            type: "input",
            message: "What is the employee's first name? ",
            name: "first_name",
            validate: (empName) => this.checkEmpName(empName)
        },
        {
            type: "input",
            message: "What is the employee's last name? ",
            name: "last_name",
            validate: (empName) => this.checkEmpName(empName)
        },
        {
            type: "list",
            message: "What is the employee's Role? ",
            choices : roleChoices,
            name: "role_id"
        },
        {
            type: "list",
            message: "Who is employee's manager? ",
            choices : managerChoices,
            name: "manager_id"
        }
    ];
        
          return employeeQuestions;
    }

    async questionsUpdateRole()
    {
        const empChoices= await this.getEmpForRole();
        const roleChoices = await newRole.getRoles();
        const employeeQuestions=  [
            {
                type: "list",
                message: "Which employee's role you want to update? ",
                choices : empChoices,
                name: "id"
            },
            {
                type: "list",
                message: "What is the employee's Role? ",
                choices : roleChoices,
                name: "role_id"
            }
        ]
        return employeeQuestions;
    }

    async questionsUpdateManager()
    {
        const empChoices= await this.getEmpForRole();
        const managerChoices = await this.getEmpForManager();
        const employeeQuestions=  [
            {
                type: "list",
                message: "Which employee's role you want to update? ",
                choices : empChoices,
                name: "id"
            },
            {
                type: "list",
                message: "Who is the new manager for the employee? ",
                choices : managerChoices,
                name: "manager_id"
            }
        ]
        return employeeQuestions;
    }

    checkEmpName(empName){
        if (empName==="")
            {return this.getRole() + "'s Name cannot be blank"}
        else
        {return true;}
    }

    addNewEmployee(answers)
    {
        const {first_name, last_name, role_id, manager_id} = answers;
        return new Promise(function(resolve, reject) {
            // The Promise constructor should catch any errors thrown on
            // this tick. Alternately, try/catch and reject(err) on catch.
            //var connection = getMySQL_connection();
            db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?,?,?,?);",[first_name, last_name, role_id, manager_id], function (err, rows, fields) {
                // Call reject on error states,
                // call resolve with results
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    viewAllEmployees()
    {
    return new Promise(function(resolve, reject) {
        var query_str = "SELECT employee.id, first_name, last_name, title,  department.name as department, salary, (select concat(first_name , ' ' , last_name) from employee e where employee.manager_id=e.id) as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id=department.id ORDER BY employee.id;"

        db.query(query_str, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
            return rows;
        });
    });
    }

    updateEmpRole(answers)
    {
    return new Promise(function(resolve, reject) {
        var query_str = "UPDATE employee set role_id=? where id=?;"

        db.query(query_str,[answers.role_id,answers.id] ,function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
            return rows;
        });
    });
    }

    updateEmpManager(answers)
    {
        return new Promise(function(resolve, reject) {
            var query_str = "UPDATE employee set manager_id=? where id=?;"
    
            db.query(query_str,[answers.manager_id,answers.id] ,function (err, rows, fields) {
                // Call reject on error states,
                // call resolve with results
                if (err) {
                    return reject(err);
                }
                resolve(rows);
                return rows;
            });
        });
        }

    async getEmpForManager(){
        const manager=  await this.viewAllEmployees();
        // let choices = Object.keys(departments).map((key) => [Number(key), departments[key]])
        let nullChoice ={value:null, name:"None"};
        let choices =  manager.map(({ id, first_name, last_name  }) => ({value: id, name: first_name+ ' ' + last_name }));
        
        return choices;
    }

    async getEmpForRole(){
        const roles=  await this.viewAllEmployees();
        let choices =  roles.map(({ id, first_name, last_name  }) => ({value: id, name: first_name+ ' ' + last_name }));
        
        return choices;
    }
}

module.exports = Employee;
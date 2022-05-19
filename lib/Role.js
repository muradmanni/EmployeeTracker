const { throwIfEmpty } = require('rxjs');
const db = require('../db/connection');
const Department = require('./Department');


class Role extends Department{
    constructor(title, salary, department_id, name) {
        super (name);
        this.title=title;
        this.salary=salary;
        this.department_id=department_id;
    }
    
    async questions()
    {
        const departmentChoices = await this.getDepartments();

        const roleQuestions=[
            {
                type: "input",
                message: "What is the name of the Role? ",
                name: "title"
            },
            {
                type: "input",
                message: "What is the salary of the role? ",
                name: "salary",
                validate: (salary) => this.checkSalary(salary)
            },
            {
                type: "list",
                message: "What department does the role belong to? ",
                choices : departmentChoices,
                name: "department_id"
            },
                
    ];

        return roleQuestions;
    }

    

    checkSalary(salary){
        if (isNaN(salary))
        {return "Salary cannot contain anything other then Number"}
        else
        {
            if (salary==='')
            {return "Salary cannot be blank"}
            else
            {
                return true;
            }
        }
    }

    addNewRole(answers)
    {
        
        const {title, salary, department_id} = answers;
        return new Promise(function(resolve, reject) {
            // The Promise constructor should catch any errors thrown on
            // this tick. Alternately, try/catch and reject(err) on catch.
            //var connection = getMySQL_connection();
            db.query("INSERT INTO role (title, salary, department_id) values (?,?,?);",[title,salary,department_id], function (err, rows, fields) {
                // Call reject on error states,
                // call resolve with results
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    viewAllRole()
    {
    return new Promise(function(resolve, reject) {
        var query_str = "SELECT role.id, title, name as department, salary FROM role JOIN department ON role.department_id = department.id;";

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

    async getRoles(){
        const roles=  await this.viewAllRole();
        // let choices = Object.keys(departments).map((key) => [Number(key), departments[key]])
        const choices = roles.map(({ id, title }) => ({value: id, name: title }));
        // const choices = departments.map((d) => d.name);
        return choices;
    }
}

module.exports = Role;
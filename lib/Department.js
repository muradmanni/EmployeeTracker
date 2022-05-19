const db = require('../db/connection');


class Department {
    constructor(name) {
        this.name=name;
    }


    questions()
    {
        const departmentQuestions=[
            {
            type: "input",
            message: "What is the name of the Department? ",
            name: "department_name"
        }];

        return departmentQuestions;
    }

    addNewDepartment(name)
    {
        return new Promise(function(resolve, reject) {
            // The Promise constructor should catch any errors thrown on
            // this tick. Alternately, try/catch and reject(err) on catch.
            //var connection = getMySQL_connection();
            db.query("INSERT INTO department (name) values (?);",name, function (err, rows, fields) {
                // Call reject on error states,
                // call resolve with results
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    viewAllDepartment()
    {
    return new Promise(function(resolve, reject) {
        var query_str = "SELECT * FROM department";



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

    async getDepartments(){
        const departments=  await this.viewAllDepartment();
        // let choices = Object.keys(departments).map((key) => [Number(key), departments[key]])
        const choices = departments.map(({ id, name }) => ({value: id, name: name }));
        // const choices = departments.map((d) => d.name);
        console.log("thisis fromd epart choices ", choices);
        return choices;
    }

}

module.exports = Department;
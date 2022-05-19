const { Resolver, resolveSoa } = require("dns");
const Department = require("./lib/Department");
const Role = require("./lib/Role");
const Employee = require("./lib/Employee");
const inquirer = require("inquirer");
const { exit } = require("process");
const options =["View all Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", 
    "Update Employees Manager", "Exit"];

const table = require("table");
let config = {
  
    // Predefined styles of table
    border: table.getBorderCharacters("ramac"),
  }

const  init = async () =>
{
    const newEmployee = new Employee();
    const newDepartment = new Department();
    const newRole = new Role();

    let checkForExit=true;
    do{
        
        await inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do? ",
                choices : options,
                name: "selection",
            }
        ])
        .then(async (selectedOption) => {
            switch (selectedOption.selection)
            {
                case "View all Employees":
                    const allEmployee=  await newEmployee.viewAllEmployees();
                    console.log("\n");
                    console.table(allEmployee);
                    console.log("\n");  
                    break;
                case "Add Employee":
                    const empQuestions = await newEmployee.questionsNewEmp();
            
                    await inquirer.prompt(empQuestions)
                    .then((answers) => {
                        try{
            
                            newEmployee.addNewEmployee(answers);
                        }catch(err)
                        {
                            console.log(err);
                        }

                        console.log(`\nAdded ${answers.first_name} ${answers.last_name} to the Database\n` );
                        }
                    )
                    break;
                case "Update Employee Role":
                    const empUpdateRole = await newEmployee.questionsUpdateRole();
            
                    await inquirer.prompt(empUpdateRole)
                    .then((answers) => {
                        try{
                            newEmployee.updateEmpRole(answers);
                        }catch(err)
                        {
                            console.log(err);
                        }

                        console.log(`\nRole Updated for the employee\n` );
                        }
                    )

                    break;
                case "View All Roles":
                    const allRole=  await newRole.viewAllRole();
                    console.log("\n");
                    console.table(allRole);
                    console.log("\n");  
                    break;
                    break;
                case "Add Role":
                    const q = await newRole.questions();
                    
                    await inquirer.prompt(q)
                    .then((answers) => {
                        try{
                            newRole.addNewRole(answers);
                        }catch(err)
                        {
                            console.log(err);
                        }

                        console.log(`\nAdded ${answers.title} to the Database\n` );
                        }
                    )
                    break;

                case "View All Departments":
                    const allDepartments=  await newDepartment.viewAllDepartment();
                    console.log("\n");
                    console.table(allDepartments);
                    console.log("\n");  
                    break;
                case "Add Department":
                    await inquirer.prompt(newDepartment.questions())
                    .then((answers) => {
                        try{
                            newDepartment.addNewDepartment(answers.department_name);
                        }catch(err)
                        {
                            console.error(err);
                        }

                        console.log("Service Added\n");
                        }
                    );
                    break;
                case "Update Employees Manager":
                    const empUpdateManager = await newEmployee.questionsUpdateManager();
            
                    await inquirer.prompt(empUpdateManager)
                    .then((answers) => {
                        try{
                            newEmployee.updateEmpManager(answers);
                        }catch(err)
                        {
                            console.log(err);
                        }

                        console.log(`\nManager Updated for the employee.\n` );
                        }
                    )
                    break;
                case "Exit":
                    checkForExit=false;
                    break;
            }
            }
        );
    }while(checkForExit)
    process.exit(1);
}

init();

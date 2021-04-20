// Required packages
const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "password",
  database: "employeeTrackerDB",
});
connection.connect((err) => {
  if (err) throw err;
  start();
});

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
          "View All Departments",
          "Add Department",
          "Remove Department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      if (answer.task === "View All Employees") {
        viewEmployee();
      } else if (answer.task === "View All Employees By Department") {
        viewEmpByDept();
      } else if (answer.task === "View All Employees By Manager") {
        viewEmpByManager();
      } else if (answer.task === "Add Employee") {
        addEmployee();
      } else if (answer.task === "Remove Employee") {
        removeEmployee();
      } else if (answer.task === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.task === "Update Employee Manager") {
        updateEmployeeManager();
      } else if (answer.task === "View All Roles") {
        viewAllRoles();
      } else if (answer.task === "Add Role") {
        addRole();
      } else if (answer.task === "Remove Role") {
        removeRole();
      } else if (answer.task === "View All Departments") {
        viewAllDepts();
      } else if (answer.task === "Add Department") {
        addDept();
      } else if (answer.task === "Remove Department") {
        removeDept();
      } else if (answer.task === "Quit") {
        connection.end();
      }
    });

  // View Functions
  const viewAllRoles = () => {
    connection.query("SELECT * FROM role", (err, results) => {
      if (err) throw err;
      console.log(results);
      start();
    });
  };

  const viewEmployee = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
      if (err) throw err;
      console.log(results);
      start();
    });
  };

  const viewAllDepts = () => {
    connection.query("SELECT * FROM department", (err, results) => {
      if (err) throw err;
      console.log(results);
      start();
    });
  };

  const viewEmpByDept = () => {
    connection.query(
      "SELECT department_name FROM department",
      (err, results) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              name: "department",
              type: "rawlist",
              choices() {
                let departmentArray = [];
                results.forEach(({ department_name }) => {
                  departmentArray.push(department_name);
                });
                return departmentArray;
              },
              message: "Choose a department",
            },
          ])
          .then((answer) => {
            let query =
              "SELECT employee.first_Name, employee.last_Name FROM employee INNER JOIN department ON (employee.manager_id = department.id) WHERE (department.department_name = ?)";

            connection.query(query, [answer.department], (err, res) => {
              if (err) throw err;
              res.forEach(({ first_Name, last_Name }) => {
                console.log(`Employee: ${first_Name} ${last_Name} `);
              });
              start();
            });
          });
      }
    );
  };

  // Add Functions
  const addRole = () => {
    connection.query(
      "SELECT department_name FROM department",
      (err, results) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              type: "input",
              name: "newRole",
              message: "What role would you like to add?",
            },
            {
              type: "input",
              name: "salary",
              message: "What is the salary of the new role?",
            },
            {
              name: "department",
              type: "rawlist",
              choices() {
                let departmentArray = [];
                results.forEach(({ department_name }) => {
                  departmentArray.push(department_name);
                });
                return departmentArray;
              },
              message: "What department is the role within?",
            },
          ])
          .then((answer) => {
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: answer.newRole,
                salary: answer.salary,
              },
              "INSERT INTO department SET ? WHERE?",
              { department_id: answer.department },
              (err) => {
                if (err) throw err;
                console.log("Your role was added successfully!");
                start();
              }
            );
          });
      }
    );
  };
  // const viewEmpByManager = () => {
  //   connection.query("SELECT title FROM role", (err, results) => {
  //     if (err) throw err;

  //     inquirer
  //       .prompt([
  //         {
  //           name: "manager",
  //           type: "rawlist",
  //           choices() {
  //             const managerArray = [];
  //             results.forEach(({ department_name }) => {
  //               departmentArray.push(department_name);
  //             });
  //             return departmentArray;
  //           },
  //           message: "Choose a Manager",
  //         },
  //       ])
  //       .then((answer) => {
  //         let query =
  //           "SELECT employee.first_Name, employee.last_Name FROM employee INNER JOIN department ON (employee.manager_id = department.id) WHERE (department.department_name = ?)";

  //         connection.query(query, [answer.manager], (err, res) => {
  //           if (err) throw err;
  //           res.forEach(({ first_Name, last_Name }) => {
  //             console.log(`Employee: ${first_Name} ${last_Name} `);
  //           });
  //           start();
  //         });
  //       });
  //   });
  // };
};

//   const addEmployee = () => {
//     connection.query('SELECT * FROM employee', (err, results) => {
//       if (err) throw err;
//     inquirer
//       .prompt([
//         {
//           type: "input",
//           name: "firstName",
//           message: "What is the employee's first name?",
//         },
//         {
//           type: "input",
//           name: "lastName",
//           message: "What is the employee's last name?",
//         },
//         {
//           type: "input",
//           name: "role",
//           message: "What is the employee's role?",
//         },
//         {
//           type: "rawlist",
//           name: "manager",
//           choices() {
//             const managerArray = [];
//             results.forEach(({manager}) => {
//               managerArray.push(manager);
//             });
//             return managerArray;
//           },
//           message: "Who is the employee's manager?",
//         },
//       ])
//       .then((answer) => {
//         connection.query(
//           "INSERT INTO employee SET ?",
//           {
//             first_name: answer.firstName,
//             last_name: answer.lastName,
//             role_id: answer.role,
//             manager_id: answer.manager,
//           },
//           (err) => {
//             if (err) throw err;
//             console.log("Your employee was added successfully!");
//             start();
//           }
//         );
//       });
//   };

//   const removeEmployee = () => {
//     inquirer.prompt([
//       {
//         type: "input",
//         name: "firstName",
//         message: "What is the employee's first name?",
//       },
//       {
//         type: "input",
//         name: "lastName",
//         message: "What is the employee's last name?",
//       },
//       { type: "input", name: "role", message: "What is the employee's role?" },
//       {
//         type: "input",
//         name: "department",
//         message: "What is the employee's department?",
//       },
//       {
//         type: "input",
//         name: "manager",
//         message: "Who is the employee's manager?",
//       },
//     ]);
//   };

//   const updateEmployeeRole = () => {
//     inquirer.prompt([
//       {
//         type: "input",
//         name: "firstName",
//         message: "What is the employee's first name?",
//       },
//       {
//         type: "input",
//         name: "lastName",
//         message: "What is the employee's last name?",
//       },
//       {
//         type: "input",
//         name: "department",
//         message: "What is the employee's department?",
//       },
//       {
//         type: "input",
//         name: "newRole",
//         message: "What would you like to update the employee's role to?",
//       },
//     ]);
//   };

//   const updateEmployeeManager = () => {
//     inquirer.prompt([
//       {
//         type: "input",
//         name: "firstName",
//         message: "What is the employee's first name?",
//       },
//       {
//         type: "input",
//         name: "lastName",
//         message: "What is the employee's last name?",
//       },
//       {
//         type: "input",
//         name: "department",
//         message: "What is the employee's department?",
//       },
//       {
//         type: "input",
//         name: "newManager",
//         message: "Who would you like to update the employee's manager to?",
//       },
//     ]);
//   };

//   const removeRole = () => {
//     inquirer.prompt([
//       {
//         type: "input",
//         name: "removeRole",
//         message: "What role would you like to delete?",
//       },
//     ]);
//   };

//   const addDept = () => {
//     inquirer
//       .prompt([
//         {
//           type: "input",
//           name: "newDept",
//           message: "What department would you like to add?",
//         },
//       ])
//       .then((answer) => {
//         connection.query(
//           "INSERT INTO department SET ?",
//           {
//             department_name: answer.newDept,
//           },
//           (err) => {
//             if (err) throw err;
//             console.log("Your department was added successfully!");
//             start();
//           }
//         );
//       });
//   };

//   const removeDept = () => {
//     inquirer.prompt([
//       {
//         type: "input",
//         name: "removeDept",
//         message: "What department would you like to delete?",
//       },
//     ]);
//   };
// };

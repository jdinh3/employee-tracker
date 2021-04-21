// Required packages
const inquirer = require("inquirer");
const { left } = require("inquirer/lib/utils/readline");
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

// Function to start
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
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
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
      } else if (answer.task === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.task === "View All Roles") {
        viewAllRoles();
      } else if (answer.task === "Add Role") {
        addRole();
      } else if (answer.task === "View All Departments") {
        viewAllDepts();
      } else if (answer.task === "Add Department") {
        addDept();
      } else if (answer.task === "Quit") {
        connection.end();
      }
    });

  // View Functions
  const viewAllRoles = () => {
    connection.query("SELECT * FROM role", (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    });
  };

  const viewEmployee = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    });
  };

  const viewAllDepts = () => {
    connection.query("SELECT * FROM department", (err, results) => {
      if (err) throw err;
      console.table(results);
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
              "SELECT employee.first_Name, employee.last_Name, department.department_name, role.title, role.salary FROM employee LEFT JOIN role ON (employee.role_id = role.id) LEFT JOIN department ON (role.department_id = department.id) WHERE (department.department_name = ?)";

            connection.query(query, [answer.department], (err, res) => {
              if (err) throw err;
              res.forEach(
                ({ first_Name, last_Name, department_name, title, salary }) => {
                  console.table({
                    first_Name,
                    last_Name,
                    department_name,
                    title,
                    salary,
                  });
                }
              );
              start();
            });
          });
      }
    );
  };

  const viewEmpByManager = () => {
    connection.query(
      "SELECT id, first_name, last_name, manager_id FROM employee",
      (err, results) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              name: "manager",
              type: "rawlist",
              choices() {
                const managerArray = [];
                results.forEach((e) => {
                  managerArray.push({
                    name: e.first_name + " " + e.last_name,
                    value: e.id,
                  });
                });
                return managerArray;
              },
              message: "Choose a Manager",
            },
          ])
          .then((answer) => {
            let manager = answer.manager;
            console.log(manager);
            let query =
              "SELECT first_Name, last_Name FROM employee WHERE manager_id = ?";

            connection.query(query, [answer.manager], (err, res) => {
              if (err) throw err;
              if (res.length != 0) {
                res.forEach(({ first_Name, last_Name }) => {
                  console.log(`Employee: ${first_Name} ${last_Name} `);
                });
              } else {
                console.table("Not a manager of anyone");
              }
              start();
            });
          });
      }
    );
  };

  //  Add Functions
  const addRole = () => {
    connection.query("SELECT * FROM department", (err, results) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "input",
            name: "newRole",
            message: "What is the name of the role?",
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
              results.forEach(({ department_name, id }) => {
                departmentArray.push({ name: department_name, value: id });
              });
              return departmentArray;
            },
            message: "Choose a department",
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.newRole,
              salary: parseInt(answer.salary),
              department_id: answer.department,
            },
            (err) => {
              if (err) throw err;
              console.table("Your role was added successfully!");
              start();
            }
          );
        });
    });
  };

  const addDept = () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "newDept",
          message: "What department would you like to add?",
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            department_name: answer.newDept,
          },
          (err) => {
            if (err) throw err;
            console.log("Your department was added successfully!");
            start();
          }
        );
      });
  };

  const addEmployee = () => {
    connection.query(
      "SELECT * FROM employee LEFT JOIN role ON (employee.role_id = role.id) LEFT JOIN department ON (role.department_id = department.id)",
      (err, results) => {
        if (err) throw err;
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
            },
            {
              name: "role",
              type: "rawlist",
              choices() {
                const roleArray = [];
                results.forEach(({ title, id }) => {
                  roleArray.push({ name: title, value: id });
                });
                return roleArray;
              },
              message: "What is the employee's role?",
            },
            {
              name: "manager",
              type: "rawlist",
              choices() {
                const managerArray = [];
                results.forEach((e) => {
                  managerArray.push({
                    name: e.first_name + " " + e.last_name,
                    value: e.id,
                  });
                });
                return managerArray;
              },
              message: "Who is employee's manager?",
            },
          ])
          .then((answer) => {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role,
                manager_id: answer.manager,
              },
              (err) => {
                if (err) throw err;
                console.log("Your employee was added successfully!");
                start();
              }
            );
          });
      }
    );
  };

  const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
      if (err) throw err;
      connection.query("SELECT * FROM role", (err, results2) => {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "employeeUpdate",
              type: "rawlist",
              choices() {
                const employeeArray = [];
                results.forEach((e) => {
                  employeeArray.push({
                    name: e.first_name + " " + e.last_name,
                    value: e.id,
                  });
                });
                return employeeArray;
              },
              message: "Which employee would you like to update?",
            },
            {
              name: "newRole",
              type: "rawlist",
              choices() {
                const roleArray = [];
                results2.forEach(({ title, id }) => {
                  roleArray.push({ name: title, value: id });
                });
                return roleArray;
              },
              message: "What is the employee's new role?",
            },
          ])
          .then((answer) => {
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id: answer.newRole,
                },
                {
                  id: answer.employeeUpdate,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} updated!`);
                start();
              }
            );
          });
      });
    });
  };
};

// Additional functions that can be added when finished

// const removeEmployee = () => {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "id",
//         message: "What is the employee's id?",
//       },
//     ])
//     .then((answer) => {
//       connection.query("DELETE FROM employee WHERE ?", {
//         employee_id: answer.id,
//       });
//       if (err) throw err;
//       console.table("Employee not found");
//       start();
//     });
// };

//   const removeRole = () => {
//     inquirer.prompt([
//       {
//         type: "input",
//         name: "removeRole",
//         message: "What role would you like to delete?",
//       },
//     ]);
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

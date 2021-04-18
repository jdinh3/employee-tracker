const inquirer = require("inquirer");
const mysql = require("mysql");

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
      } else if (answer.task === "View All Employees By Departments") {
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

  const addEmployee = () => {
    inquirer.prompt([
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
      { type: "input", name: "role", message: "What is the employee's role?" },
      {
        type: "input",
        name: "department",
        message: "What is the employee's department?",
      },
      {
        type: "input",
        name: "manager",
        message: "Who is the employee's manager?",
      },
    ]);
  };

  const removeEmployee = () => {
    inquirer.prompt([
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
      { type: "input", name: "role", message: "What is the employee's role?" },
      {
        type: "input",
        name: "department",
        message: "What is the employee's department?",
      },
      {
        type: "input",
        name: "manager",
        message: "Who is the employee's manager?",
      },
    ]);
  };

  const updateEmployeeRole = () => {
    inquirer.prompt([
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
        type: "input",
        name: "department",
        message: "What is the employee's department?",
      },
      {
        type: "input",
        name: "newRole",
        message: "What would you like to update the employee's role to?",
      },
    ]);
  };

  const updateEmployeeManager = () => {
    inquirer.prompt([
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
        type: "input",
        name: "department",
        message: "What is the employee's department?",
      },
      {
        type: "input",
        name: "newManager",
        message:
          "Which manager would you like to update the employee's manager to?",
      },
    ]);
  };

  const addRole = () => {
    inquirer.prompt([
      {
        type: "input",
        name: "newRole",
        message: "What role would you like to add?",
      },
    ]);
  };

  const removeRole = () => {
    inquirer.prompt([
      {
        type: "input",
        name: "removeRole",
        message: "What role would you like to delete?",
      },
    ]);
  };

  const addDept = () => {
    inquirer.prompt([
      {
        type: "input",
        name: "newDept",
        message: "What department would you like to add?",
      },
    ]);
  };

  const removeDept = () => {
    inquirer.prompt([
      {
        type: "input",
        name: "removeDept",
        message: "What department would you like to delete?",
      },
    ]);
  };
};

start();

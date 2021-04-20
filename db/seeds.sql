USE employeeTrackerDB;

INSERT INTO department (id, department_name)
VALUES (1, "IT"),
(2, "Sales"),
(3, "HR");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "IT Manager", 100000.00, 1),
(2, "IT Coordinator", 80000.00, 1),
(3, "Director of Sales", 100000.00, 2),
(4, "Sales Coordinator", 80000.00, 2),
(5, "HR Manager", 100000.00, 3),
(6, "HR Coordinator", 80000.00, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Adam", "Man", 2, 1),
(4, "Guy", "Fieri", 4, 2),
(6, "Justin", "Timerberlake", 6, 3);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (1, "Jerry", "Guy", 1),
(3, "Eve", "Lady", 3),
(5, "Ben", "Boy", 5);

SELECT * FROM employee;

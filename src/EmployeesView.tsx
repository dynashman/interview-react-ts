import { useEffect, useMemo, useState } from "react";
import type { Employee } from "./types/employee";
import "./EmployeesView.css";

interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

function EmployeesView() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeId, setNewEmployeeId] = useState<number | "">("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeSalary, setNewEmployeeSalary] = useState<number | "">("");

  const [showEmployeeCount, setShowEmployeeCount] = useState(false);
  const [showTotalSalary, setShowTotalSalary] = useState(false);
  const [showMaxSalary, setShowMaxSalary] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const responseUsers: ApiUser[] = await response.json();
        setUsers(responseUsers);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load employees"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const totalSalary = useMemo(
    () => employees.reduce((sum, employee) => sum + employee.salary, 0),
    [employees]
  );

  const maxSalaryEmployee = useMemo(
    () =>
      employees.reduce<Employee | null>(
        (max, employee) =>
          !max || employee.salary > max.salary ? employee : max,
        null
      ),
    [employees]
  );

  function addEmployee(event: React.FormEvent) {
    event.preventDefault();

    if (
      newEmployeeId === "" ||
      !newEmployeeName.trim() ||
      newEmployeeSalary === ""
    ) {
      return;
    }

    setEmployees((prev) => [
      ...prev,
      {
        employeeId: newEmployeeId,
        employeeName: newEmployeeName.trim(),
        salary: newEmployeeSalary,
      },
    ]);

    setNewEmployeeId("");
    setNewEmployeeName("");
    setNewEmployeeSalary("");
  }

  return (
    <>
      <div className="employees-view">
        <h1>User</h1>

        {isLoading && <p>Loading...</p>}
        {!isLoading && errorMessage && <p className="error">{errorMessage}</p>}
        {!isLoading && !errorMessage && (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.website}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="employees-view">
        <h1>Employees</h1>

        <form className="employee-form" onSubmit={addEmployee}>
          <input
            value={newEmployeeId}
            onChange={(e) =>
              setNewEmployeeId(e.target.value === "" ? "" : Number(e.target.value))
            }
            type="number"
            placeholder="Employee Id"
            required
          />
          <input
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            type="text"
            placeholder="Employee Name"
            required
          />
          <input
            value={newEmployeeSalary}
            onChange={(e) =>
              setNewEmployeeSalary(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            type="number"
            placeholder="Salary"
            required
          />
          <button type="submit">Add</button>
        </form>

        {employees.length === 0 ? (
          <p>No employees added yet.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.employeeName}</td>
                  <td>{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          type="button"
          className="action-button"
          onClick={() => setShowEmployeeCount((v) => !v)}
        >
          แสดงคนทั้งหมด
        </button>
        {showEmployeeCount && <p>มีทั้งหมด {employees.length} Row</p>}

        <button
          type="button"
          className="action-button"
          onClick={() => setShowTotalSalary((v) => !v)}
        >
          Total Salary
        </button>
        {showTotalSalary && <p>รวมเงินเดือนทั้งหมด {totalSalary}</p>}

        <button
          type="button"
          className="action-button"
          onClick={() => setShowMaxSalary((v) => !v)}
        >
          Max Salary
        </button>
        {showMaxSalary && maxSalaryEmployee && (
          <p>
            เงินเดือนสูงสุดคือ {maxSalaryEmployee.employeeName} (
            {maxSalaryEmployee.salary})
          </p>
        )}
        {showMaxSalary && !maxSalaryEmployee && <p>No employees added yet.</p>}
      </div>
    </>
  );
}

export default EmployeesView;

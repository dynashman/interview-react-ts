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
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [showEmployeeCount, setShowEmployeeCount] = useState(false);
  const [showTotalSalary, setShowTotalSalary] = useState(false);
  const [showMaxSalary, setShowMaxSalary] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const responseUsers: ApiUser[] = await response.json();
      } catch (error) {
      } finally {
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      <div className="employees-view">
        <h1>User</h1>

        <table className="user-table"></table>
      </div>

      <div className="employees-view">
        <h1>Employees</h1>

        <table className="user-table"></table>

        <button
          type="button"
          className="action-button"
          onClick={() => setShowEmployeeCount((v) => !v)}>
          แสดงคนทั้งหมด
        </button>
        {showEmployeeCount && <p>มีทั้งหมด {employees.length} Row</p>}

        <button
          type="button"
          className="action-button"
          onClick={() => setShowTotalSalary((v) => !v)}>
          Total Salary
        </button>
        {showTotalSalary && <p>รวมเงินเดือนทั้งหมด</p>}

        <button
          type="button"
          className="action-button"
          onClick={() => setShowMaxSalary((v) => !v)}>
          Max Salary
        </button>
      </div>
    </>
  );
}

export default EmployeesView;

"use client";

import { Employee } from "@/tools/employee.model";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { sendJSONData } from "@/tools/Toolkit";
import Link from "next/link";

interface FormState {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const defaultForm: FormState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
};

export default function ManageUsers(employees: { employees: Employee[] }) {
    const [form, setForm] = useState<FormState>(defaultForm);
    const [employeeList, setEmployeeList] = useState<Employee[]>(employees.employees ?? []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
        setSuccessMessage(null);
    }

    function handleCancel() {
        setForm(defaultForm);
        setError(null);
        setSuccessMessage(null);
    }

    async function handleSubmit() {
        setError(null);
        setSuccessMessage(null);

        const { firstName, lastName, username, password, confirmPassword } = form;

        if (!firstName || !lastName || !username || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await sendJSONData("/api/employee/create", {
                firstName,
                lastName,
                employeeId: username,
                password,
                admin: false,
            });

            if (!result || result.status !== 200) {
                setError(result?.data?.error ?? "Failed to create employee.");
            } else {
                setSuccessMessage(`Employee "${firstName} ${lastName}" created successfully.`);
                setEmployeeList((prev) => [...prev, { firstName, lastName, employeeId: username, admin: false, password: "" } as any]);
                setForm(defaultForm);
            }
        } catch (err: any) {
            setError(err.message ?? "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await sendJSONData("/api/employee/delete", { _id: id }, "DELETE");

            if (!result || result.status !== 200) {
                setError(result?.data?.error ?? "Failed to delete employee.");
            } else {
                setSuccessMessage("Employee successfully deleted.");
                setEmployeeList((prev) => prev.filter((e) => e._id?.toString() !== id));
            }
        } catch (err: any) {
            setError(err.message ?? "An unexpected error occurred.");
        } finally {
            setConfirmDeleteId(null);
        }
    }

    return (
        <div className="min-h-screen bg-yutaniGrey p-7">
            <div className="bg-black rounded-2xl p-6 min-h-[calc(100vh-130px)]">
                <div className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-8">
                    Manage Employees
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center mb-4">{error}</div>
                )}

                <div className="flex justify-around">
                    {/* ── Create Employee ── */}
                    <div className="max-w-1/2">
                        <div className="text-yutaniGrey text-xl font-light tracking-wider text-center mb-8">
                            Create an employee
                        </div>
                        <div className="flex flex-col items-center">
                            {(["firstName", "lastName", "username", "password", "confirmPassword"] as const).map((field) => (
                                <div key={field} className="flex flex-col">
                                    <label className="flex justify-center text-yutaniGrey text-sm mb-2 font-light">
                                        {field === "confirmPassword" ? "Confirm Password"
                                            : field === "firstName" ? "First Name"
                                                : field === "lastName" ? "Last Name"
                                                    : field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type={field.toLowerCase().includes("password") ? "password" : "text"}
                                        name={field}
                                        value={form[field]}
                                        onChange={handleChange}
                                        className="w-full px-2 py-2 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition border-yutaniGrey focus:border-yutaniYellow mb-2"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4 justify-center mb-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="px-12 py-3 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Submitting…" : "Submit"}
                            </button>
                        </div>
                    </div>

                    {/* ── Delete Employee ── */}
                    <div>
                        <div className="text-yutaniGrey text-xl font-light tracking-wider text-center mb-8">
                            Delete an employee
                        </div>
                        <div className="flex flex-col gap-2">
                            {employeeList.filter((employee: Employee) => !employee.admin).map((employee: Employee) => (
                                <div key={employee._id?.toString() ?? employee.employeeId} className="flex items-center justify-between gap-4 text-yutaniGrey">
                                    {confirmDeleteId === employee._id?.toString() ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Are you sure?</span>
                                            <button
                                                onClick={() => handleDelete(employee._id!.toString())}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="px-3 py-1 bg-gray-400 text-black text-sm rounded hover:bg-gray-500"
                                            >
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span>{employee.firstName} {employee.lastName}</span>
                                            <button
                                                onClick={() => setConfirmDeleteId(employee._id!.toString())}
                                                className="text-red-400 hover:text-red-600 transition"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mb-4 text-center">
                    <Link href="/dashboard" className="px-12 py-3 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition disabled:opacity-50">
                        ← Back
                    </Link>
                </div>
            </div>
        </div>
    );
}
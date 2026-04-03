'use client';

import { sendJSONData } from '@/tools/Toolkit';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CategoryBase } from '@/tools/categoryBase.model';
import { Employee } from '@/tools/employee.model';

interface FormData {
    date: string;
    category: string;
    amount: string;
    description: string;
    receipt: File | null;
    facehugger: boolean;
    startLocation: string;
    endLocation: string;
    mileage: string;
}

interface FormErrors {
    date?: string;
    category?: string;
    amount?: string;
    description?: string;
    receipt?: string;
    startLocation?: string;
    endLocation?: string;
    mileage?: string;
    employee?: string;
}

export default function EmployeeClaimSystem({ categories, employees }: { categories: { categories: CategoryBase[] }, employees: Employee[] }) {
    const router = useRouter();
    const { data: session } = useSession();

    const [formData, setFormData] = useState<FormData>({
        date: '',
        category: '',
        amount: '',
        description: '',
        receipt: null,
        facehugger: false,
        startLocation: '',
        endLocation: '',
        mileage: '',
    });

    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};

        // Admin must select an employee
        if (session?.user.admin && !selectedEmployee) {
            newErrors.employee = 'Please select an employee to submit on behalf of.';
        }

        if (!data.date) {
            newErrors.date = 'Date is required.';
        } else {
            const selected = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected > today) {
                newErrors.date = 'Date cannot be in the future.';
            }
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (selected < oneYearAgo) {
                newErrors.date = 'Date cannot be more than one year ago.';
            }
        }

        if (!data.category) {
            newErrors.category = 'Please select a category.';
        }

        if (data.category === 'Travel') {
            if (!data.startLocation.trim()) {
                newErrors.startLocation = 'Starting location is required for travel claims.';
            }
            if (!data.endLocation.trim()) {
                newErrors.endLocation = 'Final location is required for travel claims.';
            }
            if (!data.mileage.trim()) {
                newErrors.mileage = 'Mileage is required for travel claims.';
            } else if (!/^\d+(\.\d+)?\s*(L\/100|Mpg|mpg|l\/100)/i.test(data.mileage.trim())) {
                newErrors.mileage = 'Please include units — e.g. "8.5 L/100" or "30 Mpg".';
            }
        }

        if (!data.amount) {
            newErrors.amount = 'Amount is required.';
        } else {
            const amt = parseFloat(data.amount);
            if (isNaN(amt) || amt <= 0) {
                newErrors.amount = 'Amount must be a positive number.';
            } else if (amt > 50000) {
                newErrors.amount = 'Amount exceeds the maximum claimable limit of $50,000.';
            } else if (!/^\d+(\.\d{0,2})?$/.test(data.amount)) {
                newErrors.amount = 'Amount can have at most 2 decimal places.';
            }
        }

        if (!data.description.trim()) {
            newErrors.description = 'Description is required.';
        } else if (data.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters.';
        } else if (data.description.trim().length > 500) {
            newErrors.description = `Description is too long (${data.description.trim().length}/500 characters).`;
        }

        if (!data.receipt) {
            newErrors.receipt = 'A receipt is required.';
        }

        return newErrors;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setErrors((prev) => ({ ...prev, receipt: 'File size must be under 10MB.' }));
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setErrors((prev) => ({ ...prev, receipt: 'Only image files (JPG, PNG, GIF, WEBP) and PDFs are allowed.' }));
                return;
            }

            setFormData((prev) => ({ ...prev, receipt: file }));
            setErrors((prev) => ({ ...prev, receipt: undefined }));

            const reader = new FileReader();
            reader.onloadend = () => setReceiptPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setFormData({
            date: '',
            category: '',
            amount: '',
            description: '',
            receipt: null,
            facehugger: false,
            startLocation: '',
            endLocation: '',
            mileage: '',
        });
        setSelectedEmployee('');
        setErrors({});
        setReceiptPreview(null);
        router.push('/dashboard');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstErrorField = Object.keys(validationErrors)[0];
            document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);

        try {
            let receiptUrl = null;
            if (formData.receipt) {
                const uniqueFileName = `${Date.now()}-${formData.receipt.name}`;
                const renamedFile = new File([formData.receipt], uniqueFileName, { type: formData.receipt.type });

                const fileData = new FormData();
                fileData.append('file', renamedFile);

                const receiptResponse = await fetch('/api/claim/receipt', {
                    method: 'POST',
                    body: fileData,
                });

                if (!receiptResponse.ok) {
                    console.error('Receipt upload failed:', receiptResponse.status, receiptResponse.statusText);
                    setErrors({ receipt: 'Receipt upload failed. Please try again.' });
                    return;
                }

                const receiptResult = await receiptResponse.json();
                receiptUrl = receiptResult.url;
            }

            const jsonData = {
                date: formData.date,
                category: formData.category,
                amount: formData.amount,
                description: formData.description,
                receiptUrl,
                ...(session?.user.admin && { onBehalfOf: selectedEmployee }),
                ...(formData.category === "Medical" && {
                    facehugger: formData.facehugger,
                }),
                ...(formData.category === "Travel" && {
                    startLocation: formData.startLocation,
                    endLocation: formData.endLocation,
                    mileage: formData.mileage,
                }),
            };
            await sendJSONData('/api/claim/create', jsonData);

            router.push('/dashboard');
        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ description: 'Submission failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const ErrorMessage = ({ message }: { message?: string }) =>
        message ? <p className="text-red-400 text-xs mt-1">{message}</p> : null;

    const inputClass = (field: keyof FormErrors) =>
        `w-full px-4 py-3 bg-yutaniGrey border-2 rounded text-black placeholder-yutaniGrey focus:outline-none transition ${errors[field] ? 'border-red-400 focus:border-red-400' : 'border-yutaniGrey focus:border-yutaniYellow'
        }`;

    return (
        <div className="min-h-screen bg-yutaniGrey p-7">
            <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                <h2 className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-8">
                    Claim Information
                </h2>

                <form onSubmit={handleSubmit} noValidate className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">

                        {/* Admin: Employee selector */}
                        {session?.user.admin && (
                            <div>
                                <label className="block text-yutaniGrey text-sm mb-2 font-light">Submit on behalf of:</label>
                                <select
                                    name="employee"
                                    value={selectedEmployee}
                                    onChange={(e) => {
                                        setSelectedEmployee(e.target.value);
                                        if (errors.employee) setErrors((prev) => ({ ...prev, employee: undefined }));
                                    }}
                                    className={inputClass('employee')}
                                >
                                    <option value="">Select an employee</option>
                                    {employees.filter((employee: Employee) => !employee.admin).map((employee) => (
                                        <option key={employee._id} value={employee._id}>
                                            {employee.firstName} {employee.lastName}
                                        </option>
                                    ))}
                                </select>
                                <ErrorMessage message={errors.employee} />
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className={inputClass('date')}
                            />
                            <ErrorMessage message={errors.date} />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Category:</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={inputClass('category')}
                            >
                                <option value="">Select a category</option>
                                {categories.categories.map((category) => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <ErrorMessage message={errors.category} />
                        </div>

                        {/* Medical: facehugger checkbox */}
                        {formData.category === 'Medical' && (
                            <div className="text-white">
                                <input
                                    type="checkbox"
                                    id="medCheckbox"
                                    checked={formData.facehugger}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, facehugger: e.target.checked }))}
                                />
                                <label className="pl-2">Facehugger exposure?</label>
                            </div>
                        )}

                        {/* Travel: location + mileage fields */}
                        {formData.category === 'Travel' && (
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col">
                                    <label className="block text-yutaniGrey text-sm mb-2 font-light">Starting Location</label>
                                    <input
                                        type="text"
                                        name="startLocation"
                                        className={inputClass('startLocation')}
                                        value={formData.startLocation}
                                        onChange={handleInputChange}
                                    />
                                    <ErrorMessage message={errors.startLocation} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-yutaniGrey text-sm mb-2 font-light">Final Location</label>
                                    <input
                                        type="text"
                                        name="endLocation"
                                        className={inputClass('endLocation')}
                                        value={formData.endLocation}
                                        onChange={handleInputChange}
                                    />
                                    <ErrorMessage message={errors.endLocation} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-yutaniGrey text-sm mb-2 font-light">Distance</label>
                                    <input
                                        type="text"
                                        name="mileage"
                                        placeholder="e.g. 8.5 L/100 or 30 Mpg"
                                        className={inputClass('mileage')}
                                        value={formData.mileage}
                                        onChange={handleInputChange}
                                    />
                                    <ErrorMessage message={errors.mileage} />
                                </div>
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Amount:</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                className={inputClass('amount')}
                            />
                            <ErrorMessage message={errors.amount} />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">
                                Description:
                                <span className="ml-2 text-yutaniGrey opacity-60 text-xs">
                                    ({formData.description.length}/500)
                                </span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                maxLength={500}
                                className={`${inputClass('description')} resize-none`}
                            />
                            <ErrorMessage message={errors.description} />
                        </div>
                    </div>

                    {/* Right Column — Receipt Upload */}
                    <div className="flex flex-col">
                        <label className="block text-yutaniGrey text-sm mb-2 font-light">
                            Add a receipt: <span className="text-red-400">*</span>
                        </label>
                        <div
                            className={`flex-1 border-2 rounded p-6 flex flex-col items-center justify-center cursor-pointer transition ${errors.receipt
                                ? 'bg-yutaniGrey border-red-400'
                                : 'bg-yutaniGrey border-yutaniGrey hover:border-yutaniYellow'
                                }`}
                            onClick={() => document.getElementById('receipt-input')?.click()}
                        >
                            {receiptPreview ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img
                                        src={receiptPreview}
                                        alt="Receipt preview"
                                        className="max-w-full max-h-full object-contain rounded"
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-yutaniGrey text-sm font-light">
                                        Click to upload receipt image
                                    </div>
                                    <div className="text-yutaniGrey opacity-50 text-xs mt-1">
                                        JPG, PNG, WEBP, PDF · max 10MB
                                    </div>
                                </div>
                            )}
                        </div>
                        <ErrorMessage message={errors.receipt} />
                        <input
                            id="receipt-input"
                            type="file"
                            name="receipt"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            className="hidden"
                        />
                    </div>
                </form>

                {/* Buttons */}
                <div className="flex gap-4 mt-8 justify-center">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-12 py-3 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-12 py-3 bg-yellow-400 border-2 border-yellow-300 text-black font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting…' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
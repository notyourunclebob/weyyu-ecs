'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmployeeClaimSystem() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        date: '',
        category: '',
        amount: '',
        description: '',
        receipt: null as File | null,
    });

    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                receipt: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result as string);
            };
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
        });
        setReceiptPreview(null);
        router.push(`/dashboard`)
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        router.push(`/dashboard`)
    };

    return (
        <div className="min-h-screen bg-yutaniGrey p-7">
            <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                {/* Claim Information Title */}
                <h2 className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-8">
                    Claim Information
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Date Field */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                            />
                        </div>

                        {/* Category Field */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Category:</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black focus:outline-none focus:border-yutaniYellow"
                            >
                                <option value="">Select a category</option>
                                <option value="travel">Meals</option>
                                <option value="meals">Travel</option>
                                <option value="accommodation">Accommodation</option>
                                <option value="supplies">Medical</option>
                            </select>
                        </div>

                        {/* Amount Field */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Amount:</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 bg-yutaniGrey border-2 border-yutaniGrey rounded text-black placeholder-yutaniGrey focus:outline-none focus:border-yutaniYellow resize-none"
                            />
                        </div>
                    </div>

                    {/* Right Column - Receipt Upload */}
                    <div className="flex flex-col">
                        <label className="block text-yutaniGrey text-sm mb-2 font-light">Add a receipt:</label>
                        <div
                            className="flex-1 bg-yutaniGrey border-2 border-yutaniGrey rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-yutaniGrey transition"
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
                                    <div className="text-yutaniGrey text-sm font-light">Click to upload receipt image</div>
                                </div>
                            )}
                        </div>
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
                        className="px-12 py-3 bg-yutaniGrey border-2 border-yutaniGrey text-black font-light rounded hover:bg-yutaniGrey transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-12 py-3 bg-yutaniYellow border-2 border-yellow-500 text-black font-bold rounded hover:bg-yellow-350 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
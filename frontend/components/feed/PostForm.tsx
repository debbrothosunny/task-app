"use client";

import React, { useState, useRef, useEffect } from 'react';

interface PostFormProps {
    onPostSubmit: (formData: FormData) => Promise<void>; 
    loading: boolean;
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function PostForm({ onPostSubmit, loading, showToast }: PostFormProps) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 1. Auto-expanding textarea logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!content.trim() && !image) return;

        const formData = new FormData();
        formData.append('content', content);
        formData.append('visibility', visibility);
        if (image) formData.append('image', image);

        try {
            await onPostSubmit(formData);
            setContent('');
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = ""; 
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    // 2. Keyboard shortcut (Ctrl/Cmd + Enter)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showToast("File is too large! Maximum size is 5MB.", "error");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            if (!file.type.startsWith('image/')) {
                showToast("Please select a valid image file.", "error");
                return;
            }
            setImage(file);
        }
    };

    return (
        <div className="group bg-white/80 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[1.8rem] bg-white p-4 sm:p-6">
                
                {/* Content Input Area */}
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What's on your mind?"
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg leading-relaxed placeholder:text-gray-400 resize-none min-h-[100px] transition-all"
                    />
                </div>

                {/* Modern Image Preview */}
                {image && (
                    <div className="relative mt-4 group/img animate-in fade-in zoom-in duration-300">
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-50 border border-gray-100 shadow-inner">
                            <img 
                                src={URL.createObjectURL(image)} 
                                alt="Preview" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImage(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white h-8 w-8 flex items-center justify-center rounded-full shadow-xl transition-all active:scale-90 backdrop-blur-md"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Media Upload Button */}
                        <label className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 text-blue-600 cursor-pointer transition-all active:scale-95 group/btn border border-transparent hover:border-blue-100">
                            <svg className="w-5 h-5 transition-transform group-hover/btn:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-semibold">Media</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>

                        {/* 3. Smart visibility dropdown with icon */}
                        <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-100 px-3 hover:border-gray-200 transition-all group/select">
                            <span className="text-gray-500 mr-1 transition-colors group-hover/select:text-gray-700">
                                {visibility === 'public' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                )}
                            </span>
                            <select 
                                value={visibility} 
                                onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                                className="appearance-none bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-600 uppercase py-2 pl-1 pr-6 cursor-pointer outline-none"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading || (!content.trim() && !image)}
                        className="w-full sm:w-auto min-w-[150px] group relative px-8 py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-blue-600 text-white transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-400 shadow-lg hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Post Content</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
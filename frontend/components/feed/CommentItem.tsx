"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from '@/lib/axios'; 

interface CommentItemProps {
    comment: any;
    postId: number;
    onCommentLike: (commentId: number, postId: number) => void;
    onCommentSubmit: (postId: number, parent_id: number | null, content: string) => Promise<any>;
    isNestedReply?: boolean;
}

export default function CommentItem({
    comment,
    postId,
    onCommentLike,
    onCommentSubmit,
    isNestedReply = false
}: CommentItemProps) {
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState<any[]>([]);
    const [showReplies, setShowReplies] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ LOCAL STATE for this comment's like status
    const [localLiked, setLocalLiked] = useState<boolean>(comment.is_liked);
    const [localLikesCount, setLocalLikesCount] = useState<number>(comment.likes_count);

    // ✅ SYNC LOCAL STATE WITH PROPS when comment data changes
    useEffect(() => {
        setLocalLiked(comment.is_liked);
        setLocalLikesCount(comment.likes_count);
    }, [comment.is_liked, comment.likes_count]);

    // ✅ UNIFIED MEMOIZED: Handle like for BOTH direct comments and nested replies
    const handleLike = useCallback(async (id: number) => {
        try {
            // 1. Update LOCAL state immediately (optimistic update)
            setLocalLiked(prev => !prev);
            setLocalLikesCount(prev => localLiked ? prev - 1 : prev + 1);

            // 2. Different behavior based on nesting level
            if (isNestedReply) {
                // For nested replies: Make API call directly (no parent callback)
                await axios.post(`/api/like/${id}/comment`);
            } else {
                // For direct comments: Call parent callback
                await onCommentLike(id, postId);
            }
        } catch (error) {
            // Revert on error
            setLocalLiked(comment.is_liked);
            setLocalLikesCount(comment.likes_count);
            console.error("Like failed:", error);
        }
    }, [comment.is_liked, comment.likes_count, localLiked, postId, onCommentLike, isNestedReply]);

    // ✅ MEMOIZED: Fetch replies callback
    const fetchReplies = useCallback(async () => {
        if (replies.length > 0) {
            setShowReplies(prev => !prev);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`/api/comments/${comment.id}/replies`);
            setReplies(response.data);
            setShowReplies(true);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setIsLoading(false);
        }
    }, [replies.length, comment.id]);

    // ✅ MEMOIZED: Handle reply submit
    const handleReplySubmit = useCallback(async () => {
        if (!replyText.trim() || isLoading) return; // লোডিং অবস্থায় ক্লিক অফ রাখুন
        
        try {
            setIsLoading(true);
            const newReply = await onCommentSubmit(postId, comment.id, replyText);
            
            if (newReply) {
                // শুধুমাত্র লোকাল রিপ্লাই লিস্ট আপডেট করুন
                setReplies(prev => [newReply, ...prev]);
                setShowReplies(true);
                setReplyText('');
                setReplyingTo(null);
            }
        } catch (error) {
            console.error("Reply submit failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [replyText, postId, comment.id, onCommentSubmit, isLoading]);

    // ✅ MEMOIZED: Memoize nested reply components to prevent unnecessary re-renders
    const nestedRepliesComponent = useMemo(() => {
        if (!showReplies || replies.length === 0) return null;

        return (
            <div className="mt-4 border-l-2 border-gray-100 pl-4 space-y-4">
                {replies.map((reply: any) => (
                    <CommentItem
                        key={reply.id} 
                        comment={reply}
                        postId={postId}
                        onCommentLike={onCommentLike}
                        onCommentSubmit={onCommentSubmit}
                        isNestedReply={true}
                    />
                ))}
            </div>
        );
    }, [showReplies, replies, postId, onCommentLike, onCommentSubmit]);

    return (
        <div className="mb-4">
            <div className="flex gap-3">
                {/* User Avatar */}
                <div className="h-8 w-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-200">
                    {comment.user?.first_name?.[0]?.toUpperCase() || 'U'}
                </div>

                <div className="flex-1">
                    {/* Comment Bubble */}
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-sm inline-block min-w-[150px]">
                        <span className="font-bold text-blue-700 block text-[13px] mb-0.5">
                            {comment.user?.first_name} {comment.user?.last_name}
                        </span>
                        <p className="text-gray-800 text-[13.5px] leading-snug">
                            {comment.content}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-5 mt-1.5 ml-2 text-[12px]">
                        <button
                            type="button" 
                            onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation();
                                handleLike(comment.id);
                            }}
                            className={`font-semibold transition hover:underline ${localLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                            {localLiked ? 'Liked' : 'Like'}
                            {localLikesCount > 0 && <span className="ml-1">({localLikesCount})</span>}
                        </button>

                        <button
                            onClick={() => {
                                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                setReplyText(`@${comment.user?.first_name} `);
                            }}
                            className="text-gray-500 hover:text-blue-600 font-semibold transition hover:underline"
                        >
                            Reply
                        </button>

                        {comment.replies_count > 0 && (
                            <button
                                onClick={fetchReplies}
                                className="text-blue-600 hover:text-blue-800 font-bold transition flex items-center gap-1"
                            >
                                {isLoading ? '...' : showReplies ? 'Hide' : `View ${comment.replies_count} Replies`}
                            </button>
                        )}
                    </div>

                    {/* Reply Input Box */}
                    {replyingTo === comment.id && (
                        <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-1">
                            <input
                                autoFocus
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                            />
                            <button
                                onClick={handleReplySubmit}
                                className="text-blue-600 font-bold text-sm px-2 hover:scale-105 transition"
                            >
                                Post
                            </button>
                        </div>
                    )}

                    {/* ✅ Memoized Recursive Replies */}
                    {nestedRepliesComponent}
                </div>
            </div>
        </div>
    );
}
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CommentItem from './CommentItem';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface PostCardProps {
    post: any;
    getImageUrl: (path: string | null) => string;
    onCommentLike: (commentId: number, postId: number) => void;
    onLike: (id: number, type: 'post' | 'comment' | 'reply', postId: number) => void;
    onCommentSubmit: (postId: number, parentId: number | null, content: string) => Promise<any>;
    openLikeModal: (id: number, type: string) => void;
}

export default function PostCard({
    post,
    getImageUrl,
    onLike,
    onCommentLike,
    onCommentSubmit,
    openLikeModal
}: PostCardProps) {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // LOCAL state for post like
    const [localPostLiked, setLocalPostLiked] = useState<boolean>(post.is_liked);
    const [localPostLikesCount, setLocalPostLikesCount] = useState<number>(post.likes_count);

    // SYNC LOCAL STATE WITH PROPS when post data changes
    useEffect(() => {
        setLocalPostLiked(post.is_liked);
        setLocalPostLikesCount(post.likes_count);
    }, [post.is_liked, post.likes_count]);

    // MEMOIZED: Handle main comment submit
    const handleMainCommentSubmit = useCallback(async () => {
        if (!commentText.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await onCommentSubmit(post.id, null, commentText);
            setCommentText(''); 
        } catch (error) {
            console.error("Comment failed", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [commentText, isSubmitting, post.id, onCommentSubmit]);

    // MEMOIZED: Handle post like separately
    const handlePostLike = useCallback((postId: number) => {
        // Optimistic update for local state
        setLocalPostLiked(prev => !prev);
        setLocalPostLikesCount(prev => localPostLiked ? prev - 1 : prev + 1);

        // Call parent callback - explicitly pass 'post' type
        onLike(postId, 'post', postId);
    }, [localPostLiked, onLike]);

    // MEMOIZED: Handle comment/reply like separately
    const handleCommentLike = useCallback((id: number) => {
        // Call parent callback - explicitly pass 'comment' or 'reply' type
        onLike(id, 'comment', post.id);
    }, [post.id, onLike]);

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white overflow-hidden">
            {/* Header */}
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between px-4 py-3">
                <div className="d-flex align-items-center gap-3">
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow-sm"
                        style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #4200f7, #7355f7)'
                        }}
                    >
                        {post.user?.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    
                    <div>
                        <h6 className="mb-0 fw-semibold text-dark text-capitalize">
                            {post.user?.first_name} {post.user?.last_name}
                        </h6>
                        <div className="d-flex align-items-center gap-2 text-muted small mt-1">
                            {/* Updated visibility indicator */}
                            <div className={`d-flex align-items-center gap-1 px-2 py-0.5 rounded-pill border ${
                                post.visibility === 'private' 
                                ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' 
                                : 'bg-dark bg-opacity-10 text-primary border-primary border-opacity-25'
                            }`} style={{ fontSize: '11px', fontWeight: '700' }}>
                                {post.visibility === 'private' ? (
                                    <i className="bi bi-lock-fill"></i>
                                ) : (
                                    <i className="bi bi-globe"></i>
                                )}
                                <span className="text-uppercase">
                                    {post.visibility || 'PUBLIC'}
                                </span>
                            </div>

                            <span className="text-secondary opacity-50">•</span>
                            
                            <span>
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div> 
            </div>

            {/* Post Content */}
            <div className="card-body px-4 py-2">
                <p className="mb-0 text-dark" style={{ fontSize: '15.5px', lineHeight: '1.6' }}>
                    {post.content}
                </p>
            </div>

            {/* Post Image Section */}
            {post.image && (
                <div className="px-4 pb-3 mt-2">
                    <div className="rounded-4 overflow-hidden border border-light bg-light shadow-sm">
                        <OptimizedImage 
                            src={getImageUrl(post.image)} 
                            alt="Post media" 
                            className="w-100 h-auto"
                            loading="lazy" 
                            style={{ 
                                maxHeight: '600px',
                                display: 'block',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Engagement Bar */}
            <div className="px-4 py-2 border-top d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePostLike(post.id);
                            }}
                            className={`btn border-0 p-2 d-flex align-items-center gap-2 transition-all ${
                                localPostLiked ? 'text-primary' : 'text-muted hover-bg-light'
                            }`}
                        >
                            <i className={`bi ${localPostLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'} fs-5`}></i>
                            <span 
                                className="fw-medium" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openLikeModal(post.id, 'post');
                                }}
                            >
                                {localPostLikesCount || 0}
                            </span>
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-2 text-muted p-2">
                        <i className="bi bi-chat-dots fs-5"></i>
                        <span className="fw-medium">{post.comments_count || 0}</span>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="px-4 pb-4 bg-light bg-opacity-50 border-top pt-3">
                <div className="mb-3 custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {post.comments?.length > 0 ? (
                        post.comments.map((comment: any) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={post.id}
                                onCommentLike={handleCommentLike}
                                onCommentSubmit={onCommentSubmit}
                            />
                        ))
                    ) : (
                        <p className="text-muted small text-center my-3">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>

                {/* Comment Input */}
                <div className="d-flex align-items-center gap-2 bg-white rounded-4 p-2 border shadow-sm mt-2">
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{
                            width: '35px',
                            height: '35px',
                            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                            fontSize: '12px'
                        }}
                    >
                        ME
                    </div>

                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="form-control border-0 bg-transparent shadow-none px-2 py-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleMainCommentSubmit()}
                    />

                    <button
                        onClick={handleMainCommentSubmit}
                        disabled={!commentText.trim() || isSubmitting}
                        className="btn btn-primary btn-sm px-3 rounded-3"
                    >
                        {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}
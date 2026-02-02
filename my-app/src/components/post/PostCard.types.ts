export interface Author {
    id: string;
    name: string;
    avatar: string;
    username?: string;
}

export interface PostCardProps {
    id: string;
    author: Author;
    content: string;
    image?: string;
    video?: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
    initialIsLiked?: boolean;
    reactionType?: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY" | null;
    initialIsSaved?: boolean;
    isOwner?: boolean;
    onDelete?: () => void;
    onEdit?: (newContent: string) => void;
    onReport?: () => void;
    highlight?: string;
}

export interface Comment {
    id: string;
    author: { id?: string; name: string; avatar: string };
    content: string;
    timestamp: string;
    createdAt: string;
    likes: number;
    isLiked?: boolean;
    reactionType?: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY" | null;
}

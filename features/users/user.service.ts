import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UserRecord } from "@/features/users/user.repository";
import { UserDto } from "@/types/api";

export function toUserDto(user: UserRecord): UserDto {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isAmbassador: user.isAmbassador,
        role: user.role,
    };
}

export type UserProfileDto = UserDto & {
    collectionsCount: number;
    followersCount: number;
    followingCount: number;
};

type UserProfileRecord = {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
    bio: string | null;
    isAmbassador: boolean;
    isPublic: boolean;
    collections: Array<{ id: string }>;
    followers: Array<{ id: string }>;
    following: Array<{ id: string }>;
};

function toUserProfileDto(user: UserProfileRecord): UserProfileDto {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio || undefined,
        isAmbassador: user.isAmbassador,
        collectionsCount: user.collections.length,
        followersCount: user.followers.length,
        followingCount: user.following.length,
    };
}

/**
 * Get user profile with stats (followers, following, collections count)
 */
export async function getUserProfile(userId: string): Promise<UserProfileDto | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            username: true,
            passwordHash: true,
            avatarUrl: true,
            bio: true,
            isAmbassador: true,
            isPublic: true,
            collections: {
                select: { id: true }
            },
            followers: {
                select: { id: true }
            },
            following: {
                select: { id: true }
            }
        }
    });

    if (!user) return null;

    return toUserProfileDto(user);
}

export async function getVisibleUserProfileByUsername(
    username: string,
    viewerUserId?: string | null
): Promise<UserProfileDto | null> {
    const user = await prisma.user.findUnique({
        where: { username: username.trim() },
        select: {
            id: true,
            name: true,
            username: true,
            passwordHash: true,
            avatarUrl: true,
            bio: true,
            isAmbassador: true,
            isPublic: true,
            collections: {
                select: { id: true }
            },
            followers: {
                select: { id: true }
            },
            following: {
                select: { id: true }
            }
        }
    });

    if (!user) return null;

    const isOwnProfile = viewerUserId === user.id;

    if (!user.isPublic && !isOwnProfile) {
        return null;
    }

    return toUserProfileDto(user);
}

export async function isFollowingUser(
    followerId: string,
    followedId: string
): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followedId: {
                followerId,
                followedId
            }
        },
        select: { id: true }
    });

    return Boolean(follow);
}

export async function followUser(
    followerId: string,
    followedId: string
): Promise<"followed" | "already_following" | "cannot_follow_self" | "user_not_found"> {
    if (followerId === followedId) {
        return "cannot_follow_self";
    }

    const user = await prisma.user.findUnique({
        where: { id: followedId },
        select: { id: true }
    });

    if (!user) {
        return "user_not_found";
    }

    const existing = await prisma.follow.findUnique({
        where: {
            followerId_followedId: {
                followerId,
                followedId
            }
        },
        select: { id: true }
    });

    if (existing) {
        return "already_following";
    }

    await prisma.follow.create({
        data: {
            followerId,
            followedId
        }
    });

    return "followed";
}

export async function unfollowUser(
    followerId: string,
    followedId: string
): Promise<"unfollowed" | "not_following"> {
    const existing = await prisma.follow.findUnique({
        where: {
            followerId_followedId: {
                followerId,
                followedId
            }
        },
        select: { id: true }
    });

    if (!existing) {
        return "not_following";
    }

    await prisma.follow.delete({
        where: { id: existing.id }
    });

    return "unfollowed";
}

export type UpdateUserInput = {
    name?: string;
    username?: string;
    bio?: string | null;
    avatarUrl?: string | null;
};

/**
 * Update user profile information
 */
export async function updateUserProfile(userId: string, data: UpdateUserInput): Promise<UserProfileDto | null> {
    const updateData: Prisma.UserUpdateInput = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            name: true,
            username: true,
            passwordHash: true,
            avatarUrl: true,
            bio: true,
            isAmbassador: true,
            isPublic: true,
            collections: {
                select: { id: true }
            },
            followers: {
                select: { id: true }
            },
            following: {
                select: { id: true }
            }
        }
    });

    return toUserProfileDto(user);
}


import {prisma} from "@/lib/prisma";
import {Prisma, FriendshipStatus} from "@prisma/client";
import {UserRecord} from "@/features/users/user.repository";
import {UserDto} from "@/types/api";

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
            sentFriendships: {
                where: { status: FriendshipStatus.ACCEPTED },
                select: { id: true }
            },
            receivedFriendships: {
                where: { status: FriendshipStatus.ACCEPTED },
                select: { id: true }
            }
        }
    });

    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio || undefined,
        isAmbassador: user.isAmbassador,
        collectionsCount: user.collections.length,
        followersCount: user.receivedFriendships.length,
        followingCount: user.sentFriendships.length,
    };
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
            sentFriendships: {
                where: { status: FriendshipStatus.ACCEPTED },
                select: { id: true }
            },
            receivedFriendships: {
                where: { status: FriendshipStatus.ACCEPTED },
                select: { id: true }
            }
        }
    });

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio || undefined,
        isAmbassador: user.isAmbassador,
        collectionsCount: user.collections.length,
        followersCount: user.receivedFriendships.length,
        followingCount: user.sentFriendships.length,
    };
}


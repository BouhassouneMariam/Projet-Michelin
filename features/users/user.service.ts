import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
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
    };
}


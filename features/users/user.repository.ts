import {Prisma} from "@prisma/client";
import {prisma} from "@/lib/prisma";

const userSelect = {
    id: true,
    name: true,
    username: true,
    passwordHash: true,
    avatarUrl: true,
    bio: true,
    isAmbassador: true,
    role: true,
} satisfies Prisma.UserSelect;

export type UserRecord = Prisma.UserGetPayload<{
    select: typeof userSelect;
}>;
export type SaveUserInput = {
    name: string;
    username: string;
    passwordHash: string;
};

export async function findUserByUsername(username: string) {
    return prisma.user.findUnique({
            where: {
                username: username.trim()
            }, select: userSelect
        }
    ) as Promise<UserRecord | null>;
}

export async function saveUser(user: SaveUserInput): Promise<UserRecord> {
    return prisma.user.create(
        {
            data: {
                name: user.name,
                username: user.username,
                passwordHash: user.passwordHash
            }, select: userSelect
        }
    )
}
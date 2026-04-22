import {findUserByUsername, saveUser, SaveUserInput} from "@/features/users/user.repository";
import argon2 from "argon2";
import {toUserDto} from "@/features/users/user.service";

export async function loginWithUsername(username: string, password: string)
{
    const user= await findUserByUsername(username);
    if(!user){
        return null;
    }
    const isValid= await argon2.verify(user.passwordHash,password);
    if(!isValid)
    {
        return null;
    }
    else{
        return toUserDto(user);
    }
}

export async function register(name:string, username: string, password: string)
{
    const user = await findUserByUsername(username);
    if(user){
        return;
    }
    const passwordHash= await argon2.hash(password);
    const userInput: SaveUserInput=
        {
            name:name,
            username:username,
            passwordHash: passwordHash
        }
    const createdUser = await saveUser(userInput);
    return toUserDto(createdUser);
}
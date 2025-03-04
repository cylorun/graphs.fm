import {db} from '../db'
import {User, users} from '../db/schema'

export function getAllUsers(): Promise<User[]> {
    return db.select().from(users);
}
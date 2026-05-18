import bcrypt from "bcryptjs"
import type { User} from "~/common/interface/user-item"

// In-memory store — reset tiap restart dev server
export const users: User[] = [
    {
        id: 'a58a5e1f-42fe-489e-8645-8a55c8936dd7',
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordHash: bcrypt.hashSync('password123', 10), // "password123"
        avatar: '/avatars/Linus_Torvalds.webp',
        createdAt: new Date().toISOString(),
    }
]
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from './UsersContainer.module.css'

export default function UsersContainer() {
    
    const [users, setUsers] = useState([]);
    const [sortCrit, setSortCrit] = useState('email');
    const [sortOrder, setSortOrder] = useState<string>('asc');

    const getUsers = async () => {
        const res = await fetch('./api/user');
        const users = await res.json();
        users.sort(
            (user1: User, user2: User) => user1['email'] < user2['email'] ? -1 : 1
        );
        setUsers(users);
    }

    useEffect(() => {
        getUsers();
    }, [])

    const sort = (crit: string) => {
        const sortedUsers = [...users].sort(
            (user1, user2) => user1[crit] < user2[crit] ? -1 : 1
        );
        if (sortOrder == 'desc') {
            setSortOrder('asc');
        } else if (sortCrit === crit) {
            setSortOrder('desc');
            sortedUsers.reverse();
        }
        setSortCrit(crit);
        setUsers(sortedUsers);
    }
    
    return (
        <div>
            <h2>Users</h2>
            <table className={styles.usersTable}>
                <thead>
                    <tr>
                        <th onClick={() => sort('email')}>Email address</th>
                        <th onClick={() => sort('name')}>Name</th>
                        <th onClick={() => sort('role')}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: User) => (
                        <tr key={user.id} className={styles.usersTableRow}>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
        </div>
    )
}
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { removeDiacritics } from "../lib/helper_functions";
import styles from './AdminUsersContainer.module.css'

export default function UsersContainer() {
    
    const [users, setUsers] = useState([]);
    const [sortCrit, setSortCrit] = useState<keyof User>('email');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchCrit, setSearchCrit] = useState('');

    const getUsers = async () => {
        const res = await fetch('./api/users');
        const users = await res.json();
        users.sort((user1: User, user2: User) => user1[sortCrit]! < user2[sortCrit]! ? -1 : 1);
        setUsers(users);
    }

    useEffect(() => {
        getUsers();
    }, [])

    const sort = (crit: keyof User) => {
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

            <input type='text' placeholder="Search users" onChange={event => setSearchCrit(event.target.value.toLocaleLowerCase())} />

            {searchCrit && (
                <table className='table'>
                    <thead>
                        <tr>
                            <th onClick={() => sort('email')}>Email address</th>
                            <th onClick={() => sort('name')}>Name</th>
                            <th onClick={() => sort('role')}>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter((user: User) => {
                            if (searchCrit === '') return true;
                            if (removeDiacritics(user.email.toLocaleLowerCase()).includes(searchCrit) ||
                                removeDiacritics(user.name.toLocaleLowerCase()).includes(searchCrit)) return true;
                            return false;
                        }).map((user: User) => (
                            <tr key={user.id} className={styles.usersTableRow}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
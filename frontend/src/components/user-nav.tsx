import {PublicUser} from "@shared/types";


export type UserNavProps = {
    user: PublicUser;
    className?: string;
    tab: "overview" | "top" | "reccomended" | "friends";
}

const UserNav = ({user, tab, className}: UserNavProps) => {


    return (
        <div className={`flex flex-col gap-8 ${className || ""}`}>
            {/*uid: {uid ? uid : "Loading..."}*/}
            <div className={'flex gap-4 items-center'}>
                <img
                    src={user.profileImage}
                    alt="Profile image"
                    className={'size-48 rounded-[50%]'}
                />
                <div>
                    <h2 className={'text-2xl mb-4'}>{user.username}</h2>
                    <p>Joined {user.createdAt?.toLocaleDateString()}</p>
                    <p>0 friends</p>
                </div>
            </div>
            <ul className={'flex gap-4'}>
                <a className={`usr-nav-item ${tab === 'overview' ? 'bg-green-600' : 'bg-gray-800'}`}
                   href={`/user/${user.id}/`}>Overview</a>
                <a className={`usr-nav-item ${tab === 'top' ? 'bg-green-600' : 'bg-gray-800'}`}
                   href={`/user/${user.id}/top`}>Top</a>
                <a
                    className={`usr-nav-item ${tab === 'reccomended' ? 'bg-green-600' : 'bg-gray-800'}`}
                    href={`/user/${user.id}/recs`}>Recs</a>

                <a className={`usr-nav-item ${tab === 'friends' ? 'bg-green-600' : 'bg-gray-800'}`}
                   href={`/user/${user.id}/friends`}>Friends</a>
            </ul>
        </div>
    )
}

export default UserNav;
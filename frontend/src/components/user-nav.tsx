

export type UserNavProps = {
    uid?: string;
    className?: string;
    tab: "overview" | "top" | "reccomended" | "friends";
}

const UserNav = ({uid, tab, className}: UserNavProps) => {


    return (
        <div className={`flex flex-col gap-8 ${className || ""}`}>
            {/*uid: {uid ? uid : "Loading..."}*/}
            <div className={'flex gap-4 items-center'}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"
                    alt=""
                    className={'size-48'}
                />
                <div>
                    <h2 className={'text-2xl mb-4'}>{uid}</h2>
                    <p>Joined today</p>
                    <p>0 friends</p>
                </div>
            </div>
            <ul className={'flex gap-4'}>
                <a className={`usr-nav-item ${tab === 'overview' ? 'bg-green-600' : 'bg-gray-800'}`}
                   href={`/user/${uid}/`}>Overview</a>
                <a className={`usr-nav-item ${tab === 'top' ? 'bg-green-600' : 'bg-gray-800'}`}
                   href={`/user/${uid}/top`}>Top</a>
                <a
                    className={`usr-nav-item ${tab === 'reccomended' ? 'bg-green-600' : 'bg-gray-800'}`}
                    href={`/user/${uid}/recs`}>Recs</a>

                <a className={`usr-nav-item ${tab === 'friends' ? 'bg-green-600' : 'bg-gray-800'}`}
                   href={`/user/${uid}/friends`}>Friends</a>
            </ul>
        </div>
    )
}

export default UserNav;
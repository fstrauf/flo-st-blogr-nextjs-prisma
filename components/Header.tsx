// Header.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
      <Link href="/"  data-active={isActive('/')}>
          Feed
      </Link>
     
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
        <Link href="/" className="bold" data-active={isActive('/')}>
            Feed
        </Link>
        
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
       
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
        <Link href="/api/auth/signin" data-active={isActive('/signup')}>
          Log in
        </Link>
       
      </div>
    );
  }

  if (session) {
    left = (
      <div className='flex '>
        <Link href="/" className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" data-active={isActive('/')}>
            Home
        </Link>
        {/* <Link href="/drafts" className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" data-active={isActive('/drafts')}>
          My drafts
        </Link>
        <Link href="/content" className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" data-active={isActive('/content')}>
          Content
        </Link> */}
     
      </div>
    );
    right = (
      <div className="flex">
        <p className='m-2'>
          {session.user.name} ({session.user.email})
        </p>
        <Link className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" href="/newContent">
          <button>
            New content
          </button>
        </Link>
        <Link className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" href="/newRewardRound">
          <button>
            New Reward Round
          </button>
        </Link>
        <button className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" onClick={() => signOut()}>
          <a>Log out</a>
        </button>
       
      </div>
    );
  }

  return (
    <nav className="mt-16 mb-16 flex flex-col items-center md:mb-12 md:flex-row md:justify-between">
      {left}
      {right}
  
    </nav>
  );
};

export default Header;

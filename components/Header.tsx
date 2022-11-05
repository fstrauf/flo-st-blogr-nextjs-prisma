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
    <div className="left">
      <Link href="/" className="bold" data-active={isActive('/')}>
        {/* <a className="bold" data-active={isActive('/')}> */}
          Feed
        {/* </a> */}
      </Link>
     
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/" className="bold" data-active={isActive('/')}>
          {/* <a className="bold" data-active={isActive('/')}> */}
            Feed
          {/* </a> */}
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
      <div className="right">
        <Link href="/api/auth/signin" data-active={isActive('/signup')}>
          Log in
        </Link>
       
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/" className="bold" data-active={isActive('/')}>
            Feed
        </Link>
        <Link href="/drafts" data-active={isActive('/drafts')}>
          My drafts
        </Link>
        <Link href="/content" data-active={isActive('/content')}>
          Content
        </Link>
     
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/newContent">
          <button>
            New content
          </button>
        </Link>
        <Link href="/newRewardRound">
          <button>
            New Reward Round
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
       
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
  
    </nav>
  );
};

export default Header;

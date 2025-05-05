import Link from 'next/link'

export default function Header() {
    return (
        <header className="w-full bg-white shadow-md py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/">
                    <span className="text-xl font-bold text-blue-600 cursor-pointer">SocialDash</span>
                </Link>

                <nav className="flex space-x-6 text-gray-700 font-medium">
                    <Link href="/">
                        <span className="hover:text-blue-600 transition cursor-pointer">Home</span>
                    </Link>
                    <Link href="/about">
                        <span className="hover:text-blue-600 transition cursor-pointer">About</span>
                    </Link>
                    <Link href="/login">
                        <span className="hover:text-blue-600 transition cursor-pointer">Login</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}

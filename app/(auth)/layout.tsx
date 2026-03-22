interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <>
        <h1>Auth Layout</h1>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {children}
        </div>
        </>
    )
}
export default AuthLayout;
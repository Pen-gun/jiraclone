interface SignInLayoutProps {
    children: React.ReactNode;
}

const SignInLayout = ({ children }: SignInLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1>Sign-in</h1>
            {children}
        </div>
    );
}
export default SignInLayout;
// app/layout.tsx
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <title>Whisper API App</title>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
};

export default Layout;
